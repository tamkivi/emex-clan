const bodyEl = document.body;
const views = {};
const els = {};
const firebaseProductsService = typeof window !== 'undefined' ? window.firebaseProducts || null : null;
let firebaseProductsReady = false;
let unsubscribeProductListener = null;

const currencyInfo = {
  EUR: { symbol: '€', rate: 1, locale: 'et-EE', currency: 'EUR' },
  USD: { symbol: '$', rate: 1.08, locale: 'en-US', currency: 'USD' },
  GBP: { symbol: '£', rate: 0.86, locale: 'en-GB', currency: 'GBP' },
  SEK: { symbol: 'kr', rate: 11.2, locale: 'sv-SE', currency: 'SEK' },
};

const initialProducts = [
  {
    id: 'wellness-sleepaid',
    name: 'Unerohi',
    price: 9.9,
    category: 'Tervis ja heaolu',
    description: 'Rahustav kapsel toetab sügavat und ja värsket ärkamist.',
    image: 'https://static1.biotus.ua/media/optimization/catalog/product/700/2/9/29christopher_s_original_formulas_slumber_425_mg_100_vegetarian_caps_jpg.webp',
    featured: true,
  },
  {
    id: 'food-energy-drink',
    name: 'Energiajook',
    price: 2.9,
    category: 'Toit ja joogid',
    description: 'Koolipäeva päästev gaseeritud ergutaja kiireks energiaks.',
    image: 'data:image/jpeg;base64,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',
    featured: true,
  },
  {
    id: 'apparel-taltech-shirt',
    name: 'TalTechi särk',
    price: 24,
    category: 'Riided ja aksessuaarid',
    description: 'Ülikooli logoga pehme t-särk loengutesse ja üritustele.',
    image: 'https://www.estlatbl.com/cache/basket/public/news2_img/_1920x1080x0/8274_206953179_4223985264357438_3923357098722290915_n.jpg',
    featured: true,
  },
  {
    id: 'stationery-taltech-pen',
    name: 'TalTechi pastakas',
    price: 1.5,
    category: 'Kontor ja papertarbed',
    description: 'Sinise tindiga pastakas kiirete märkmete ja eksamivastuste jaoks.',
    image: 'https://scontent.ftll3-2.fna.fbcdn.net/v/t1.6435-9/44269415_1257183251090592_2220535445362573312_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=QCsxbQZsUHIQ7kNvwG40qt8&_nc_oc=AdlNf-bUyYnUgCzs5v6yK6oVP7D0c-h8p2fDAt0v-xb8Ywm5P88BgJTSLsInr47_SoLfEiWW2Q7qiAH4X7KctVF9&_nc_zt=23&_nc_ht=scontent.ftll3-2.fna&_nc_gid=H2oSChpY4KY9w63yMpB3mg&oh=00_AfiLpcVXhyiqLM5I6wfL3VXjWL1qXbF76xogO2h-Q9oqPA&oe=6931A887',
  },
  {
    id: 'wellness-adderall',
    name: 'Adderall',
    price: 49,
    category: 'Tervis ja heaolu',
    description: 'Retseptiravim keskendumiseks – ainult arsti nõusolekul.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Racemic_amphetamine_2.svg/1920px-Racemic_amphetamine_2.svg.png',
    adult: true,
    featured: true,
  },
  {
    id: 'wellness-condom',
    name: 'Kondoom',
    price: 6.9,
    category: 'Tervis ja heaolu',
    description: 'Diskreetne kaitse turvaliseks ja vastutustundlikuks läheduseks.',
    image: 'https://ee2.pigugroup.eu/colours/162/044/2/1620442/d1b9b8a4a85ce15e82460bf5d784e180_reference.jpg',
    adult: true,
  },
  {
    id: 'stationery-notebook',
    name: 'Vihik',
    price: 3.2,
    category: 'Kontor ja papertarbed',
    description: 'Ruuduline vihik projektide, konspektide ja ideede talletamiseks.',
    image: 'https://www.epp.ee/media/catalog/product/cache/1a58e364674ed54bf43f36cad4397fa0/a/2/a2960pp-02.jpg',
  },
  {
    id: 'services-limousine',
    name: 'Limusiin kooli minekuks',
    price: 299,
    category: 'Teenused',
    description: 'Luksuslik limusiiniteenus pidulikuks koolimineku hommikuks.',
    image: 'https://afterdark.ee/public/home/assets/images/pages/7a303705420851972d83573805cc2a0c.jpg?lang=ee',
    featured: true,
  },
  {
    id: 'bags-backpack',
    name: 'Seljakott',
    price: 39,
    category: 'Kotid ja aksessuaarid',
    description: 'Vastupidav seljakott sülearvuti, raamatute ja treeningkoti jaoks.',
    image: 'https://img.joomcdn.net/2503fa97ff82197ab6225164ac7221391ff2c503_original.jpeg',
  },
  {
    id: 'wellness-deodorant',
    name: 'Deodorant',
    price: 5.5,
    category: 'Iluteenused ja hügieen',
    description: 'Värskendav deodorant hoiab enesekindluse kogu päevaks.',
    image: 'https://www.suave.com/cdn/shop/files/383711002496_SV_APDEO_Shower-Fresh_STDEO_2.6oz_ATF_MOFOP_03_1000x.jpg?v=1738927868',
  },
];

