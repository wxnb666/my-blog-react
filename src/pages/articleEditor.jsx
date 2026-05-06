import { useRef, useState } from "react";
import { Button, Card, Form, Input, Select, Space, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { request } from "@/api/client";
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
  const [submitting, setSubmitting] = useState(false);

  const runCommand = (command, value) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const handlePublish = async (values) => {
    const content = editorRef.current?.innerHTML.trim();

    if (!content) {
      message.warning("请先输入文章正文");
      return;
    }

    setSubmitting(true);
    try {
      await request("/api/articles", {
        method: "POST",
        json: {
          title: values.title,
          desc: values.desc,
          tag: values.tag,
          content,
          author: "鑫哥",
        },
      });
      message.success("文章已保存到数据库");
      navigate("/articles");
    } catch (e) {
      message.error(e instanceof Error ? e.message : "发布失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="editor-page">
      <header className="editor-header">
        <div>
          <span>Write Post</span>
          <h1>写一篇新的博客文章</h1>
          <p>发布后将通过接口写入 MySQL。</p>
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
            <Button type="primary" htmlType="submit" loading={submitting}>
              发布文章
            </Button>
          </div>
        </Form>
      </Card>
    </main>
  );
};
