export const defaultArticles = [
  {
    id: "react-blog-admin",
    title: "从零搭建 React 博客后台",
    desc: "记录 Vite、Router、Redux 与 Ant Design 的基础组合，让项目结构更清晰。",
    tag: "React",
    date: "May 06",
    author: "鑫哥",
    content:
      "<p>这篇文章记录鑫哥的博客从基础环境到页面路由的搭建过程，方便后续继续接入后台管理和接口数据。</p>",
  },
  {
    id: "frontend-engineering",
    title: "前端工程化里的那些小细节",
    desc: "聊聊路径别名、目录拆分、构建优化和日常开发体验的取舍。",
    tag: "工程化",
    date: "Apr 28",
    author: "鑫哥",
    content:
      "<p>路径别名、组件拆分和构建优化都会影响项目长期维护体验，先把基础约定搭好会省下很多沟通成本。</p>",
  },
  {
    id: "growth-list",
    title: "写给自己的技术成长清单",
    desc: "把学习节奏、项目复盘和问题记录沉淀成持续更新的博客内容。",
    tag: "随笔",
    date: "Apr 16",
    author: "鑫哥",
    content:
      "<p>成长不是一次性完成的事情，把每一次踩坑和复盘写下来，就是博客最有价值的部分。</p>",
  },
];

export const ARTICLE_STORAGE_KEY = "xinge-blog-articles";
