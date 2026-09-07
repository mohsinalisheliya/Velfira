import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listOrders } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axiosClient from "../api/axiosClient";

const STATUS_LABELS = {
  placed: "Order Placed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderHistory() {
  const { isLoggedIn } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [addingId, setAddingId] = useState(null);

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

  const downloadInvoice = async (orderId) => {
    try {
      const res = await axiosClient.get(`/invoices/${orderId}/`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderId}.txt`;
      a.click();
    } catch (err) {
      console.error("Invoice not available yet", err);
    }
  };

  const buyAgain = async (item) => {
    setAddingId(item.id);
    try {
      await addItem(item.product_id, item.quantity);
      navigate("/cart");
    } catch (err) {
      console.error("Buy again failed", err);
    } finally {
      setAddingId(null);
    }
  };

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

  if (loading) return <div className="section"><p style={{ padding: "0 34px" }}>Loading your orders…</p></div>;
  if (error) return <div className="section"><p className="otp-error" style={{ padding: "0 34px" }}>{error}</p></div>;

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

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <section className="section">
      <div className="section-head">
        <h2>Your Orders</h2>
        <div className="order-filter-tabs">
          {["all", "placed", "shipped", "delivered", "cancelled"].map((f) => (
            <button
              key={f}
              className={`order-filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p style={{ padding: "0 34px", color: "var(--grey)" }}>No orders in this status.</p>
      ) : (
        <div className="order-list">
          {filteredOrders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-strip">
                <div className="order-strip-item">
                  <span className="order-strip-label">Order Placed</span>
                  <span>{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <div className="order-strip-item">
                  <span className="order-strip-label">Total</span>
                  <span>₹{Number(order.total).toLocaleString("en-IN")}</span>
                </div>
                <div className="order-strip-item">
                  <span className="order-strip-label">Ship To</span>
                  <span>{order.address ? `${order.address.city}, ${order.address.state}` : "—"}</span>
                </div>
                <div className="order-strip-right">
                  <div className="order-strip-item">
                    <span className="order-strip-label">Order #{order.id}</span>
                    <span className={`payment-badge ${order.payment_status === "paid" ? "paid" : "pending"}`}>
                      {order.payment_status === "paid" ? "Paid" : "Payment Pending"}
                    </span>
                  </div>
                  {order.payment_status === "paid" && (
                    <button className="order-invoice-link" onClick={() => downloadInvoice(order.id)}>
                      Invoice
                    </button>
                  )}
                </div>
              </div>

              <div className="order-status-line">
                {order.status === "cancelled" ? "Order Cancelled" : STATUS_LABELS[order.status]}
              </div>

              {order.items?.map((item) => (
                <div className="order-item-row" key={item.id}>
                  <Link to={`/product/${item.product_slug}`} className="order-item-img">
                    {item.product_image ? (
                      <img src={item.product_image} alt={item.product_name} />
                    ) : (
                      <div className="card-gem" style={{ width: 36, height: 36 }}></div>
                    )}
                  </Link>
                  <div className="order-item-details">
                    <Link to={`/product/${item.product_slug}`} className="order-item-link">
                      {item.product_name}
                    </Link>
                    <span className="order-item-qty">Qty: {item.quantity} · ₹{Number(item.unit_price).toLocaleString("en-IN")} each</span>
                  </div>
                  <div className="order-item-actions">
                    <button
                      className="btn-gold order-action-btn"
                      onClick={() => buyAgain(item)}
                      disabled={addingId === item.id}
                    >
                      {addingId === item.id ? "Adding…" : "Buy It Again"}
                    </button>
                    <Link to={`/product/${item.product_slug}`} className="btn-outline order-action-btn">
                      View Item
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}