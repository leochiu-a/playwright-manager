import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

test("KKday 首頁登入按鈕可點擊並顯示登入視窗", async ({ page }) => {
  const email = process.env.KKDAY_EMAIL!;
  const password = process.env.KKDAY_PASSWORD!;

  await page.goto("https://www.kkday.com/zh-tw");
  // 等待登入按鈕出現並點擊
  await page.getByText("登入/註冊").click();

  // 驗證登入視窗或表單有出現（根據實際 DOM 結構調整 selector）
  // 這裡以常見的登入表單標題或輸入框為例
  await expect(page.getByText("登入註冊 KKday")).toBeVisible();

  // 點擊「使用 電子郵件 繼續」按鈕
  await page
    .locator("button")
    .filter({ hasText: "使用 電子郵件 繼續" })
    .click();

  // 在「電子郵件 *」label 下第 5 個 div 輸入 email
  await page
    .locator("label")
    .filter({ hasText: "電子郵件 *" })
    .locator("div")
    .nth(4)
    .fill(email);

  // 在「密碼 *」label 下第 5 個 div 輸入密碼
  await page
    .locator("label")
    .filter({ hasText: "密碼 *" })
    .locator("div")
    .nth(4)
    .fill(password);

  // 點擊登入按鈕
  await page.locator("#loginBTN").click();

  // 驗證登入後 header 有顯示頭像
  await expect(page.locator("#header-user-photo")).toBeVisible();
});
