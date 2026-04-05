const getSidebarRestoreNav = () => {
  const nav = document.currentScript?.previousElementSibling;
  return nav instanceof HTMLElement ? nav : null;
};

const getSidebarSavedState = (nav) => {
  const storageKey = nav.dataset.navScrollKey;
  if (!storageKey) {
    return null;
  }

  const saved = window.sessionStorage.getItem(storageKey);
  return saved || null;
};

const applySidebarSavedScroll = (nav, saved) => {
  const nextScrollTop = Number.parseFloat(saved);
  if (Number.isNaN(nextScrollTop)) {
    return;
  }

  nav.scrollTop = nextScrollTop;
};

const scheduleSidebarRestore = (nav, saved) => {
  applySidebarSavedScroll(nav, saved);

  window.requestAnimationFrame(() => {
    applySidebarSavedScroll(nav, saved);

    window.requestAnimationFrame(() => {
      applySidebarSavedScroll(nav, saved);
    });
  });

  window.setTimeout(() => {
    applySidebarSavedScroll(nav, saved);
  }, 80);
};

const initSidebarScrollRestore = () => {
  const nav = getSidebarRestoreNav();
  if (!nav) {
    return;
  }

  const state = getSidebarSavedState(nav);
  if (!state) {
    return;
  }

  scheduleSidebarRestore(nav, state);
};

initSidebarScrollRestore();
