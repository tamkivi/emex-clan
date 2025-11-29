(function () {
  if (typeof window === 'undefined') return;
  if (!window.firebaseConfig) {
    console.error('firebase.js: firebaseConfig missing');
    return;
  }
  if (!window.firebase) {
    console.error('firebase.js: firebase namespace missing. Ensure Firebase CDN scripts are loaded first.');
    return;
  }

  console.log('firebase.js starting, projectId =', window.firebaseConfig.projectId);

  const app = firebase.apps && firebase.apps.length ? firebase.app() : firebase.initializeApp(window.firebaseConfig);
  const db = firebase.firestore(app);
  const PRODUCTS_COLLECTION = 'products';
  const timestamp = firebase.firestore.FieldValue.serverTimestamp;

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

  function createFirebaseProductsService(database) {
    async function init() {
      return database;
    }

    async function seedDemoProducts(products = []) {
      if (!Array.isArray(products) || products.length === 0) return false;
      const activeDb = await init();
      const snapshot = await activeDb.collection(PRODUCTS_COLLECTION).get();
      if (!snapshot.empty) return false;
      const batch = activeDb.batch();
      products.forEach((product) => {
        const clean = sanitizeProduct(product);
        const ref = activeDb.collection(PRODUCTS_COLLECTION).doc(clean.id);
        const { id, ...rest } = clean;
        batch.set(ref, {
          ...rest,
          createdAt: timestamp(),
          updatedAt: timestamp(),
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
      const queryRef = activeDb.collection(PRODUCTS_COLLECTION).orderBy('name', 'asc');
      return queryRef.onSnapshot(
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
      const ref = activeDb.collection(PRODUCTS_COLLECTION).doc(clean.id);
      const existing = await ref.get();
      const timestamps = existing.exists
        ? { updatedAt: timestamp() }
        : { createdAt: timestamp(), updatedAt: timestamp() };
      const { id, ...rest } = clean;
      await ref.set({ ...rest, ...timestamps }, { merge: true });
      return clean.id;
    }

    async function removeProduct(productId) {
      if (!productId) return;
      const activeDb = await init();
      await activeDb.collection(PRODUCTS_COLLECTION).doc(productId).delete();
    }

    return Object.freeze({
      init,
      seedDemoProducts,
      subscribeToProducts,
      addProduct,
      removeProduct,
    });
  }

  const firebaseProductsService = createFirebaseProductsService(db);
  window.firebaseProductsService = firebaseProductsService;

  async function loadProductsFromFirestore() {
    const querySnapshot = await db.collection(PRODUCTS_COLLECTION).orderBy('name', 'asc').get();
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  }

  window.loadProductsFromFirestore = loadProductsFromFirestore;

  console.log('firebase.js loaded');
})();
