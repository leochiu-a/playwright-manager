import { test, expect } from "@playwright/test";

test("首頁應顯示 User Story 查詢標題", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /user story/i })
  ).toBeVisible();
});
