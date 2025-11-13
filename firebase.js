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
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

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

  async function init() {
    if (dbInstance) return dbInstance;
    const existing = getApps();
    appInstance = existing.length ? existing[0] : initializeApp(config);
    dbInstance = getFirestore(appInstance);
    maybeConnectEmulator();
    return dbInstance;
  }

  function maybeConnectEmulator() {
    if (emulatorLinked || !dbInstance || !shouldUseEmulator()) return;
    const emulatorSettings = globalScope.__FIREBASE_EMULATORS__?.firestore || {};
    const host = emulatorSettings.host || '127.0.0.1';
    const port = Number(emulatorSettings.port) || 8080;
    connectFirestoreEmulator(dbInstance, host, port);
    emulatorLinked = true;
  }

  async function subscribeToProducts(callback) {
    if (typeof callback !== 'function') {
      throw new Error('subscribeToProducts callback must be a function');
    }
    const db = await init();
    const productsQuery = query(collection(db, 'products'), orderBy('name', 'asc'));
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
    const ref = doc(db, 'products', clean.id);
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
    await deleteDoc(doc(db, 'products', productId));
  }

  return Object.freeze({
    isAvailable: true,
    init,
    subscribeToProducts,
    addProduct,
    removeProduct,
  });
}

const firebaseConfig = readFirebaseConfig();
if (!firebaseConfig) {
  console.warn('Firebase config not found. Products cannot be synced.');
}

globalScope.firebaseProducts = firebaseConfig ? createFirebaseProductsService(firebaseConfig) : null;
