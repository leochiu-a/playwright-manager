# Playwright MCP 專案協作規則

## 1. 檔案與目錄結構
- 所有 E2E 測試請放在 `tests/` 目錄，檔名以 `.spec.ts` 結尾。
- Playwright 設定檔必須為 `playwright.config.ts`，放在專案根目錄。
- 測試產生物（如 `playwright-report/`、`test-results/`）不得加入 git，必須列入 `.gitignore`。

## 2. 測試撰寫規範
- 測試必須使用 `@playwright/test` 提供的 `test`、`expect` API。
- 每個測試需有明確描述（test description），建議使用繁體中文。
- 測試步驟需有適當註解，方便維護與 debug。
- 禁止在測試中寫死等待（如 `await page.waitForTimeout(3000)`），應使用條件等待。

## 3. CI/CD 與本地執行
- 所有 PR 必須通過 Playwright 測試才可合併。
- 建議本地執行 `pnpm exec playwright test` 驗證測試通過。
- 測試報告（`playwright-report/`）僅供本地 debug，不得上傳 git。

## 4. 版本與依賴
- Playwright 版本需與 `@playwright/test` 保持一致，並記錄於 `devDependencies`。
- 若需升級 Playwright，請同步更新相關型別與設定檔。

## 5. 其他
- 禁止將敏感資訊（如帳號密碼、token）寫入測試腳本或設定檔。
- 測試用帳號請集中管理，並於測試結束後自動登出或清理狀態。
- 若需錄製測試腳本，請使用 VSCode Playwright 插件或官方 CLI 工具。

---

> 本規則適用於所有 Playwright MCP 專案成員與 AI 助手，請務必遵守。 