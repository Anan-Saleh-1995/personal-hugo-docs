import { expect, test } from "@playwright/test";

test("docs index keeps the no-TOC breathing class and spacing", async ({ page }) => {
  await page.goto("/docs/");

  const docsBody = page.locator(".docs-body.docs-body--no-toc");
  await expect(docsBody).toBeVisible();

  const paddingTop = await docsBody.evaluate((node) =>
    Number.parseFloat(getComputedStyle(node).paddingTop),
  );
  expect(paddingTop).toBeGreaterThanOrEqual(24);
});

test("sidebar disclosure toggles on the first click", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/docs/hugo/how-this-project-started/");

  const toggle = page.locator(".docs-tree__toggle").first();
  const branchId = await toggle.getAttribute("aria-controls");
  const branch = page.locator(`#${branchId}`);

  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(branch).toBeHidden();

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(branch).toBeVisible();
});

test("search dialog opens with Ctrl+K and closes with Escape", async ({ page }) => {
  await page.goto("/docs/hugo/how-this-project-started/");

  const searchDialog = page.locator("[data-search-dialog]");
  await page.keyboard.press("Control+K");
  await expect(searchDialog).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(searchDialog).not.toBeVisible();
});

test("compact topbar groups nav, search, and utilities in order", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto("/docs/hugo/how-this-project-started/");

  const navToggle = page.locator("[data-nav-toggle]");
  const searchTrigger = page.locator("[data-search-open]");
  const utilityGroup = page.locator(".docs-topbar__utility-group");

  const navBox = await navToggle.boundingBox();
  const searchBox = await searchTrigger.boundingBox();
  const utilityBox = await utilityGroup.boundingBox();

  expect(navBox).not.toBeNull();
  expect(searchBox).not.toBeNull();
  expect(utilityBox).not.toBeNull();

  expect(navBox.x).toBeLessThan(searchBox.x);
  expect(searchBox.x + searchBox.width).toBeLessThan(utilityBox.x + 1);
});

test("theme selection persists across reloads", async ({ page }) => {
  await page.goto("/docs/hugo/how-this-project-started/");

  const root = page.locator("html");
  const themeToggle = page.locator("[data-theme-toggle]").first();
  const before = await root.getAttribute("data-theme");

  await themeToggle.click();

  const after = await root.getAttribute("data-theme");
  expect(after).not.toBe(before);

  await page.reload();
  await expect(root).toHaveAttribute("data-theme", after);
});