function cacheDom() {
  views.welcome = document.getElementById('view-welcome');
  views.home = document.getElementById('view-home');
  views.teated = document.getElementById('view-teated');
  views.ostukorv = document.getElementById('view-ostukorv');
  views.settings = document.getElementById('view-settings');
  views.admin = document.getElementById('view-admin');

  els.categoryList = document.getElementById('categoryList');
  els.featuredList = document.getElementById('featuredList');
  els.cartList = document.getElementById('cartList');
  els.cartTotal = document.getElementById('cartTotal');
  els.productModal = document.getElementById('productModal');
  els.productModalTitle = document.getElementById('productModalTitle');
  els.productModalPrice = document.getElementById('productModalPrice');
  els.productModalDescription = document.getElementById('productModalDescription');
  els.productModalImage = document.getElementById('productModalImage');
  els.productModalAdd = document.getElementById('productModalAdd');
  els.adminProductForm = document.getElementById('adminProductForm');
  els.adminProductTable = document.getElementById('adminProductTable');
  els.statsProducts = document.getElementById('statsProducts');
  els.statsCategories = document.getElementById('statsCategories');
  els.statsCartItems = document.getElementById('statsCartItems');
  els.accountForm = document.getElementById('accountForm');
  els.preferencesForm = document.getElementById('preferencesForm');
  els.settingsLocation = document.getElementById('settingsLocation');
  els.settingsCurrency = document.getElementById('settingsCurrency');
  els.settingsAdult = document.getElementById('settingsAdult');
  els.settings2fa = document.getElementById('settings2fa');
  els.settingsSessionAlerts = document.getElementById('settingsSessionAlerts');
  els.themeRadios = document.querySelectorAll('input[name="theme"]');
  els.viewCartShortcut = document.getElementById('viewCartShortcut');
  els.openAdmin = document.getElementById('openAdmin');
  els.sendLoginLink = document.getElementById('sendLoginLink');
  els.openHelp = document.getElementById('openHelp');
  els.reportIssue = document.getElementById('reportIssue');
  els.categoryOptions = document.getElementById('categoryOptions');
  els.settingsBtn = document.getElementById('settingsBtn');
  els.notificationsBtn = document.getElementById('notificationsBtn');
  els.cartBtn = document.getElementById('cartBtn');
  els.quickActionsPanel = document.getElementById('quickActionsPanel');
}

