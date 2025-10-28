const bodyEl = document.body;
const views = {
  welcome: document.getElementById('view-welcome'),
  home: document.getElementById('view-home'),
  teated: document.getElementById('view-teated'),
  ostukorv: document.getElementById('view-ostukorv'),
  settings: document.getElementById('view-settings'),
  admin: document.getElementById('view-admin'),
};

const els = {
  categoryList: document.getElementById('categoryList'),
  featuredList: document.getElementById('featuredList'),
  cartList: document.getElementById('cartList'),
  cartTotal: document.getElementById('cartTotal'),
  productModal: document.getElementById('productModal'),
  productModalTitle: document.getElementById('productModalTitle'),
  productModalPrice: document.getElementById('productModalPrice'),
  productModalDescription: document.getElementById('productModalDescription'),
  productModalImage: document.getElementById('productModalImage'),
  productModalAdd: document.getElementById('productModalAdd'),
  adminProductForm: document.getElementById('adminProductForm'),
  adminProductTable: document.getElementById('adminProductTable'),
  statsProducts: document.getElementById('statsProducts'),
  statsCategories: document.getElementById('statsCategories'),
  statsCartItems: document.getElementById('statsCartItems'),
  accountForm: document.getElementById('accountForm'),
  preferencesForm: document.getElementById('preferencesForm'),
  settingsLocation: document.getElementById('settingsLocation'),
  settingsCurrency: document.getElementById('settingsCurrency'),
  settingsAdult: document.getElementById('settingsAdult'),
  settings2fa: document.getElementById('settings2fa'),
  settingsSessionAlerts: document.getElementById('settingsSessionAlerts'),
  themeRadios: document.querySelectorAll('input[name="theme"]'),
  viewCartShortcut: document.getElementById('viewCartShortcut'),
  openAdmin: document.getElementById('openAdmin'),
  sendLoginLink: document.getElementById('sendLoginLink'),
  openHelp: document.getElementById('openHelp'),
  reportIssue: document.getElementById('reportIssue'),
  categoryOptions: document.getElementById('categoryOptions'),
  settingsBtn: document.getElementById('settingsBtn'),
  notificationsBtn: document.getElementById('notificationsBtn'),
  cartBtn: document.getElementById('cartBtn'),
  quickActionsPanel: document.getElementById('quickActionsPanel'),
};

const currencyInfo = {
  EUR: { symbol: '€', rate: 1, locale: 'et-EE', currency: 'EUR' },
  USD: { symbol: '$', rate: 1.08, locale: 'en-US', currency: 'USD' },
  GBP: { symbol: '£', rate: 0.86, locale: 'en-GB', currency: 'GBP' },
  SEK: { symbol: 'kr', rate: 11.2, locale: 'sv-SE', currency: 'SEK' },
};

