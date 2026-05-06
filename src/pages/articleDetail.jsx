import { Button, Empty, Spin, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { request } from "@/api/client";
import { ArticleComments } from "./articleComments.jsx";
import "./articleDetail.css";

function stripHtml(html) {
  if (!html) return "";
  const el = document.createElement("div");
  el.innerHTML = html;
  return (el.textContent || el.innerText || "").replace(/\s+/g, " ").trim();
}

function countMeaningfulChars(text) {
  return text.replace(/\s/g, "").length;
}

function estimateReadMinutes(chars) {
  if (chars <= 0) return 1;
  return Math.max(1, Math.round(chars / 420));
}

function formatZhDateTime(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function isUpdatedMeaningfully(createdAt, updatedAt) {
  if (!createdAt || !updatedAt) return false;
  return new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 60_000;
}

const DEFAULT_AUTHOR_BIO =
  "前端开发者，关注 React 与工程化实践；长期通过博客沉淀学习笔记、项目复盘与可复用的脚手架经验。";

function ArticleDetailInner({ articleId }) {
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    request(`/api/articles/${encodeURIComponent(articleId)}`)
      .then((data) => {
        if (cancelled) return;
        setArticle(data);
        request(`/api/articles/${encodeURIComponent(articleId)}/view`, { method: "POST" })
          .then((inc) => {
            if (cancelled || !inc || typeof inc.viewCount !== "number") return;
            setArticle((prev) => (prev ? { ...prev, viewCount: inc.viewCount } : prev));
          })
          .catch(() => {});
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

  const metrics = useMemo(() => {
    if (!article) return null;
    const plain = `${stripHtml(article.content)} ${article.desc ?? ""}`.trim();
    const chars = countMeaningfulChars(plain);
    return {
      charCount: chars,
      readMinutes: estimateReadMinutes(chars),
    };
  }, [article]);

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

  if (!article || !metrics) {
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

  const publishedLabel = formatZhDateTime(article.createdAt);
  const updatedLabel = formatZhDateTime(article.updatedAt);
  const showUpdated = isUpdatedMeaningfully(article.createdAt, article.updatedAt);

  return (
    <main className="article-detail">
      <nav className="article-detail__breadcrumb" aria-label="面包屑导航">
        <Link to="/">首页</Link>
        <span className="article-detail__crumb-sep" aria-hidden>
          /
        </span>
        <Link to="/articles">全部文章</Link>
        {article.topicSlug ? (
          <>
            <span className="article-detail__crumb-sep" aria-hidden>
              /
            </span>
            <Link
              to={`/topics/${encodeURIComponent(article.topicSlug)}`}
              state={{ topicName: article.topicName }}
            >
              {article.topicName || article.topicSlug}
            </Link>
          </>
        ) : null}
        <span className="article-detail__crumb-sep" aria-hidden>
          /
        </span>
        <span className="article-detail__crumb-current">正文</span>
      </nav>

      <article className="article-detail__card">
        <header className="article-detail__header">
          <div className="article-detail__eyebrow">
            {article.topicSlug ? (
              <Link
                className="article-detail__topic-pill"
                to={`/topics/${encodeURIComponent(article.topicSlug)}`}
                state={{ topicName: article.topicName }}
              >
                专栏 · {article.topicName || article.tag}
              </Link>
            ) : (
              <span className="article-detail__topic-pill article-detail__topic-pill--muted">
                未归类
              </span>
            )}
            <Tag className="article-detail__tag" color="blue">
              {article.tag}
            </Tag>
          </div>

          <h1 className="article-detail__title">{article.title}</h1>

          <p className="article-detail__lead">{article.desc}</p>

          <dl className="article-detail__meta-grid" aria-label="文章元信息">
            <div className="article-detail__meta-item">
              <dt>作者</dt>
              <dd>{article.author}</dd>
            </div>
            <div className="article-detail__meta-item">
              <dt>展示日期</dt>
              <dd>{article.date}</dd>
            </div>
            {publishedLabel ? (
              <div className="article-detail__meta-item">
                <dt>系统发布时间</dt>
                <dd>{publishedLabel}</dd>
              </div>
            ) : null}
            {showUpdated && updatedLabel ? (
              <div className="article-detail__meta-item">
                <dt>最后更新</dt>
                <dd>{updatedLabel}</dd>
              </div>
            ) : null}
            <div className="article-detail__meta-item">
              <dt>字数规模</dt>
              <dd>约 {metrics.charCount.toLocaleString("zh-CN")} 字（正文 + 摘要）</dd>
            </div>
            <div className="article-detail__meta-item">
              <dt>预计阅读</dt>
              <dd>约 {metrics.readMinutes} 分钟 · 按中文信息密度估算</dd>
            </div>
            <div className="article-detail__meta-item">
              <dt>阅读量</dt>
              <dd>{article.viewCount != null ? article.viewCount.toLocaleString("zh-CN") : "—"}</dd>
            </div>
            <div className="article-detail__meta-item article-detail__meta-item--wide">
              <dt>文章编号</dt>
              <dd>
                <code className="article-detail__id-code">{article.id}</code>
                <span className="article-detail__id-hint">用于分享链接与后台检索定位</span>
              </dd>
            </div>
          </dl>

          <p className="article-detail__meta-note">
            以上元数据由服务端记录与前端统计共同生成；若刚完成编辑，「最后更新」可能与缓存存在短暂不一致。
          </p>
        </header>

        <div className="article-detail__divider" role="separator" />

        <div
          className="article-detail__content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <ArticleComments articleId={articleId} />

        <footer className="article-detail__about-author">
          <h2 className="article-detail__about-title">关于作者</h2>
          <p className="article-detail__about-text">
            <strong>{article.author}</strong> — {DEFAULT_AUTHOR_BIO}
          </p>
          <div className="article-detail__about-actions">
            <Button type="default" onClick={() => navigate("/articles")}>
              返回文章列表
            </Button>
            <Button type="primary" onClick={() => navigate("/")}>
              回到首页
            </Button>
          </div>
        </footer>
      </article>
    </main>
  );
}

export function ArticleDetail() {
  const { articleId } = useParams();

  if (!articleId) {
    return null;
  }

  return <ArticleDetailInner key={articleId} articleId={articleId} />;
}
