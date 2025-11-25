import firebaseConfig from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
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

console.log('firebase.js starting, projectId =', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const globalScope = typeof window !== 'undefined' ? window : globalThis;
const PRODUCTS_COLLECTION = 'products';

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
  return false;
}

function createFirebaseProductsService(database) {
  let emulatorLinked = false;

  async function init() {
    const activeDb = database;
    maybeConnectEmulator(activeDb);
    return activeDb;
  }

  function maybeConnectEmulator() {
    return;
  }

  async function seedDemoProducts(products = []) {
    if (!Array.isArray(products) || products.length === 0) return false;
    const activeDb = await init();
    const snapshot = await getDocs(collection(activeDb, PRODUCTS_COLLECTION));
    if (!snapshot.empty) return false;
    const batch = writeBatch(activeDb);
    products.forEach((product) => {
      const clean = sanitizeProduct(product);
      const target = doc(activeDb, PRODUCTS_COLLECTION, clean.id);
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
    const activeDb = await init();
    const productsQuery = query(collection(activeDb, PRODUCTS_COLLECTION), orderBy('name', 'asc'));
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
    const activeDb = await init();
    const clean = sanitizeProduct(product);
    const ref = doc(activeDb, PRODUCTS_COLLECTION, clean.id);
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
    const activeDb = await init();
    await deleteDoc(doc(activeDb, PRODUCTS_COLLECTION, productId));
  }

  return Object.freeze({
    init,
    seedDemoProducts,
    subscribeToProducts,
    addProduct,
    removeProduct,
  });
}

export const firebaseProductsService = createFirebaseProductsService(db);

export async function loadProductsFromFirestore() {
  const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}


console.log('firebase.js loaded');
