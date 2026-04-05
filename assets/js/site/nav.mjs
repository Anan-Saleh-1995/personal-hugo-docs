import { MEDIA_QUERIES, SELECTORS } from "./constants.mjs";
import { query, queryAll } from "./utils.mjs";

let drawerMode = null;
let overlay = null;
let mainArea = null;
let toggleButtons = [];

const updateToggleState = (open) => {
  toggleButtons.forEach((button) => {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
};

const setMainAreaInert = (open) => {
  if (mainArea) {
    mainArea.inert = open;
  }
};

const setNavOpen = (open) => {
  const nextState = Boolean(drawerMode?.matches && open);

  document.body.classList.toggle("nav-open", nextState);
  updateToggleState(nextState);

  if (overlay) {
    overlay.hidden = !nextState;
  }

  setMainAreaInert(nextState);
};

export const closeNav = () => {
  setNavOpen(false);
};

export const initNav = () => {
  const sidebar = query(SELECTORS.sidebar);
  const closeButton = query(SELECTORS.navClose);

  drawerMode = window.matchMedia(MEDIA_QUERIES.drawer);
  overlay = query(SELECTORS.navOverlay);
  mainArea = query(SELECTORS.mainArea);
  toggleButtons = queryAll(SELECTORS.navToggle);

  if (toggleButtons.length === 0 && !closeButton && !sidebar && !overlay) {
    return;
  }

  updateToggleState(false);

  if (overlay) {
    overlay.hidden = true;
  }

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setNavOpen(!document.body.classList.contains("nav-open"));
    });
  });

  closeButton?.addEventListener("click", closeNav);
  overlay?.addEventListener("click", closeNav);

  sidebar?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const link = target.closest("a[href]");
    if (link && drawerMode.matches) {
      closeNav();
    }
  });

  drawerMode.addEventListener("change", (event) => {
    if (!event.matches) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });
};
