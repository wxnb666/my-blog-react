import { useEffect, useState } from "react";
import { Alert, Button, Card, Empty, Spin, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { request } from "@/api/client";
import { isOwnerSession } from "@/auth/session";
import "./articles.css";

const getTextFromHtml = (html) => {
  const element = document.createElement("div");
  element.innerHTML = html;
  return element.textContent || element.innerText || "";
};

export const Articles = () => {
  const navigate = useNavigate();
  const owner = isOwnerSession();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    request("/api/articles")
      .then((data) => {
        if (!cancelled) setArticles(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "加载失败");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="articles-page">
      <header className="articles-header">
        <div>
          <span>All Posts</span>
          <h1>鑫哥的全部文章</h1>
          <p>公开文章列表；读者可直接阅读并在文末评论。</p>
        </div>
        <div className="articles-header__actions">
          <Button onClick={() => navigate("/")}>返回首页</Button>
          {owner ? (
            <Button type="primary" onClick={() => navigate("/articles/write")}>
              写新文章
            </Button>
          ) : null}
        </div>
      </header>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />
      ) : articles.length > 0 ? (
        <section className="articles-list">
          {articles.map((article) => (
            <Card className="articles-card" key={article.id}>
              <div className="articles-card__meta">
                <Tag color="blue">{article.tag}</Tag>
                <span>{article.date}</span>
                {article.viewCount != null ? <span>阅读 {article.viewCount}</span> : null}
              </div>
              <h2>{article.title}</h2>
              <p>{article.desc || getTextFromHtml(article.content).slice(0, 80)}</p>
              <div className="articles-card__footer">
                <span>作者：{article.author}</span>
                <Link to={`/articles/${article.id}`}>阅读全文</Link>
              </div>
            </Card>
          ))}
        </section>
      ) : (
        <Empty description="暂无文章">
          {owner ? (
            <Button type="primary" onClick={() => navigate("/articles/write")}>
              现在去写
            </Button>
          ) : (
            <Button type="primary" onClick={() => navigate("/")}>
              返回首页
            </Button>
          )}
        </Empty>
      )}
    </main>
  );
};