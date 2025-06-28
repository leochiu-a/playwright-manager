import UserStoryPanel from "@/components/UserStoryPanel";
import { notFound } from "next/navigation";

// Mock data
const userStories = [
  {
    id: "US-001",
    title: "使用者可以登入",
    description: "作為一個使用者，我希望能夠登入系統，以便存取個人資料。",
    testCases: [
      {
        file: "login.spec.ts",
        name: "should login successfully",
        steps: ["打開登入頁", "輸入帳號密碼", "點擊登入按鈕", "驗證導向首頁"],
      },
    ],
  },
  {
    id: "US-002",
    title: "使用者可以登出",
    description: "作為一個使用者，我希望能夠安全登出系統。",
    testCases: [],
  },
];

export default function StoryPage({ params }: { params: { storyId: string } }) {
  // 可選：檢查 storyId 是否存在，不存在可 notFound()
  // const exists = userStories.some(s => s.id === params.storyId);
  // if (!exists) return notFound();
  return <UserStoryPanel userStories={userStories} />;
}
