import { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, List, Typography, message } from "antd";
import { request } from "@/api/client";
import "./articleComments.css";

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

function CommentNode({ comment, childrenMap, onReply }) {
  const replies = childrenMap.get(comment.id) ?? [];
  return (
    <div className="article-comments__node">
      <div className="article-comments__bubble">
        <div className="article-comments__item-head">
          <strong className="article-comments__name">{comment.displayName}</strong>
          {comment.isOwnerReply ? <span className="article-comments__badge">博主</span> : null}
          <span className="article-comments__time">{formatTime(comment.createdAt)}</span>
        </div>
        <p className="article-comments__body">{comment.body}</p>
        <Button type="link" size="small" onClick={() => onReply(comment)}>
          回复
        </Button>
      </div>
      {replies.length > 0 ? (
        <div className="article-comments__nested">
          {replies.map((r) => (
            <CommentNode key={r.id} comment={r} childrenMap={childrenMap} onReply={onReply} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ArticleComments({ articleId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [form] = Form.useForm();

  const reload = () => {
    request(`/api/articles/${encodeURIComponent(articleId)}/comments`)
      .then((data) => {
        setComments(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setComments([]);
        message.error("评论加载失败");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload on articleId only
  }, [articleId]);

  const roots = useMemo(
    () => comments.filter((c) => c.parentId == null).sort((a, b) => a.id - b.id),
    [comments],
  );

  const childrenMap = useMemo(() => {
    const map = new Map();
    for (const c of comments) {
      if (c.parentId == null) continue;
      const key = c.parentId;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => a.id - b.id);
    }
    return map;
  }, [comments]);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      await request(`/api/articles/${encodeURIComponent(articleId)}/comments`, {
        method: "POST",
        json: {
          displayName: values.displayName,
          content: values.content,
          parentId: replyTo?.id,
        },
      });
      message.success("评论已发布");
      form.resetFields(["content"]);
      setReplyTo(null);
      reload();
    } catch (e) {
      message.error(e instanceof Error ? e.message : "发布失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="article-comments" aria-label="评论区">
      <div className="article-comments__head">
        <Title level={3} className="article-comments__title">
          读者评论
        </Title>
        <Text type="secondary">文明发言，禁止垃圾信息与人身攻击。</Text>
      </div>

      <div className="article-comments__composer">
        {replyTo ? (
          <div className="article-comments__replying">
            <Text>
              正在回复 <strong>{replyTo.displayName}</strong>
            </Text>
            <Button type="link" size="small" onClick={() => setReplyTo(null)}>
              取消
            </Button>
          </div>
        ) : null}

        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ displayName: "" }}>
          <Form.Item
            label="昵称"
            name="displayName"
            rules={[{ required: true, message: "请输入昵称" }]}
          >
            <Input maxLength={64} placeholder="怎么称呼你" />
          </Form.Item>
          <Form.Item
            label="评论内容"
            name="content"
            rules={[{ required: true, message: "请输入评论内容" }]}
          >
            <Input.TextArea rows={4} maxLength={2000} showCount placeholder="写下你的想法…" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            发布评论
          </Button>
        </Form>
      </div>

      <div className="article-comments__list">
        {loading ? (
          <Text type="secondary">加载评论中…</Text>
        ) : roots.length === 0 ? (
          <Text type="secondary">还没有评论，欢迎抢沙发。</Text>
        ) : (
          <List
            dataSource={roots}
            renderItem={(item) => (
              <List.Item className="article-comments__item">
                <CommentNode comment={item} childrenMap={childrenMap} onReply={setReplyTo} />
              </List.Item>
            )}
          />
        )}
      </div>
    </section>
  );
}