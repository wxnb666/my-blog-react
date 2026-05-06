import { Button, Empty, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { request } from "@/api/client";
import "./articleDetail.css";

export const ArticleDetail = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!articleId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setArticle(null);
    request(`/api/articles/${encodeURIComponent(articleId)}`)
      .then((data) => {
        if (!cancelled) setArticle(data);
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
  }, [articleId]);

  if (loading) {
    return (
      <main className="article-detail article-detail--empty">
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <Spin size="large" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="article-detail article-detail--empty">
        <Empty description={error}>
          <Button type="primary" onClick={() => navigate("/articles")}>
            返回全部文章
          </Button>
        </Empty>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="article-detail article-detail--empty">
        <Empty description="没有找到这篇文章">
          <Button type="primary" onClick={() => navigate("/articles")}>
            返回全部文章
          </Button>
        </Empty>
      </main>
    );
  }

  return (
    <main className="article-detail">
      <header className="article-detail__nav">
        <Link to="/home">首页</Link>
        <Link to="/articles">全部文章</Link>
      </header>

      <article className="article-detail__card">
        <div className="article-detail__meta">
          <Tag color="blue">{article.tag}</Tag>
          <span>{article.date}</span>
          <span>作者：{article.author}</span>
        </div>

        <h1>{article.title}</h1>
        <p className="article-detail__desc">{article.desc}</p>

        <div
          className="article-detail__content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </main>
  );
};
