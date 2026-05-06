import { Login } from "@/pages/login";
import App from "@/App";
import { ArticleEditor } from "@/pages/articleEditor";
import { ArticleDetail } from "@/pages/articleDetail";
import { Articles } from "@/pages/articles";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <App />,
  },
  {
    path: "/articles",
    element: <Articles />,
  },
  {
    path: "/articles/write",
    element: <ArticleEditor />,
  },
  {
    path: "/articles/:articleId",
    element: <ArticleDetail />,
  },
]);
