const PARTIALS = [
  'partials/welcome.html',
  'partials/home.html',
  'partials/teated.html',
  'partials/ostukorv.html',
  'partials/settings.html',
  'partials/admin.html',
  'partials/product-modal.html',
  'partials/footer.html',
];

async function loadPartials() {
  const target = document.getElementById('app-root');
  if (!target) {
    console.warn('App root not found; skipping partial load.');
    return;
  }

  for (const src of PARTIALS) {
    try {
      const response = await fetch(src);
      if (!response.ok) {
        console.error(`Failed to load partial: ${src}`);
        continue;
      }
      const html = await response.text();
      const template = document.createElement('template');
      template.innerHTML = html.trim();
      target.appendChild(template.content);
    } catch (error) {
      console.error(`Error loading partial: ${src}`, error);
    }
  }
}

window.loadPartialsPromise = (async () => {
  if (document.readyState === 'loading') {
    await new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
  }
  await loadPartials();
})().catch((error) => {
  console.error('Unhandled partial load error', error);
});
