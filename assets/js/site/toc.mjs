import { SELECTORS } from "./constants.mjs";
import { query, queryAll } from "./utils.mjs";

const getHeadingLabel = (heading) =>
  heading.textContent?.replace(/\s*#\s*$/, "").trim() ?? "Contents";

export const initToc = () => {
  const headings = queryAll(SELECTORS.articleHeadings);
  const tocLinks = queryAll(SELECTORS.tocLink);
  const mobileToc = query(SELECTORS.mobileToc);
  const mobileTocPanel = query(SELECTORS.mobileTocPanel);
  const mobileCurrentHeading = query(SELECTORS.mobileCurrentHeading);
  const topbar = query(".docs-topbar");

  if (headings.length === 0 || tocLinks.length === 0) {
    return;
  }

  const setActiveLink = (id) => {
    tocLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);

      if (active) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    const activeHeading = headings.find((heading) => heading.id === id);
    if (mobileCurrentHeading) {
      mobileCurrentHeading.textContent = activeHeading
        ? getHeadingLabel(activeHeading)
        : "Contents";
    }
  };

  const updateActiveHeading = () => {
    const topbarHeight = topbar?.offsetHeight ?? 0;
    const mobileTocHeight =
      mobileToc instanceof HTMLDetailsElement && mobileToc.open
        ? (mobileToc.querySelector(".mobile-page-toc__summary")?.clientHeight ?? 0)
        : (mobileToc?.querySelector(".mobile-page-toc__summary")?.clientHeight ?? 0);
    const activationOffset = topbarHeight + mobileTocHeight + 24;
    const isAtPageEnd =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    if (isAtPageEnd) {
      const lastHeading = headings.at(-1);
      if (lastHeading?.id) {
        setActiveLink(lastHeading.id);
      }
      return;
    }

    let activeHeading = headings[0];

    headings.forEach((heading) => {
      if (heading.getBoundingClientRect().top <= activationOffset) {
        activeHeading = heading;
      }
    });

    if (activeHeading?.id) {
      setActiveLink(activeHeading.id);
    }
  };

  let ticking = false;
  const requestUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      updateActiveHeading();
    });
  };

  updateActiveHeading();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);

  mobileTocPanel?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const tocLink = target.closest('a[href^="#"]');
    if (tocLink && mobileToc instanceof HTMLDetailsElement) {
      mobileToc.open = false;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileToc instanceof HTMLDetailsElement) {
      mobileToc.open = false;
    }
  });
};
