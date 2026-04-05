import { MEDIA_QUERIES, SELECTORS, STORAGE_KEYS, THEME_COLORS } from "./constants.mjs";
import { capitalize, query, queryAll } from "./utils.mjs";

const prefersDarkTheme = window.matchMedia(MEDIA_QUERIES.prefersDark);
const getThemeConfig = () => {
  const themeMeta = query(SELECTORS.themeColorMeta);

  return {
    storageKey: themeMeta?.dataset.themeStorageKey || STORAGE_KEYS.theme,
    themeColors: {
      light: themeMeta?.dataset.themeColorLight || THEME_COLORS.light,
      dark: themeMeta?.dataset.themeColorDark || THEME_COLORS.dark,
    },
    themeMeta,
  };
};

const getStoredTheme = () => {
  const { storageKey } = getThemeConfig();

  try {
    const storedTheme = window.localStorage.getItem(storageKey);
    return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
  } catch {
    return null;
  }
};

const getSystemTheme = () => (prefersDarkTheme.matches ? "dark" : "light");

const updateThemeToggleLabels = (theme, buttons) => {
  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${capitalize(nextTheme)} mode`;

  buttons.forEach((button) => {
    button.setAttribute("aria-label", label);

    const srOnlyLabel = button.querySelector(".sr-only");
    if (srOnlyLabel) {
      srOnlyLabel.textContent = label;
    }
  });
};

export const applyTheme = (theme, { persist = false } = {}) => {
  const root = document.documentElement;
  const { storageKey, themeColors, themeMeta } = getThemeConfig();
  const toggleButtons = queryAll(SELECTORS.themeToggle);

  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  if (themeMeta) {
    themeMeta.setAttribute("content", themeColors[theme]);
  }

  updateThemeToggleLabels(theme, toggleButtons);

  if (!persist) {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {}
};

export const initTheme = () => {
  const root = document.documentElement;
  const toggleButtons = queryAll(SELECTORS.themeToggle);

  if (toggleButtons.length === 0) {
    return;
  }

  const initialTheme = root.dataset.theme === "dark" ? "dark" : "light";
  applyTheme(initialTheme);

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme, { persist: true });
    });
  });

  prefersDarkTheme.addEventListener("change", () => {
    if (!getStoredTheme()) {
      applyTheme(getSystemTheme());
    }
  });
};
