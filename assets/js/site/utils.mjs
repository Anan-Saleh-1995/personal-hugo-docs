export const query = (selector, root = document) => root.querySelector(selector);

export const queryAll = (selector, root = document) => Array.from(root.querySelectorAll(selector));

export const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const isEditableTarget = (target) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName));

export const capitalize = (value) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
