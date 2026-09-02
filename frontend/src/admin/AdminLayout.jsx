import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ padding: 24 }}>
      <h3>Velfira Admin</h3>
      <Outlet />
    </div>
  );
}