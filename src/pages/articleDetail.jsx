import { Button, Empty, Tag } from "antd";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ARTICLE_STORAGE_KEY, defaultArticles } from "@/data/articles";
import "./articleDetail.css";

export const ArticleDetail = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();

  const article = useMemo(() => {
    const savedArticles = JSON.parse(localStorage.getItem(ARTICLE_STORAGE_KEY) || "[]");
    return [...savedArticles, ...defaultArticles].find((item) => item.id === articleId);
  }, [articleId]);

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
