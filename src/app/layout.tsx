import { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import "antd/dist/reset.css";
import "./globals.css";

export const metadata = {
  title: "User Story 與測試對應查詢",
  description: "查詢 user story 與 Playwright 測試案例的對應關係",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
