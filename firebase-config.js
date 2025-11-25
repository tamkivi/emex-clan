window.firebaseConfig = {
  apiKey: 'AIzaSyDEnfGefS0oKYvcGmyQApHTq8IuBKGtsFA',
  authDomain: 'emex-clan.firebaseapp.com',
  projectId: 'emex-clan',
  storageBucket: 'emex-clan.firebasestorage.app',
  messagingSenderId: '881740542177',
  appId: '1:881740542177:web:a24906c809519f4d9787a0',
  measurementId: 'G-HMZPQW1VBB',
};

if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
  window.dispatchEvent(
    new CustomEvent('firebase-config-ready', {
      detail: window.firebaseConfig,
    }),
  );
}

console.log('firebase-config.js loaded');
