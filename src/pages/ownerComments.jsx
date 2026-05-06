import { useEffect, useState } from "react";
import { Button, Input, Modal, Space, Table, Tag, Typography, message } from "antd";
import { Link } from "react-router-dom";
import { request } from "@/api/client";
import "./ownerComments.css";

const { Text, Title } = Typography;

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function OwnerComments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    request("/api/admin/comments")
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((e) => {
        message.error(e instanceof Error ? e.message : "加载失败");
        setRows([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submitReply = async () => {
    if (!active) return;
    const content = reply.trim();
    if (!content) {
      message.warning("请输入回复内容");
      return;
    }
    setSubmitting(true);
    try {
      await request(`/api/admin/comments/${active.id}/reply`, {
        method: "POST",
        json: { content },
      });
      message.success("已回复");
      setOpen(false);
      setReply("");
      setActive(null);
      load();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "回复失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="owner-comments">
      <header className="owner-comments__header">
        <div>
          <span className="owner-comments__eyebrow">Owner</span>
          <Title level={2} className="owner-comments__title">
            评论与互动
          </Title>
          <Text type="secondary">在这里查看读者留言，并回复到对应文章下方。</Text>
        </div>
        <Space>
          <Link to="/">返回首页</Link>
          <Link to="/articles/write">写文章</Link>
          <Button onClick={load}>刷新</Button>
        </Space>
      </header>

      <Table
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        dataSource={rows}
        columns={[
          {
            title: "时间",
            dataIndex: "createdAt",
            width: 170,
            render: (v) => formatTime(v),
          },
          {
            title: "文章",
            dataIndex: "articleTitle",
            render: (t, record) => (
              <Link to={`/articles/${encodeURIComponent(record.articleId)}`}>{t}</Link>
            ),
          },
          {
            title: "读者",
            dataIndex: "displayName",
            width: 140,
            render: (name, record) => (
              <Space size={6}>
                <Text strong>{name}</Text>
                {record.isOwnerReply ? <Tag color="blue">博主</Tag> : null}
              </Space>
            ),
          },
          {
            title: "内容",
            dataIndex: "body",
            ellipsis: true,
            render: (v) => <span className="owner-comments__body">{v}</span>,
          },
          {
            title: "操作",
            key: "actions",
            width: 120,
            render: (_, record) => (
              <Button
                type="link"
                onClick={() => {
                  setActive(record);
                  setReply("");
                  setOpen(true);
                }}
              >
                回复
              </Button>
            ),
          },
        ]}
      />

      <Modal
        title="博主回复"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submitReply}
        confirmLoading={submitting}
        okText="发送回复"
      >
        {active ? (
          <div className="owner-comments__modal-context">
            <Text type="secondary">原评论 · {active.displayName}</Text>
            <div className="owner-comments__modal-quote">{active.body}</div>
          </div>
        ) : null}
        <Input.TextArea
          rows={5}
          maxLength={2000}
          showCount
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="你的回复会出现在文章评论区，并标记为博主。"
        />
      </Modal>
    </main>
  );
}