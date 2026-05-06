import { Button, Card, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "@/api/client";
import { clearSession, isOwnerSession } from "@/auth/session";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const owner = isOwnerSession();
  const [latest, setLatest] = useState([]);
  const [topics, setTopics] = useState([]);
  const [stats, setStats] = useState({ articleCount: 0, topicCount: 0, totalViews: 0 });
  const [loadingHome, setLoadingHome] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      request("/api/articles?limit=3").catch(() => []),
      request("/api/topics").catch(() => []),
      request("/api/stats").catch(() => null),
    ])
      .then(([latestData, topicsData, statsData]) => {
        if (cancelled) return;
        if (Array.isArray(latestData)) setLatest(latestData);
        if (Array.isArray(topicsData)) setTopics(topicsData);
        if (statsData && typeof statsData === "object") {
          setStats({
            articleCount: Number(statsData.articleCount) || 0,
            topicCount: Number(statsData.topicCount) || 0,
            totalViews: Number(statsData.totalViews) || 0,
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingHome(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="blog-home">
      <header className="blog-header">
        <div className="blog-brand">
          <div>
            <strong>鑫哥的博客</strong>
            <span>记录技术，也记录生活</span>
          </div>
        </div>

        <nav className="blog-nav" aria-label="博客导航">
          <a href="#articles">文章</a>
          <button type="button" onClick={() => navigate("/articles")}>
            全部文章
          </button>
          <a href="#topics">专题</a>
          <a href="#about">关于</a>
          {owner ? (
            <>
              <button type="button" onClick={() => navigate("/articles/write")}>
                写文章
              </button>
              <button type="button" onClick={() => navigate("/owner/comments")}>
                评论管理
              </button>
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  navigate("/login");
                }}
              >
                退出博主
              </button>
            </>
          ) : (
            <button type="button" onClick={() => navigate("/login")}>
              博主登录
            </button>
          )}
        </nav>
      </header>

      <section className="blog-hero">
        <div className="blog-hero__text">
          <Tag color="blue">Xinge Blog</Tag>
          <h1>欢迎来到鑫哥的博客</h1>
          <p>
            这里是公开阅读区：你可以浏览文章、按专题查看内容，并在文章底部发表评论。博主登录后可发布文章与回复读者。
          </p>
          <div className="blog-hero__actions">
            {owner ? (
              <Button type="primary" size="large" onClick={() => navigate("/articles/write")}>
                写文章
              </Button>
            ) : null}
            <Button size="large" type={owner ? "default" : "primary"} onClick={() => navigate("/articles")}>
              查看全部文章
            </Button>
            {!owner ? (
              <Button size="large" onClick={() => navigate("/login")}>
                博主登录
              </Button>
            ) : null}
          </div>
        </div>

        <Card className="blog-profile" id="about">
          <span className="blog-profile__avatar">鑫</span>
          <h2>鑫哥</h2>
          <p>前端开发者 / React 学习者 / 博客建设中</p>
          <div className="blog-profile__stats">
            {loadingHome ? (
              <span style={{ gridColumn: "1/-1" }}>
                <Spin size="small" />
              </span>
            ) : (
              <>
                <span>
                  <strong>{stats.articleCount}</strong>文章
                </span>
                <span>
                  <strong>{stats.topicCount}</strong>专题
                </span>
                <span>
                  <strong>{stats.totalViews}</strong>阅读
                </span>
              </>
            )}
          </div>
        </Card>
      </section>

      <section className="blog-section" id="articles">
        <div className="blog-section__title">
          <span>Latest Posts</span>
          <h2>最新文章</h2>
        </div>

        <div className="article-grid">
          {loadingHome ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "32px 0" }}>
              <Spin />
            </div>
          ) : latest.length === 0 ? (
            <p style={{ gridColumn: "1/-1" }}>暂无文章，可先启动后端并完成数据库初始化。</p>
          ) : (
            latest.map((article) => (
              <article className="article-card" key={article.id}>
                <div className="article-card__meta">
                  <Tag color="geekblue">{article.tag}</Tag>
                  <span>{article.date}</span>
                  {article.viewCount != null ? <span>阅读 {article.viewCount}</span> : null}
                </div>
                <h3>{article.title}</h3>
                <p>{article.desc}</p>
                <button type="button" onClick={() => navigate(`/articles/${article.id}`)}>
                  阅读全文
                </button>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="blog-section blog-topics" id="topics">
        <div className="blog-section__title">
          <span>Topics</span>
          <h2>博客专题</h2>
        </div>

        <div className="topic-list">
          {loadingHome ? (
            <div style={{ padding: "16px 0" }}>
              <Spin />
            </div>
          ) : topics.length === 0 ? (
            <p>暂无专题数据，请运行后端并执行 npm run seed。</p>
          ) : (
            topics.map((topic) => (
              <button
                type="button"
                key={topic.slug}
                onClick={() =>
                  navigate(`/topics/${encodeURIComponent(topic.slug)}`, {
                    state: { topicName: topic.name },
                  })
                }
              >
                {topic.name}
                {topic.articleCount != null ? `（${topic.articleCount}）` : ""}
              </button>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default App;