import { useMemo } from "react";
import { Button, Card, Empty, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ARTICLE_STORAGE_KEY, defaultArticles } from "@/data/articles";
import "./articles.css";

const getTextFromHtml = (html) => {
  const element = document.createElement("div");
  element.innerHTML = html;
  return element.textContent || element.innerText || "";
};

export const Articles = () => {
  const navigate = useNavigate();

  const articles = useMemo(() => {
    const savedArticles = JSON.parse(localStorage.getItem(ARTICLE_STORAGE_KEY) || "[]");
    return [...savedArticles, ...defaultArticles];
  }, []);

  return (
    <main className="articles-page">
      <header className="articles-header">
        <div>
          <span>All Posts</span>
          <h1>鑫哥的全部文章</h1>
          <p>这里展示已发布文章，当前先使用前端本地数据，后续可替换为后端接口。</p>
        </div>
        <div className="articles-header__actions">
          <Button onClick={() => navigate("/home")}>返回首页</Button>
          <Button type="primary" onClick={() => navigate("/articles/write")}>
            写新文章
          </Button>
        </div>
      </header>

      {articles.length > 0 ? (
        <section className="articles-list">
          {articles.map((article) => (
            <Card className="articles-card" key={article.id}>
              <div className="articles-card__meta">
                <Tag color="blue">{article.tag}</Tag>
                <span>{article.date}</span>
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
          <Button type="primary" onClick={() => navigate("/articles/write")}>
            现在去写
          </Button>
        </Empty>
      )}
    </main>
  );
};
