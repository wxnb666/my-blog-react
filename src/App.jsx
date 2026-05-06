import { Button, Card, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { defaultArticles } from "@/data/articles";
import "./App.css";

const topics = ["React", "Redux", "Ant Design", "前端工程化", "生活随笔"];

function App() {
  const navigate = useNavigate();

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
        </nav>
      </header>

      <section className="blog-hero">
        <div className="blog-hero__text">
          <Tag color="blue">Xinge Blog</Tag>
          <h1>欢迎来到鑫哥的博客主界面</h1>
          <p>
            这里会展示你的技术文章、项目复盘和灵感记录。登录后可以继续完善文章管理、
            专题分类和个人主页能力。
          </p>
          <div className="blog-hero__actions">
            <Button type="primary" size="large" onClick={() => navigate("/articles/write")}>
              开始写文章
            </Button>
            <Button size="large" onClick={() => navigate("/articles")}>
              查看全部文章
            </Button>
          </div>
        </div>

        <Card className="blog-profile" id="about">
          <span className="blog-profile__avatar">鑫</span>
          <h2>鑫哥</h2>
          <p>前端开发者 / React 学习者 / 博客建设中</p>
          <div className="blog-profile__stats">
            <span>
              <strong>128+</strong>文章
            </span>
            <span>
              <strong>36</strong>专题
            </span>
            <span>
              <strong>7k+</strong>阅读
            </span>
          </div>
        </Card>
      </section>

      <section className="blog-section" id="articles">
        <div className="blog-section__title">
          <span>Latest Posts</span>
          <h2>最新文章</h2>
        </div>

        <div className="article-grid">
          {defaultArticles.map((article) => (
            <article className="article-card" key={article.title}>
              <div className="article-card__meta">
                <Tag color="geekblue">{article.tag}</Tag>
                <span>{article.date}</span>
              </div>
              <h3>{article.title}</h3>
              <p>{article.desc}</p>
              <button type="button" onClick={() => navigate(`/articles/${article.id}`)}>
                阅读全文
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="blog-section blog-topics" id="topics">
        <div className="blog-section__title">
          <span>Topics</span>
          <h2>博客专题</h2>
        </div>

        <div className="topic-list">
          {topics.map((topic) => (
            <button type="button" key={topic}>
              {topic}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
