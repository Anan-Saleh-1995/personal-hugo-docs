export const MEDIA_QUERIES = {
  drawer: "(max-width: 52.499rem), (max-height: 30rem) and (max-width: 74.999rem)",
  prefersDark: "(prefers-color-scheme: dark)",
};

export const SELECTORS = {
  articleHeadings: "[data-docs-article] :is(h2[id], h3[id])",
  copyCode: "[data-copy-code]",
  mainArea: ".docs-main-area",
  mobileCurrentHeading: "[data-mobile-current-heading]",
  mobileToc: "[data-mobile-toc]",
  mobileTocPanel: "[data-mobile-toc-panel]",
  navClose: "[data-nav-close]",
  navOverlay: "[data-nav-overlay]",
  navScrollArea: "[data-nav-scroll-area]",
  navToggle: "[data-nav-toggle]",
  searchClose: "[data-search-close]",
  searchDialog: "[data-search-dialog]",
  searchEmpty: "[data-search-empty]",
  searchInput: "[data-search-input]",
  searchOpen: "[data-search-open]",
  searchResults: "[data-search-results]",
  sidebar: "#docs-sidebar",
  themeColorMeta: "#theme-color-meta",
  themeToggle: "[data-theme-toggle]",
  tocLink: '[data-toc] a[href^="#"]',
  treeToggle: "[data-tree-toggle]",
};

export const STORAGE_KEYS = {
  sidebarScroll: "personal-hugo-docs-sidebar-scroll",
  theme: "personal-hugo-docs-theme",
};

export const THEME_COLORS = {
  dark: "#1c2128",
  light: "#ffffff",
};

export const COPY_MESSAGES = {
  default: "Copy",
  failure: "Failed",
  success: "Copied",
};

export const SEARCH_MESSAGES = {
  idle: "Start typing to search the docs.",
  loading: "Searching...",
  unavailable: "Search index is unavailable until the site is built.",
  noResults: (query) => `No results for "${query}".`,
};

export const SEARCH_RESULT_LIMIT = 8;
