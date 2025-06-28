"use client";

import React, { useState } from "react";
import { Layout, Input, Typography, Card, Tree, Empty } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  FileOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";
import { useRouter, usePathname } from "next/navigation";

const { Sider, Content, Header } = Layout;
const { Title, Paragraph } = Typography;

export interface TestCase {
  file: string;
  name: string;
  steps?: string[];
}
export interface UserStory {
  id: string;
  title: string;
  description: string;
  testCases: TestCase[];
}

function buildTreeData(userStories: UserStory[]): DataNode[] {
  return userStories.map((story) => ({
    key: story.id,
    title: (
      <span>
        <UserOutlined style={{ marginRight: 6 }} />
        {story.id} {story.title}
      </span>
    ),
    children:
      story.testCases.length > 0
        ? story.testCases.map((tc, idx) => ({
            key: `${story.id}-tc-${idx}`,
            title: (
              <span>
                <FileOutlined style={{ marginRight: 6 }} />
                {tc.file} <b>#</b> {tc.name}
              </span>
            ),
            isLeaf: true,
            data: { ...tc, userStoryId: story.id },
          }))
        : [],
    data: story,
  }));
}

export default function UserStoryPanel({
  userStories,
}: {
  userStories: UserStory[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const storyIdFromPath = pathname.startsWith("/stories/") ? pathname.split("/stories/")[1].split("/")[0] : null;

  const [search, setSearch] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(storyIdFromPath || null);

  // 當網址 storyId 變化時，自動同步 selectedKey
  React.useEffect(() => {
    if (storyIdFromPath && storyIdFromPath !== selectedKey) {
      setSelectedKey(storyIdFromPath);
    }
  }, [storyIdFromPath]);

  const filteredStories = userStories.filter(
    (story) =>
      story.id.includes(search) ||
      story.title.includes(search) ||
      story.description.includes(search) ||
      story.testCases.some(
        (tc) =>
          tc.file.includes(search) ||
          tc.name.includes(search) ||
          (tc.steps && tc.steps.some((step) => step.includes(search)))
      )
  );

  const treeData = buildTreeData(filteredStories);

  // 找到被選中的 user story、test case 或 step
  let selectedStory: UserStory | undefined = undefined;
  let selectedTestCase: (TestCase & { userStoryId: string }) | undefined =
    undefined;
  let selectedStep:
    | { step: string; testCaseIdx: number; userStoryId: string }
    | undefined = undefined;
  if (selectedKey) {
    if (selectedKey.startsWith("US-") && !selectedKey.includes("-tc-")) {
      selectedStory = userStories.find((s) => s.id === selectedKey);
    } else if (selectedKey.includes("-step-")) {
      // step node
      const [storyId, , tcIdx, , stepIdx] = selectedKey.split("-");
      const story = userStories.find((s) => s.id === `${storyId}-${tcIdx}`);
      if (story) {
        const tcIndex = Number(tcIdx);
        const stepIndex = Number(stepIdx);
        const testCase = story.testCases[tcIndex];
        if (testCase && testCase.steps && testCase.steps[stepIndex]) {
          selectedStory = story;
          selectedTestCase = { ...testCase, userStoryId: story.id };
          selectedStep = {
            step: testCase.steps[stepIndex],
            testCaseIdx: tcIndex,
            userStoryId: story.id,
          };
        }
      }
    } else if (selectedKey.includes("-tc-")) {
      // test case node
      const [storyId, , tcIdx] = selectedKey.split("-");
      const story = userStories.find(
        (s) => s.id === `${storyId}-${tcIdx}` || s.id === storyId
      );
      if (story) {
        const tcIndex = Number(tcIdx);
        const testCase = story.testCases[tcIndex];
        if (testCase) {
          selectedStory = story;
          selectedTestCase = { ...testCase, userStoryId: story.id };
        }
      }
    }
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={340}
        style={{ background: "#fff", borderRight: "1px solid #eee" }}
      >
        <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
          <Input
            placeholder="搜尋 user story、測試或步驟..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div
          style={{ padding: 8, overflow: "auto", height: "calc(100vh - 56px)" }}
        >
          {treeData.length > 0 ? (
            <Tree
              treeData={treeData}
              showIcon
              defaultExpandAll
              selectedKeys={selectedKey ? [selectedKey] : []}
              onSelect={(keys) => {
                const key = keys[0] as string;
                setSelectedKey(key);
                // 如果是 user story 節點，push 到 /stories/[storyId]
                if (key.startsWith("US-") && !key.includes("-tc-")) {
                  router.push(`/stories/${key}`);
                }
              }}
            />
          ) : (
            <Empty description="查無資料" style={{ marginTop: 40 }} />
          )}
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            borderBottom: "1px solid #eee",
            padding: "0 24px",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            User Story 與測試對應查詢
          </Title>
        </Header>
        <Content style={{ margin: 24 }}>
          {selectedStep ? (
            <Card title={"測試步驟"} variant="borderless">
              <Paragraph>
                <b>步驟：</b> {selectedStep.step}
              </Paragraph>
              <Paragraph>
                <b>所屬 User Story：</b> {selectedStep.userStoryId}
              </Paragraph>
              <Paragraph>
                <b>所屬 Test Case：</b> {selectedTestCase?.file} #{" "}
                {selectedTestCase?.name}
              </Paragraph>
            </Card>
          ) : selectedTestCase ? (
            <Card
              title={selectedTestCase.file + " # " + selectedTestCase.name}
              variant="borderless"
            >
              <Paragraph>
                <b>所屬 User Story：</b> {selectedTestCase.userStoryId}
              </Paragraph>
              <Paragraph>
                <b>測試檔案：</b> {selectedTestCase.file}
              </Paragraph>
              <Paragraph>
                <b>測試名稱：</b> {selectedTestCase.name}
              </Paragraph>
              {selectedTestCase.steps && selectedTestCase.steps.length > 0 && (
                <>
                  <Paragraph>
                    <b>步驟：</b>
                  </Paragraph>
                  <ol>
                    {selectedTestCase.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </>
              )}
            </Card>
          ) : selectedStory ? (
            <Card title={selectedStory.title} variant="borderless">
              <Paragraph>
                <b>ID：</b>
                {selectedStory.id}
              </Paragraph>
              <Paragraph>
                <b>描述：</b>
                {selectedStory.description}
              </Paragraph>
              <Paragraph>
                <b>對應測試：</b>
              </Paragraph>
              {selectedStory.testCases.length > 0 ? (
                <ul>
                  {selectedStory.testCases.map((tc, idx) => (
                    <li key={idx}>
                      {tc.file} <b>#</b> {tc.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <Paragraph type="warning">尚未對應測試案例</Paragraph>
              )}
              {selectedStory.testCases.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Paragraph>
                    <b>測試步驟：</b>
                  </Paragraph>
                  <ul>
                    {selectedStory.testCases.flatMap((tc) =>
                      tc.steps && tc.steps.length > 0
                        ? tc.steps.map((step, sidx) => (
                            <li key={tc.file + "-" + tc.name + "-" + sidx}>
                              {step}
                            </li>
                          ))
                        : []
                    )}
                  </ul>
                </div>
              )}
            </Card>
          ) : (
            <Paragraph>請選擇 user story、測試案例或步驟</Paragraph>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
