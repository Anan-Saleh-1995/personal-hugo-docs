import { SELECTORS } from "./constants.mjs";
import { query } from "./utils.mjs";

const setTreeOpen = (toggleButton, open) => {
  const branchId = toggleButton.getAttribute("aria-controls");
  const branch = branchId ? document.getElementById(branchId) : null;
  const item = toggleButton.closest(".docs-tree__item");

  toggleButton.setAttribute("aria-expanded", String(open));
  branch?.toggleAttribute("hidden", !open);
  item?.classList.toggle("is-expanded", open);
};

export const initTree = () => {
  const sidebar = query(SELECTORS.sidebar);
  if (!sidebar) {
    return;
  }

  sidebar.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const toggleButton = target.closest(SELECTORS.treeToggle);
    if (!(toggleButton instanceof HTMLButtonElement)) {
      return;
    }

    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    setTreeOpen(toggleButton, !isExpanded);
  });
};