const initialProducts = [
  {
    id: 'tech-keyboard',
    name: 'Mehaaniline klaviatuur Pro',
    price: 129,
    category: 'Tehnika ja elektroonika',
    description: 'RGB valgustus, hot-swap lülitid ja alumiiniumkorpus.',
    image: 'https://source.unsplash.com/600x600/?mechanical%20keyboard',
    featured: true,
  },
  {
    id: 'tech-headphones',
    name: 'Mürasummutavad kõrvaklapid',
    price: 159,
    category: 'Tehnika ja elektroonika',
    description: '40 tundi aku ja ultra-kerge disain igapäevaseks kasutuseks.',
    image: 'https://source.unsplash.com/600x600/?noise-cancelling%20headphones',
    featured: true,
  },
  {
    id: 'tech-lamp',
    name: 'Tark valgustuskomplekt',
    price: 24.9,
    category: 'Tehnika ja elektroonika',
    description: 'Juhi tulesid telefonist ja loo automaatseid stseene.',
    image: 'https://source.unsplash.com/600x600/?smart%20lamp',
  },
  {
    id: 'tech-speaker',
    name: 'Bluetooth kõlar Wave',
    price: 129.9,
    category: 'Tehnika ja elektroonika',
    description: 'Veekindel 360° heli ja 18 tundi taasesitust.',
    image: 'https://source.unsplash.com/600x600/?bluetooth%20speaker',
    featured: true,
  },
  {
    id: 'tech-drone',
    name: 'Droon Skyview',
    price: 1199,
    category: 'Tehnika ja elektroonika',
    description: '5K kaamera, 45 minutit lendu ja takistuste vältimine.',
    image: 'https://source.unsplash.com/600x600/?camera%20drone',
    featured: true,
  },
  {
    id: 'home-coffee',
    name: 'Nutikas kohvimasin Barista',
    price: 349,
    category: 'Kodutarbed ja elustiil',
    description: 'Appiga juhitavad retseptid ja automaatne puhastusprogramm.',
    image: 'https://source.unsplash.com/600x600/?smart%20coffee%20machine',
    featured: true,
  },
  {
    id: 'stationery-notebook',
    name: 'Taaskasutatud märkmik',
    price: 5.4,
    category: 'Kontor ja papertarbed',
    description: 'Dotted-lehed ja avatud selg – ideaalne märkmete või visandite jaoks.',
    image: 'https://source.unsplash.com/600x600/?recycled%20notebook',
    featured: true,
  },
  {
    id: 'food-berries',
    name: 'Külmutatud marjasegu 750 g',
    price: 6.9,
    category: 'Toit ja joogid',
    description: 'Kodumaine mustika-vaarika segu ilma lisatud suhkruta.',
    image: 'https://source.unsplash.com/600x600/?frozen%20berries',
  },
  {
    id: 'drink-coldbrew',
    name: 'Külmpruulitud kohv',
    price: 3.7,
    category: 'Toit ja joogid',
    description: '330 ml pudel – serveeri jahutatult või jääl.',
    image: 'https://source.unsplash.com/600x600/?cold%20brew%20coffee',
    featured: true,
  },
  {
    id: 'drink-craftbeer',
    name: 'Käsitööõlle komplekt',
    price: 14.9,
    category: 'Toit ja joogid',
    description: 'Kolm väikepruulikoja maitset koos degusteerimisjuhisega.',
    image: 'https://source.unsplash.com/600x600/?craft%20beer',
    adult: true,
  },
  {
    id: 'fashion-hoodie',
    name: 'Unisex kapuutsiga pusa',
    price: 49,
    category: 'Riided ja aksessuaarid',
    description: 'Orgaanilisest puuvillast, saadaval suurustes XS–XL.',
    image: 'https://source.unsplash.com/600x600/?unisex%20hoodie',
  },
  {
    id: 'fashion-jacket',
    name: 'Vetthülgav parkakittel',
    price: 129,
    category: 'Riided ja aksessuaarid',
    description: 'Kerge, transporditav ja sobib põhjamaise ilmaga.',
    image: 'https://source.unsplash.com/600x600/?parka%20jacket',
  },
  {
    id: 'stationery-pen',
    name: 'Metallist täitesulepea',
    price: 29.5,
    category: 'Kontor ja papertarbed',
    description: 'Vahetatavad tindipadrunid ja ergonoomiline haare.',
    image: 'https://source.unsplash.com/600x600/?fountain%20pen',
  },
];

const storedPreferences = {
  theme: localStorage.getItem('theme'),
  location: localStorage.getItem('location'),
  currency: localStorage.getItem('currency'),
  showAdult: localStorage.getItem('showAdult'),
  twoFactor: localStorage.getItem('twoFactor'),
  sessionAlerts: localStorage.getItem('sessionAlerts'),
};

const state = {
  theme: storedPreferences.theme || 'dark',
  location: storedPreferences.location || 'Tallinn, Eesti',
  currency: storedPreferences.currency || 'EUR',
  showAdult: storedPreferences.showAdult !== null ? storedPreferences.showAdult === 'true' : true,
  twoFactor: storedPreferences.twoFactor === 'true',
  sessionAlerts: storedPreferences.sessionAlerts === 'true',
  cart: (() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.warn('Failed to parse saved cart', err);
      return [];
    }
  })(),
  products: [...initialProducts],
};

let activeProductId = null;
let welcomeTimeout;

function savePreferences() {
  localStorage.setItem('theme', state.theme);
  localStorage.setItem('location', state.location);
  localStorage.setItem('currency', state.currency);
  localStorage.setItem('showAdult', String(state.showAdult));
  localStorage.setItem('twoFactor', String(state.twoFactor));
  localStorage.setItem('sessionAlerts', String(state.sessionAlerts));
}

