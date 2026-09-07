import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listOrders } from "../api/orders";
import { useAuth } from "../context/AuthContext";

const STATUS_LABELS = {
  placed: "Placed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderHistory() {
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) return;
    listOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Failed to load orders", err);
        setError("Could not load your orders. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="section">
        <div className="section-head"><h2>Order History</h2></div>
        <p style={{ padding: "0 34px" }}>
          <Link to="/account?next=/account/orders" className="btn-gold">Login to view your orders</Link>
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="section"><p style={{ padding: "0 34px" }}>Loading your orders…</p></div>;
  }

  if (error) {
    return <div className="section"><p className="otp-error" style={{ padding: "0 34px" }}>{error}</p></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="section">
        <div className="section-head"><h2>Order History</h2></div>
        <p style={{ padding: "0 34px", color: "var(--grey)" }}>You haven't placed any orders yet.</p>
        <div style={{ padding: "0 34px", marginTop: 16 }}>
          <Link to="/shop" className="btn-outline">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="section-head"><h2>Order History</h2></div>
      <div className="order-list">
        {orders.map((order) => (
          <Link to={`/order-confirmation/${order.id}`} key={order.id} className="order-row">
            <div className="order-row-main">
              <span className="order-row-id">Order #{order.id}</span>
              <span className="order-row-date">
                {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="order-row-items">
              {order.items?.slice(0, 2).map((item) => item.product_name).join(", ")}
              {order.items?.length > 2 ? ` +${order.items.length - 2} more` : ""}
            </div>
            <div className="order-row-meta">
              <span className={`order-status-badge status-${order.status}`}>
                {STATUS_LABELS[order.status] || order.status}
              </span>
              <span className="order-row-total">₹{Number(order.total).toLocaleString("en-IN")}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}