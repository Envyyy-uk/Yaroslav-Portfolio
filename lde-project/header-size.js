// Measure header height and expose it as CSS variable --header-height
(function () {
  const headerSelector = '.gh-header';
  const targetSelector = 'main'; // elements that need top padding

  function updateHeaderHeight() {
    try {
      const header = document.querySelector(headerSelector);
      if (!header) return;
      const h = header.offsetHeight || 60;
      document.documentElement.style.setProperty('--header-height', h + 'px');
      // Fallback: set padding-top directly on main and hub-container
      const mains = document.querySelectorAll(targetSelector + ', .hub-container');
      mains.forEach(m => {
        m.style.paddingTop = `calc(${h}px + 16px)`;
      });
    } catch (e) {
      // silent
    }
  }

  window.addEventListener('DOMContentLoaded', updateHeaderHeight);
  window.addEventListener('resize', () => { setTimeout(updateHeaderHeight, 50); });
  window.addEventListener('orientationchange', () => { setTimeout(updateHeaderHeight, 120); });

  const headerEl = document.querySelector(headerSelector);
  if (headerEl && window.MutationObserver) {
    const obs = new MutationObserver(() => updateHeaderHeight());
    obs.observe(headerEl, { childList: true, subtree: true, attributes: true });
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.menu-toggle') || e.target.closest('.menu-toggle *')) {
      setTimeout(updateHeaderHeight, 150);
    }
  });
})();