import { useRef } from "react";
import { Button, Card, Form, Input, Select, Space, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ARTICLE_STORAGE_KEY } from "@/data/articles";
import "./articleEditor.css";

const toolbarItems = [
  { label: "加粗", command: "bold" },
  { label: "斜体", command: "italic" },
  { label: "标题", command: "formatBlock", value: "h2" },
  { label: "引用", command: "formatBlock", value: "blockquote" },
  { label: "列表", command: "insertUnorderedList" },
];

export const ArticleEditor = () => {
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const runCommand = (command, value) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const handlePublish = (values) => {
    const content = editorRef.current?.innerHTML.trim();

    if (!content) {
      message.warning("请先输入文章正文");
      return;
    }

    const article = {
      id: `article-${Date.now()}`,
      title: values.title,
      desc: values.desc,
      tag: values.tag,
      date: new Intl.DateTimeFormat("zh-CN", {
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
      author: "鑫哥",
      content,
    };

    const savedArticles = JSON.parse(localStorage.getItem(ARTICLE_STORAGE_KEY) || "[]");
    localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify([article, ...savedArticles]));

    message.success("文章已发布到前端列表");
    navigate("/articles");
  };

  return (
    <main className="editor-page">
      <header className="editor-header">
        <div>
          <span>Write Post</span>
          <h1>写一篇新的博客文章</h1>
          <p>先完成前端编辑和发布流程，后续可以直接替换为后端接口保存。</p>
        </div>
        <Space>
          <Link to="/home">返回首页</Link>
          <Link to="/articles">全部文章</Link>
        </Space>
      </header>

      <Card className="editor-card">
        <Form layout="vertical" size="large" onFinish={handlePublish}>
          <Form.Item
            label="文章标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="例如：React 路由与博客编辑器实践" />
          </Form.Item>

          <div className="editor-form-grid">
            <Form.Item
              label="文章分类"
              name="tag"
              rules={[{ required: true, message: "请选择文章分类" }]}
            >
              <Select
                placeholder="请选择分类"
                options={[
                  { label: "React", value: "React" },
                  { label: "Redux", value: "Redux" },
                  { label: "工程化", value: "工程化" },
                  { label: "随笔", value: "随笔" },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="文章摘要"
              name="desc"
              rules={[{ required: true, message: "请输入文章摘要" }]}
            >
              <Input placeholder="用一句话介绍这篇文章" />
            </Form.Item>
          </div>

          <Form.Item label="文章正文" required>
            <div className="rich-editor">
              <div className="rich-editor__toolbar">
                {toolbarItems.map((item) => (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => runCommand(item.command, item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div
                ref={editorRef}
                className="rich-editor__content"
                contentEditable
                suppressContentEditableWarning
                aria-label="文章正文编辑器"
              >
                <h2>写下你的文章小标题</h2>
                <p>在这里输入正文内容，可以使用上方工具栏做基础富文本排版。</p>
              </div>
            </div>
          </Form.Item>

          <div className="editor-actions">
            <Button onClick={() => navigate("/home")}>取消</Button>
            <Button type="primary" htmlType="submit">
              发布文章
            </Button>
          </div>
        </Form>
      </Card>
    </main>
  );
};
