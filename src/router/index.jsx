import { Login } from "@/pages/login";
import App from "@/App";
import { ArticleEditor } from "@/pages/articleEditor";
import { ArticleDetail } from "@/pages/articleDetail";
import { Articles } from "@/pages/articles";
import { TopicArticles } from "@/pages/topicArticles";
import { OwnerComments } from "@/pages/ownerComments";
import { OwnerRoute } from "@/components/OwnerRoute";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/owner/comments",
    element: (
      <OwnerRoute>
        <OwnerComments />
      </OwnerRoute>
    ),
  },
  {
    path: "/topics/:slug",
    element: <TopicArticles />,
  },
  {
    path: "/articles",
    element: <Articles />,
  },
  {
    path: "/articles/write",
    element: (
      <OwnerRoute>
        <ArticleEditor />
      </OwnerRoute>
    ),
  },
  {
    path: "/articles/:articleId",
    element: <ArticleDetail />,
  },
]);