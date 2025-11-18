import admin from 'firebase-admin';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '..', 'data', 'products.json');

function sanitizeProduct(product = {}) {
  const priceNumber = Number(product.price);
  return {
    id: product.id || `product-${Date.now()}`,
    name: product.name || 'Uus toode',
    price: Number.isFinite(priceNumber) ? priceNumber : 0,
    category: product.category || 'Määramata',
    description: product.description || '',
    image: product.image || 'https://source.unsplash.com/600x600/?product',
    featured: Boolean(product.featured),
    adult: Boolean(product.adult),
  };
}

async function ensureFirebase() {
  if (admin.apps.length) return admin.app();
  try {
    return admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.error('Failed to initialise Firebase Admin SDK. Did you set GOOGLE_APPLICATION_CREDENTIALS?', error);
    throw error;
  }
}

async function seed() {
  const raw = await readFile(dataPath, 'utf8');
  const payload = JSON.parse(raw);
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error('products.json is empty – nothing to seed.');
  }

  await ensureFirebase();
  const db = admin.firestore();
  const batch = db.batch();

  payload.forEach((product) => {
    const clean = sanitizeProduct(product);
    const ref = db.collection('products').doc(clean.id);
    const { id, ...rest } = clean;
    batch.set(
      ref,
      {
        ...rest,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  });

  await batch.commit();
  console.log(`Seeded ${payload.length} products to Firestore.`);
}

seed().catch((error) => {
  console.error('Failed to seed products', error);
  process.exitCode = 1;
});
