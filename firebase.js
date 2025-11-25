import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
} from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

const PRODUCTS_COLLECTION = 'products';
const CONFIG_READY_EVENT = 'firebase-config-ready';

const globalScope = typeof window !== 'undefined' ? window : globalThis;

function readFirebaseConfig() {
  if (globalScope.__FIREBASE_CONFIG__) return globalScope.__FIREBASE_CONFIG__;
  if (globalScope.__FIREBASE_DEFAULTS__?.config) return globalScope.__FIREBASE_DEFAULTS__.config;
  if (globalScope.firebaseConfig) return globalScope.firebaseConfig;
  try {
    const inlineConfig =
      document.querySelector('script[type="application/json"][data-firebase-config]') ||
      document.getElementById('firebase-config');
    if (inlineConfig?.textContent) {
      return JSON.parse(inlineConfig.textContent);
    }
  } catch (error) {
    console.warn('Failed to parse inline Firebase config', error);
  }
  return null;
}

let firebaseConfigPromise = null;
let firebaseProductsPromise = null;
let firebaseConfigLogState = {
  success: false,
  failure: false,
};

function waitForFirebaseConfig(timeout = 5000) {
  const immediate = readFirebaseConfig();
  if (immediate) {
    globalScope.firebaseConfig = immediate;
    return Promise.resolve(immediate);
  }
  if (firebaseConfigPromise) return firebaseConfigPromise;

  firebaseConfigPromise = new Promise((resolve) => {
    let settled = false;
    let timeoutId;

    function cleanup() {
      globalScope.removeEventListener?.(CONFIG_READY_EVENT, handleReady);
      if (globalScope.document) {
        globalScope.document.removeEventListener('DOMContentLoaded', tryResolve);
      }
      if (timeoutId) {
        globalScope.clearTimeout(timeoutId);
      }
    }

    function finish(config) {
      if (settled) return;
      settled = true;
      cleanup();
      if (config && !globalScope.firebaseConfig) {
        globalScope.firebaseConfig = config;
      }
      resolve(config || null);
    }

    function tryResolve() {
      const config = readFirebaseConfig();
      if (config) {
        finish(config);
      }
    }

    function handleReady(event) {
      if (event?.detail) {
        finish(event.detail);
      } else {
        tryResolve();
      }
    }

    timeoutId = globalScope.setTimeout(() => {
      finish(readFirebaseConfig());
    }, timeout);

    globalScope.addEventListener?.(CONFIG_READY_EVENT, handleReady);
    if (globalScope.document) {
      globalScope.document.addEventListener('DOMContentLoaded', tryResolve, { once: true });
    }

    tryResolve();
  });

  return firebaseConfigPromise;
}

function sanitizeProduct(product = {}) {
  return {
    id: product.id || `product-${Date.now()}`,
    name: product.name || 'Uus toode',
    price: Number(product.price) || 0,
    category: product.category || 'Määramata',
    description: product.description || '',
    image: product.image || 'https://source.unsplash.com/600x600/?product',
    featured: Boolean(product.featured),
    adult: Boolean(product.adult),
  };
}

function shouldUseEmulator() {
  if (!globalScope.location) return false;
  if (globalScope.__USE_FIREBASE_EMULATORS__) return true;
  const hosts = ['localhost', '127.0.0.1'];
  if (hosts.includes(globalScope.location.hostname)) return true;
  return /[?&]useEmulator=true/i.test(globalScope.location.search || '');
}

function createFirebaseProductsService(config) {
  let appInstance;
  let dbInstance;
  let emulatorLinked = false;
  let initLogged = false;

  async function init() {
    if (dbInstance) return dbInstance;
    if (!config) {
      throw new Error('Firebase config missing. Cannot initialise Firestore.');
    }
    const existing = getApps();
    appInstance = existing.length ? existing[0] : initializeApp(config);
    dbInstance = getFirestore(appInstance);
    if (!initLogged) {
      console.log('Firebase initialised with config:', config.projectId || '(unknown project)');
      initLogged = true;
    }
    maybeConnectEmulator();
    return dbInstance;
  }

  function maybeConnectEmulator() {
    if (emulatorLinked || !dbInstance || !shouldUseEmulator()) return;
    const emulatorSettings = globalScope.__FIREBASE_EMULATORS__?.firestore || {};
    const host = emulatorSettings.host || '127.0.0.1';
    const port = Number(emulatorSettings.port) || 8080;
    console.info(`Connecting to Firestore emulator at ${host}:${port}`);
    connectFirestoreEmulator(dbInstance, host, port);
    emulatorLinked = true;
  }

  async function seedDemoProducts(products = []) {
    if (!Array.isArray(products) || products.length === 0) return false;
    const db = await init();
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (!snapshot.empty) return false;
    const batch = writeBatch(db);
    products.forEach((product) => {
      const clean = sanitizeProduct(product);
      const target = doc(db, PRODUCTS_COLLECTION, clean.id);
      const { id, ...rest } = clean;
      batch.set(target, {
        ...rest,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
    return true;
  }

  async function subscribeToProducts(callback) {
    if (typeof callback !== 'function') {
      throw new Error('subscribeToProducts callback must be a function');
    }
    const db = await init();
    const productsQuery = query(collection(db, PRODUCTS_COLLECTION), orderBy('name', 'asc'));
    return onSnapshot(
      productsQuery,
      (snapshot) => {
        const payload = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        callback(payload);
      },
      (error) => {
        console.error('Products listener error', error);
      },
    );
  }

  async function addProduct(product) {
    const db = await init();
    const clean = sanitizeProduct(product);
    const ref = doc(db, PRODUCTS_COLLECTION, clean.id);
    const existing = await getDoc(ref);
    const timestamps = existing.exists()
      ? { updatedAt: serverTimestamp() }
      : { createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
    const { id, ...rest } = clean;
    await setDoc(ref, { ...rest, ...timestamps }, { merge: true });
    return clean.id;
  }

  async function removeProduct(productId) {
    if (!productId) return;
    const db = await init();
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  }

  return Object.freeze({
    isAvailable: true,
    init,
    seedDemoProducts,
    subscribeToProducts,
    addProduct,
    removeProduct,
  });
}

async function ensureFirebaseProductsService() {
  if (globalScope.firebaseProducts) return globalScope.firebaseProducts;
  if (firebaseProductsPromise) return firebaseProductsPromise;

  firebaseProductsPromise = waitForFirebaseConfig().then((config) => {
    if (!config) {
      if (!firebaseConfigLogState.failure) {
        console.error('Firebase config missing. Firestore features are disabled.');
        firebaseConfigLogState.failure = true;
      }
      return null;
    }
    if (!firebaseConfigLogState.success && config.projectId) {
      console.log(`Firebase config loaded for project ${config.projectId}`);
      firebaseConfigLogState.success = true;
    }
    const service = createFirebaseProductsService(config);
    globalScope.firebaseProducts = service;
    return service;
  });

  return firebaseProductsPromise;
}

async function loadProductsFromFirestore() {
  const firebaseProducts = await ensureFirebaseProductsService();
  if (!firebaseProducts) {
    console.error('Firebase config missing. Cannot load products.');
    throw new Error('Firebase config missing. Cannot load products.');
  }
  const db = await firebaseProducts.init();
  const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
  const products = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
  products.sort((a, b) => a.name.localeCompare(b.name));
  return products;
}

globalScope.loadProductsFromFirestore = loadProductsFromFirestore;

console.log('firebase.js loaded');
