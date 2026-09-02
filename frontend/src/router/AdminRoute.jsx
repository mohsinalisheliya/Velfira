import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const adminToken = localStorage.getItem("velfira_admin_access");
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}