import { initCopyCode } from "./site/copy-code.mjs";
import { initNav } from "./site/nav.mjs";
import { initSearch } from "./site/search.mjs";
import { initTheme } from "./site/theme.mjs";
import { initToc } from "./site/toc.mjs";
import { initTree } from "./site/tree.mjs";

const initSite = () => {
  initTheme();
  initNav();
  initTree();
  initSearch();
  initCopyCode();
  initToc();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite, { once: true });
} else {
  initSite();
}