function persistCart() {
  localStorage.setItem('cart', JSON.stringify(state.cart));
}

function applyTheme() {
  bodyEl.classList.remove('theme-light', 'theme-dark');
  bodyEl.classList.add(`theme-${state.theme}`);
}

function formatPrice(priceEUR) {
  const info = currencyInfo[state.currency] || currencyInfo.EUR;
  const value = priceEUR * info.rate;
  return new Intl.NumberFormat(info.locale, {
    style: 'currency',
    currency: info.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getProductById(id) {
  return state.products.find((product) => product.id === id);
}

function getCategories() {
  const unique = new Set(state.products.map((product) => product.category));
  return Array.from(unique);
}

function getCartCount() {
  return state.cart.reduce((total, item) => total + item.quantity, 0);
}

function renderCategoryOptions() {
  if (!els.categoryOptions) return;
  els.categoryOptions.innerHTML = '';
  getCategories().forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    els.categoryOptions.append(option);
  });
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.productId = product.id;

  const img = document.createElement('img');
  img.src = product.image;
  img.alt = product.name;
  card.append(img);

  const title = document.createElement('h3');
  title.textContent = product.name;
  card.append(title);

  if (product.description) {
    const desc = document.createElement('p');
    desc.textContent = product.description;
    card.append(desc);
  }

  const price = document.createElement('span');
  price.className = 'card-price';
  price.textContent = formatPrice(product.price);
  card.append(price);

  return card;
}

function createQuickCard({ id, title, description, image, badge, action }) {
  const card = document.createElement('article');
  card.className = 'card quick-card';
  card.tabIndex = 0;
  if (id) {
    card.dataset.quickCard = id;
  }
  card.addEventListener('click', action);
  card.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  });

  if (badge) {
    const badgeEl = document.createElement('div');
    badgeEl.className = 'badge';
    badgeEl.textContent = badge;
    card.append(badgeEl);
  }

  const img = document.createElement('img');
  img.src = image;
  img.alt = title;
  card.append(img);

  const heading = document.createElement('h3');
  heading.textContent = title;
  card.append(heading);

  const text = document.createElement('p');
  text.textContent = description;
  card.append(text);

  return card;
}

function renderQuickActions() {
  const container = els.quickActionsPanel;
  if (!container) return;
  container.innerHTML = '';

  const section = document.createElement('div');
  section.className = 'category-section quick-actions';

  const top = document.createElement('div');
  top.className = 'category-top';
  const title = document.createElement('h3');
  title.className = 'category-title';
  title.textContent = 'Kiirtoimingud';
  top.append(title);
  section.append(top);

  const grid = document.createElement('div');
  grid.className = 'category-grid';

  grid.append(
    createQuickCard({
      id: 'notifications',
      title: 'Teated',
      description: 'Tellimuse olekud ja pakkumised',
      image: 'assets/img/notifications.svg',
      badge: '3',
      action: () => showView('teated'),
    }),
  );

  const cartCount = getCartCount();
  grid.append(
    createQuickCard({
      id: 'cart',
      title: 'Ostukorv',
      description: 'Vaata ja kinnita oma ostud',
      image: 'assets/img/cart.svg',
      badge: cartCount > 0 ? String(cartCount) : null,
      action: () => showView('ostukorv'),
    }),
  );

  section.append(grid);
  container.append(section);
  updateQuickActionCartBadge();
}

function renderCategories() {
  const container = els.categoryList;
  if (!container) return;
  container.innerHTML = '';

  const categories = getCategories();
  const categoryOrder = [
    'Tehnika ja elektroonika',
    'Toit ja joogid',
    'Riided ja aksessuaarid',
    'Kontor ja papertarbed',
    'Kodutarbed ja elustiil',
  ];

  categories.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const activeProducts = state.products.filter((product) => state.showAdult || !product.adult);

  categories.forEach((category) => {
    const section = document.createElement('div');
    section.className = 'category-section';

    const top = document.createElement('div');
    top.className = 'category-top';
    const title = document.createElement('h3');
    title.className = 'category-title';
    title.textContent = category;
    top.append(title);
    section.append(top);

    const grid = document.createElement('div');
    grid.className = 'category-grid';

    const products = activeProducts.filter((product) => product.category === category);
    if (products.length === 0) {
      const hint = document.createElement('p');
      hint.className = 'settings-hint';
      hint.textContent = 'Selles kategoorias pole veel tooteid.';
      section.append(hint);
    } else {
      products.slice(0, 3).forEach((product) => {
        grid.append(createProductCard(product));
      });
      section.append(grid);
    }

    container.append(section);
  });
  updateQuickActionCartBadge();
}

