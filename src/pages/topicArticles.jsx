import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Empty, Spin, Tag } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { request } from "@/api/client";
import { isOwnerSession } from "@/auth/session";
import "./articles.css";

const getTextFromHtml = (html) => {
  const element = document.createElement("div");
  element.innerHTML = html;
  return element.textContent || element.innerText || "";
};

function TopicArticlesInner({ slug, titleFromNav }) {
  const navigate = useNavigate();
  const owner = isOwnerSession();
  const [articles, setArticles] = useState([]);
  const [topicName, setTopicName] = useState(typeof titleFromNav === "string" ? titleFromNav : "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolvedTitle = useMemo(() => topicName || slug || "专题", [topicName, slug]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        if (!titleFromNav) {
          const topics = await request("/api/topics");
          if (!cancelled && Array.isArray(topics)) {
            const hit = topics.find((t) => t.slug === slug);
            if (hit?.name) setTopicName(hit.name);
          }
        }
        const data = await request(`/api/topics/${encodeURIComponent(slug)}/articles`);
        if (!cancelled) {
          setArticles(Array.isArray(data) ? data : []);
          if (!titleFromNav && Array.isArray(data) && data[0]?.topicName) {
            setTopicName(data[0].topicName);
          }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "加载失败");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, titleFromNav]);

  return (
    <main className="articles-page">
      <header className="articles-header">
        <div>
          <span>Topic</span>
          <h1>{resolvedTitle}</h1>
          <p>本页仅展示该专题下的文章。</p>
        </div>
        <div className="articles-header__actions">
          <Button onClick={() => navigate("/")}>返回首页</Button>
          <Button onClick={() => navigate("/articles")}>全部文章</Button>
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
        <Empty description="该专题下暂无文章">
          {owner ? (
            <Button type="primary" onClick={() => navigate("/articles/write")}>
              写一篇
            </Button>
          ) : (
            <Button type="primary" onClick={() => navigate("/articles")}>
              看看全部文章
            </Button>
          )}
        </Empty>
      )}
    </main>
  );
}

export function TopicArticles() {
  const { slug } = useParams();
  const location = useLocation();
  const titleFromNav = location.state?.topicName;

  if (!slug) {
    return null;
  }

  return <TopicArticlesInner key={slug} slug={slug} titleFromNav={titleFromNav} />;
}