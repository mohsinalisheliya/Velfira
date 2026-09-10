import { Outlet, NavLink, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/coupons", label: "Coupons" },
  { to: "/admin/banners", label: "Banners" },
  { to: "/admin/logs", label: "System Logs" },
  { to: "/admin/themes", label: "Themes" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const username = localStorage.getItem("velfira_admin_username");

  const handleLogout = () => {
    localStorage.removeItem("velfira_admin_access");
    localStorage.removeItem("velfira_admin_refresh");
    localStorage.removeItem("velfira_admin_username");
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <img src="/logo-v.png" alt="Velfira" className="admin-sidebar-logo" />
        <nav>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <span>Hi, {username}</span>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}