function renderFeatured() {
  const container = els.featuredList;
  if (!container) return;
  container.innerHTML = '';
  const activeProducts = state.products.filter((product) => (state.showAdult || !product.adult) && product.featured);
  if (activeProducts.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'row empty';
    const msg = document.createElement('div');
    msg.textContent = 'Valitud näidistooted ilmuvad siia.';
    empty.append(msg);
    container.append(empty);
    return;
  }
  activeProducts.slice(0, 8).forEach((product) => {
    const button = document.createElement('button');
    button.className = 'sample-item';
    button.type = 'button';
    button.dataset.productId = product.id;

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    button.append(img);

    const copy = document.createElement('div');
    copy.className = 'sample-copy';
    const title = document.createElement('h3');
    title.textContent = product.name;
    copy.append(title);
    if (product.description) {
      const desc = document.createElement('p');
      desc.textContent = product.description;
      copy.append(desc);
    }
    button.append(copy);

    const price = document.createElement('span');
    price.className = 'price';
    price.textContent = formatPrice(product.price);
    button.append(price);

    container.append(button);
  });
}

function renderCart() {
  const list = els.cartList;
  if (!list) return;
  list.innerHTML = '';
  const activeCart = state.cart.filter((item) => Boolean(getProductById(item.id)));
  state.cart = activeCart;

  if (activeCart.length === 0) {
    const emptyRow = document.createElement('div');
    emptyRow.className = 'row empty';
    const message = document.createElement('div');
    message.textContent = 'Ostukorv on hetkel tühi. Lisa tooteid avalehelt.';
    emptyRow.append(message);
    list.append(emptyRow);
    els.cartTotal.textContent = formatPrice(0);
    updateQuickActionCartBadge();
    return;
  }

  let total = 0;

  activeCart.forEach((item) => {
    const product = getProductById(item.id);
    if (!product) return;
    const row = document.createElement('div');
    row.className = 'row cart-row';
    row.dataset.productId = product.id;

    const info = document.createElement('div');
    info.className = 'cart-row__info';
    const name = document.createElement('strong');
    name.textContent = product.name;
    info.append(name);
    const meta = document.createElement('span');
    meta.className = 'cart-row__meta';
    meta.textContent = product.category;
    info.append(meta);
    row.append(info);

    const quantity = document.createElement('div');
    quantity.className = 'cart-row__quantity';
    quantity.innerHTML = `
      <button type="button" data-qty="minus" aria-label="Vähenda kogust">−</button>
      <input type="number" min="1" value="${item.quantity}" aria-label="Kogus">
      <button type="button" data-qty="plus" aria-label="Suurenda kogust">+</button>
    `;
    row.append(quantity);

    const price = document.createElement('span');
    price.className = 'price';
    const lineTotal = product.price * item.quantity;
    total += lineTotal;
    price.textContent = formatPrice(lineTotal);
    row.append(price);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'icon-btn';
    remove.dataset.removeProduct = product.id;
    remove.setAttribute('aria-label', 'Eemalda ostukorvist');
    remove.innerHTML = '&times;';
    row.append(remove);

    list.append(row);
  });

  els.cartTotal.textContent = formatPrice(total);
  updateQuickActionCartBadge();
}

function updateQuickActionCartBadge() {
  const quickCard = els.quickActionsPanel?.querySelector('[data-quick-card="cart"]');
  if (!quickCard) return;
  let badge = quickCard.querySelector('.badge');
  const count = getCartCount();
  if (count > 0) {
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'badge';
      quickCard.prepend(badge);
    }
    badge.textContent = String(count);
  } else if (badge) {
    badge.remove();
  }
}

function renderStats() {
  if (!els.statsProducts) return;
  const products = state.products;
  const categories = getCategories();
  els.statsProducts.textContent = String(products.length);
  els.statsCategories.textContent = String(categories.length);
  els.statsCartItems.textContent = String(getCartCount());
}

