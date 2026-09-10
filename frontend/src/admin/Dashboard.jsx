import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getSalesSummary, getTopProducts, getLowStock, getRecentOrders, getRevenueTrend } from "../api/admin";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    getSalesSummary().then((res) => setSummary(res.data)).catch(console.error);
    getTopProducts().then((res) => setTopProducts(res.data)).catch(console.error);
    getLowStock().then((res) => setLowStock(res.data)).catch(console.error);
    getRecentOrders().then((res) => setRecentOrders(res.data)).catch(console.error);
    getRevenueTrend(30).then((res) => {
      const formatted = res.data.map((d) => ({
        day: new Date(d.day).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        revenue: Number(d.revenue),
      }));
      setTrend(formatted);
    }).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="admin-page-title">Dashboard</h2>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <span>💰 Total Revenue</span>
          <strong>₹{Number(summary?.total_revenue || 0).toLocaleString("en-IN")}</strong>
        </div>
        <div className="admin-stat-card">
          <span>📦 Total Orders</span>
          <strong>{summary?.total_orders || 0}</strong>
        </div>
        <div className="admin-stat-card">
          <span>📅 This Month</span>
          <strong>₹{Number(summary?.this_month_revenue || 0).toLocaleString("en-IN")}</strong>
        </div>
        <div className="admin-stat-card">
          <span>🛒 Today's Orders</span>
          <strong>{summary?.today_orders || 0}</strong>
        </div>
      </div>

      <div className="admin-panel">
        <h3>Revenue — Last 30 Days</h3>
        {trend.length === 0 ? (
          <p className="admin-empty-note">No revenue data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend}>
              <CartesianGrid stroke="#F0F1F3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} contentStyle={{ borderRadius: 8, border: "1px solid #EEF0F3", fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#B08D3E" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="admin-two-col">
        <div className="admin-panel">
          <h3>Top Products</h3>
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Qty Sold</th><th>Revenue</th></tr></thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.product__id}>
                  <td>{p.product__name}</td>
                  <td>{p.total_qty}</td>
                  <td>₹{Number(p.total_revenue).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-panel">
          <h3>Low Stock Alerts</h3>
          {lowStock.length === 0 ? (
            <p className="admin-empty-note">All products well stocked.</p>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Product</th><th>Stock</th></tr></thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id}><td>{p.name}</td><td className="admin-stock-low">{p.stock_qty}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="admin-panel">
        <h3>Recent Orders</h3>
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Mobile</th><th>Status</th><th>Payment</th><th>Total</th><th>Date</th></tr></thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.mobile}</td>
                <td><span className={`admin-badge ${o.status}`}>{o.status}</span></td>
                <td><span className={`admin-badge ${o.payment_status}`}>{o.payment_status}</span></td>
                <td>₹{Number(o.total).toLocaleString("en-IN")}</td>
                <td>{o.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}