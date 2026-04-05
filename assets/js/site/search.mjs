import { SEARCH_MESSAGES, SEARCH_RESULT_LIMIT, SELECTORS } from "./constants.mjs";
import { closeNav } from "./nav.mjs";
import { escapeHtml, isEditableTarget, query, queryAll } from "./utils.mjs";

let pagefindModulePromise = null;
let searchDebounceId = 0;
let searchRequestId = 0;
let searchReturnFocus = null;

const renderSearchMessage = (resultsContainer, message, className = "search-dialog__status") => {
  if (!resultsContainer) {
    return;
  }

  resultsContainer.innerHTML = `<p class="${className}">${escapeHtml(message)}</p>`;
};

const resetSearchResults = (resultsContainer, emptyState) => {
  if (!resultsContainer || !emptyState) {
    return;
  }

  resultsContainer.innerHTML = "";
  resultsContainer.append(emptyState);
};

const loadPagefind = async () => {
  if (!pagefindModulePromise) {
    pagefindModulePromise = import("/pagefind/pagefind.js")
      .then(async (module) => {
        if (typeof module.options === "function") {
          await module.options({ excerptLength: 18 });
        }

        return module;
      })
      .catch(() => null);
  }

  return pagefindModulePromise;
};

const renderSearchResults = (resultsContainer, hits) => {
  if (!resultsContainer) {
    return;
  }

  resultsContainer.innerHTML = hits
    .map(
      (result) => `
        <a class="search-result" href="${escapeHtml(result.url)}">
          <span class="search-result__title">${escapeHtml(result.title)}</span>
          <span class="search-result__meta">${escapeHtml(result.url)}</span>
          <span class="search-result__excerpt">${result.excerpt}</span>
        </a>
      `,
    )
    .join("");
};

const performSearch = async (term, resultsContainer, emptyState) => {
  const queryText = term.trim();

  if (!queryText) {
    resetSearchResults(resultsContainer, emptyState);
    return;
  }

  renderSearchMessage(resultsContainer, SEARCH_MESSAGES.loading);

  const requestId = ++searchRequestId;
  const pagefind = await loadPagefind();
  if (!pagefind) {
    renderSearchMessage(resultsContainer, SEARCH_MESSAGES.unavailable);
    return;
  }

  const search = await pagefind.search(queryText);
  const hits = await Promise.all(
    search.results.slice(0, SEARCH_RESULT_LIMIT).map(async (result) => {
      const data = await result.data();

      return {
        title: data.meta?.title ?? result.meta?.title ?? data.url,
        url: data.url,
        excerpt: data.excerpt ?? "",
      };
    }),
  );

  if (requestId !== searchRequestId) {
    return;
  }

  if (hits.length === 0) {
    renderSearchMessage(resultsContainer, SEARCH_MESSAGES.noResults(queryText));
    return;
  }

  renderSearchResults(resultsContainer, hits);
};

export const initSearch = () => {
  const dialog = query(SELECTORS.searchDialog);
  const searchInput = query(SELECTORS.searchInput);
  const searchResults = query(SELECTORS.searchResults);
  const searchEmpty = query(SELECTORS.searchEmpty);
  const openButtons = queryAll(SELECTORS.searchOpen);
  const closeButtons = queryAll(SELECTORS.searchClose);

  if (!(dialog instanceof HTMLDialogElement) || !searchInput || !searchResults) {
    return;
  }

  const openSearch = (invoker = null) => {
    closeNav();
    searchReturnFocus = invoker;

    if (!dialog.open) {
      dialog.showModal();
    }

    document.body.classList.add("search-open");
    window.setTimeout(() => searchInput.focus(), 0);
  };

  const closeSearch = () => {
    if (dialog.open) {
      dialog.close();
    }
  };

  resetSearchResults(searchResults, searchEmpty);

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openSearch(button);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeSearch);
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("search-open");

    if (searchReturnFocus instanceof HTMLElement) {
      searchReturnFocus.focus();
    }

    searchReturnFocus = null;
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeSearch();
    }
  });

  searchInput.addEventListener("input", () => {
    window.clearTimeout(searchDebounceId);
    searchDebounceId = window.setTimeout(() => {
      performSearch(searchInput.value, searchResults, searchEmpty);
    }, 120);
  });

  searchResults.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const resultLink = target.closest("a[href]");
    if (resultLink) {
      closeSearch();
    }
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch(document.activeElement instanceof HTMLElement ? document.activeElement : null);
      return;
    }

    if (!dialog.open && !isEditableTarget(event.target) && event.key === "/") {
      event.preventDefault();
      openSearch(document.activeElement instanceof HTMLElement ? document.activeElement : null);
    }
  });
};