function renderAdminTable() {
  const table = els.adminProductTable;
  if (!table) return;
  table.innerHTML = '';
  const sorted = [...state.products].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  sorted.forEach((product) => {
    const row = document.createElement('div');
    row.className = 'admin-table__row';
    row.innerHTML = `
      <span>${product.name}</span>
      <span>${product.category}</span>
      <span>${formatPrice(product.price)}</span>
      <span class="admin-table__actions">
        <button class="icon-btn" type="button" aria-label="Eemalda" data-remove-product="${product.id}">×</button>
      </span>
    `;
    table.append(row);
  });
}

function renderEverything() {
  renderCategoryOptions();
  renderQuickActions();
  renderCategories();
  renderFeatured();
  renderCart();
  renderStats();
  renderAdminTable();
}

function showView(name) {
  Object.values(views).forEach((view) => view?.classList.remove('active'));
  const target = views[name] || views.home;
  target.classList.add('active');
  if (name === 'ostukorv') {
    renderCart();
  }
}

function openProductModal(productId) {
  const product = getProductById(productId);
  if (!product || !(state.showAdult || !product.adult)) return;
  activeProductId = product.id;
  if (els.productModalTitle) els.productModalTitle.textContent = product.name;
  if (els.productModalDescription) els.productModalDescription.textContent = product.description || '';
  if (els.productModalPrice) els.productModalPrice.textContent = formatPrice(product.price);
  if (els.productModalImage) {
    els.productModalImage.src = product.image;
    els.productModalImage.alt = product.name;
  }
  els.productModal?.classList.add('active');
  els.productModal?.setAttribute('aria-hidden', 'false');
  bodyEl.classList.add('modal-open');
  window.requestAnimationFrame(() => {
    els.productModalAdd?.focus();
  });
}

function closeProductModal() {
  els.productModal?.classList.remove('active');
  els.productModal?.setAttribute('aria-hidden', 'true');
  bodyEl.classList.remove('modal-open');
  activeProductId = null;
}

function addToCart(productId, quantity = 1) {
  const product = getProductById(productId);
  if (!product) return;
  const existing = state.cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({ id: productId, quantity });
  }
  persistCart();
  renderCart();
  renderStats();
  renderFeatured();
}

function updateCartQuantity(productId, quantity) {
  const item = state.cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;
  if (quantity <= 0 || Number.isNaN(quantity)) {
    removeFromCart(productId);
    return;
  }
  item.quantity = quantity;
  persistCart();
  renderCart();
  renderStats();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  persistCart();
  renderCart();
  renderStats();
}

function removeProduct(productId) {
  state.products = state.products.filter((product) => product.id !== productId);
  state.cart = state.cart.filter((item) => item.id !== productId);
  persistCart();
  renderEverything();
}

function handleCartListClick(event) {
  const button = event.target.closest('button');
  if (!button) return;
  const row = event.target.closest('.cart-row');
  if (!row) return;
  const { productId } = row.dataset;
  if (!productId) return;

  if (button.dataset.qty === 'minus') {
    const input = row.querySelector('input[type="number"]');
    const next = Math.max(1, Number(input.value) - 1);
    input.value = next;
    updateCartQuantity(productId, next);
  } else if (button.dataset.qty === 'plus') {
    const input = row.querySelector('input[type="number"]');
    const next = Number(input.value) + 1;
    input.value = next;
    updateCartQuantity(productId, next);
  } else if (button.dataset.removeProduct) {
    removeFromCart(productId);
  }
}

function handleCartListChange(event) {
  if (event.target.matches('.cart-row__quantity input[type="number"]')) {
    const row = event.target.closest('.cart-row');
    if (!row) return;
    const { productId } = row.dataset;
    const value = Number(event.target.value);
    updateCartQuantity(productId, value);
  }
}

function handleDocumentClick(event) {
  const productTarget = event.target.closest('[data-product-id]');
  if (productTarget) {
    openProductModal(productTarget.dataset.productId);
  }
}

