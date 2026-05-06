import { Navigate, useLocation } from "react-router-dom";
import { isOwnerSession } from "@/auth/session";

export function OwnerRoute({ children }) {
  const location = useLocation();
  if (!isOwnerSession()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}