function normaliseProduct(product = {}) {
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

function normaliseProducts(list = []) {
  return list.map((product) => normaliseProduct(product));
}

function useLocalProducts() {
  if (typeof unsubscribeProductListener === 'function') {
    unsubscribeProductListener();
    unsubscribeProductListener = null;
  }
  firebaseProductsReady = false;
  state.products = normaliseProducts(initialProducts);
  renderEverything();
}

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
  products: [],
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
      image: 'https://icons.veryicon.com/png/o/business/oa-office/mail-227.png',
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
      image: 'https://static.ajproducts.com/cdn-cgi/image/width=1180,format=auto/globalassets/447966.jpg?ref=8ABF686B16',
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
    'Tervis ja heaolu',
    'Iluteenused ja hügieen',
    'Kotid ja aksessuaarid',
    'Toit ja joogid',
    'Riided ja aksessuaarid',
    'Kontor ja papertarbed',
    'Teenused',
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

async function setupProductSync() {
  if (!firebaseProductsService) {
    useLocalProducts();
    return;
  }
  try {
    await firebaseProductsService.init();
    await firebaseProductsService.seedDemoProducts(initialProducts).catch((seedError) => {
      console.warn('Demo products were not seeded', seedError);
    });
    if (typeof unsubscribeProductListener === 'function') {
      unsubscribeProductListener();
      unsubscribeProductListener = null;
    }
    unsubscribeProductListener = await firebaseProductsService.subscribeToProducts((products) => {
      state.products = normaliseProducts(products);
      renderEverything();
    });
    firebaseProductsReady = true;
  } catch (error) {
    console.error('Firebase product sync unavailable, falling back to local data', error);
    useLocalProducts();
  }
}

function showView(name) {
  Object.values(views).forEach((view) => view?.classList.remove('active'));
  const target = views[name] ?? views.home;
  if (!target) return;
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

function removeProductLocal(productId) {
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

  els.adminProductForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(els.adminProductForm);
    const name = (formData.get('name') || '').toString().trim();
    const priceValue = Number(formData.get('price'));
    const category = (formData.get('category') || '').toString().trim() || 'Määramata';
    const image = (formData.get('image') || '').toString().trim() || 'https://source.unsplash.com/600x600/?new%20product';
    const description = (formData.get('description') || '').toString().trim();
    const featured = formData.get('featured') === 'on';

    if (!name || Number.isNaN(priceValue) || priceValue <= 0) {
      window.alert('Palun täida nimi ja positiivne hind.');
      return;
    }

    const productPayload = normaliseProduct({
      id: `custom-${Date.now()}`,
      name,
      price: priceValue,
      category,
      image,
      description,
      featured,
    });

    try {
      if (firebaseProductsReady && firebaseProductsService) {
        await firebaseProductsService.addProduct(productPayload);
      } else {
        state.products.push(productPayload);
        renderEverything();
      }
      els.adminProductForm.reset();
      window.alert('Toode lisatud.');
    } catch (error) {
      console.error('Failed to save product', error);
      window.alert('Toote salvestamine ebaõnnestus. Palun proovi uuesti.');
    }
  });

  els.adminProductTable?.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-remove-product]');
    if (!button) return;
    const { removeProduct: productId } = button.dataset;
    if (!productId) return;
    if (!window.confirm('Kas eemaldada toode kataloogist?')) return;
    try {
      if (firebaseProductsReady && firebaseProductsService) {
        await firebaseProductsService.removeProduct(productId);
      } else {
        removeProductLocal(productId);
      }
    } catch (error) {
      console.error('Failed to remove product', error);
      window.alert('Toote eemaldamine ebaõnnestus. Palun proovi uuesti.');
    }
  });
}

function startFlow() {
  showView('welcome');
  clearTimeout(welcomeTimeout);
  welcomeTimeout = window.setTimeout(() => showView('home'), 1600);
}

async function initialise() {
  cacheDom();
  applyTheme();
  populatePreferenceControls();
  renderEverything();
  bindUI();
  startFlow();
  await setupProductSync();
}

async function boot() {
  if (document.readyState === 'loading') {
    await new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
  }

  if (window.loadPartialsPromise) {
    await window.loadPartialsPromise;
  } else {
    console.warn('loadPartialsPromise missing; partial templates may not be loaded.');
  }

  await initialise();
}

boot().catch((error) => {
  console.error('Failed to initialise application', error);
});