function populatePreferenceControls() {
  if (els.settingsLocation) els.settingsLocation.value = state.location;
  if (els.settingsCurrency) els.settingsCurrency.value = state.currency;
  if (els.settingsAdult) els.settingsAdult.checked = state.showAdult;
  if (els.settings2fa) els.settings2fa.checked = state.twoFactor;
  if (els.settingsSessionAlerts) els.settingsSessionAlerts.checked = state.sessionAlerts;
  els.themeRadios?.forEach((radio) => {
    radio.checked = radio.value === state.theme;
  });
}

function bindUI() {
  document.querySelectorAll('[data-back]').forEach((button) => {
    button.addEventListener('click', () => showView('home'));
  });

  els.productModalAdd?.addEventListener('click', () => {
    if (!activeProductId) return;
    addToCart(activeProductId, 1);
    closeProductModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && els.productModal?.classList.contains('active')) {
      closeProductModal();
    }
  });

  document.querySelectorAll('[data-modal-dismiss]').forEach((el) => {
    el.addEventListener('click', closeProductModal);
  });

  els.productModal?.addEventListener('click', (event) => {
    if (event.target === els.productModal || event.target.hasAttribute('data-modal-dismiss')) {
      closeProductModal();
    }
  });

  els.cartList?.addEventListener('click', handleCartListClick);
  els.cartList?.addEventListener('change', handleCartListChange);
  document.addEventListener('click', handleDocumentClick);

  els.accountForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    state.twoFactor = !!els.settings2fa?.checked;
    state.sessionAlerts = !!els.settingsSessionAlerts?.checked;
    savePreferences();
    event.target.reset();
    populatePreferenceControls();
    window.alert('Kontoseaded on uuendatud (demo).');
  });

  els.preferencesForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (els.settingsLocation) state.location = els.settingsLocation.value;
    if (els.settingsCurrency) state.currency = els.settingsCurrency.value;
    if (els.settingsAdult) state.showAdult = els.settingsAdult.checked;
    const selectedTheme = Array.from(els.themeRadios || []).find((radio) => radio.checked);
    if (selectedTheme) state.theme = selectedTheme.value;
    savePreferences();
    applyTheme();
    renderEverything();
    window.alert('Eelistused on salvestatud (demo).');
  });

  els.themeRadios?.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      state.theme = event.target.value;
      savePreferences();
      applyTheme();
    });
  });

  els.viewCartShortcut?.addEventListener('click', () => showView('ostukorv'));
  els.openAdmin?.addEventListener('click', () => showView('admin'));
  els.settingsBtn?.addEventListener('click', () => showView('settings'));
  els.notificationsBtn?.addEventListener('click', () => showView('teated'));
  els.cartBtn?.addEventListener('click', () => showView('ostukorv'));
  els.sendLoginLink?.addEventListener('click', () => window.alert('Sisselogimislink on saadetud (demo).'));
  els.openHelp?.addEventListener('click', () => window.alert('Avaksime KKK lehe (demo).'));
  els.reportIssue?.addEventListener('click', () => window.alert('Täname tagasiside eest! (demo)'));

  els.adminProductForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(els.adminProductForm);
    const name = (formData.get('name') || '').toString().trim();
    const price = Number(formData.get('price'));
    const category = (formData.get('category') || '').toString().trim() || 'Määramata';
    const image = (formData.get('image') || '').toString().trim() || 'assets/img/new-products.svg';
    const description = (formData.get('description') || '').toString().trim();
    const featured = formData.get('featured') === 'on';

    if (!name || Number.isNaN(price) || price <= 0) {
      window.alert('Palun täida nimi ja positiivne hind.');
      return;
    }

    const id = `custom-${Date.now()}`;
    state.products.push({ id, name, price, category, image, description, featured });
    renderEverything();
    els.adminProductForm.reset();
    window.alert('Toode lisatud (demo).');
  });

  els.adminProductTable?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-product]');
    if (!button) return;
    const { removeProduct: productId } = button.dataset;
    if (productId && window.confirm('Kas eemaldada toode kataloogist?')) {
      removeProduct(productId);
    }
  });
}

function startFlow() {
  showView('welcome');
  clearTimeout(welcomeTimeout);
  welcomeTimeout = window.setTimeout(() => showView('home'), 1600);
}

function initialise() {
  applyTheme();
  populatePreferenceControls();
  renderEverything();
  bindUI();
  startFlow();
}

document.addEventListener('DOMContentLoaded', initialise);
