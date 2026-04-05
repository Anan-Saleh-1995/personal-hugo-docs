import { COPY_MESSAGES, SELECTORS } from "./constants.mjs";

const setCopyButtonText = (button, text) => {
  button.textContent = text;
};

export const initCopyCode = () => {
  document.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const copyButton = target.closest(SELECTORS.copyCode);
    if (!(copyButton instanceof HTMLButtonElement)) {
      return;
    }

    const block = copyButton.closest("[data-code-block]");
    const codeTarget = block?.querySelector("pre code, pre");
    if (!codeTarget) {
      return;
    }

    const defaultLabel = copyButton.dataset.copyLabel || COPY_MESSAGES.default;

    try {
      await navigator.clipboard.writeText(codeTarget.textContent ?? "");
      setCopyButtonText(copyButton, COPY_MESSAGES.success);

      window.setTimeout(() => {
        setCopyButtonText(copyButton, defaultLabel);
      }, 1200);
    } catch {
      setCopyButtonText(copyButton, COPY_MESSAGES.failure);

      window.setTimeout(() => {
        setCopyButtonText(copyButton, defaultLabel);
      }, 1200);
    }
  });
};
