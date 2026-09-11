import { useEffect, useState } from "react";
import { listAdminOrders, updateOrderStatus } from "../../api/adminOrders";

const STATUSES = ["placed", "packed", "shipped", "delivered", "cancelled"];

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => listAdminOrders().then((res) => setOrders(res.data)).catch(console.error).finally(() => setLoading(false));
  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status);
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <h2 className="admin-page-title">Orders</h2>
      <div className="admin-filter-tabs">
        {["all", ...STATUSES].map((f) => (
          <button key={f} className={`admin-filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>
      <div className="admin-panel">
        {loading ? <p className="admin-empty-note">Loading…</p> : (
          <table className="admin-table">
            <thead><tr><th>Order</th><th>Mobile</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.user_mobile}</td>
                  <td>{o.items?.length}</td>
                  <td>₹{Number(o.total).toLocaleString("en-IN")}</td>
                  <td><span className={`admin-badge ${o.payment_status}`}>{o.payment_status}</span></td>
                  <td>
                    <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)} className="admin-status-select">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}