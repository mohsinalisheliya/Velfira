import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listOrders } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

const STATUS_LABELS = {
  placed: "Placed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_ORDER = ["placed", "packed", "shipped", "delivered"];

export default function OrderHistory() {
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

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

  const downloadInvoice = async (orderId, e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <section className="section">
      <div className="section-head">
        <h2>Order History</h2>
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
          {filteredOrders.map((order) => {
            const statusIndex = STATUS_ORDER.indexOf(order.status);
            const isCancelled = order.status === "cancelled";

            return (
              <Link to={`/order-confirmation/${order.id}`} key={order.id} className="order-card">
                <div className="order-card-top">
                  <div>
                    <span className="order-row-id">Order #{order.id}</span>
                    <span className="order-row-date">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <span className={`payment-badge ${order.payment_status === "paid" ? "paid" : "pending"}`}>
                    {order.payment_status === "paid" ? "Paid" : "Payment Pending"}
                  </span>
                </div>

                <div className="order-card-items">
                  {order.items?.slice(0, 3).map((item) => (
                    <div className="order-item-thumb" key={item.id}>
                      <div className="card-gem" style={{ width: 28, height: 28 }}></div>
                    </div>
                  ))}
                  <div className="order-item-names">
                    {order.items?.map((item) => `${item.product_name} ×${item.quantity}`).join(", ")}
                  </div>
                </div>

                {!isCancelled && (
                  <div className="order-progress">
                    {STATUS_ORDER.map((s, i) => (
                      <div key={s} className={`progress-step ${i <= statusIndex ? "done" : ""}`}>
                        <div className="progress-dot"></div>
                        <span>{STATUS_LABELS[s]}</span>
                      </div>
                    ))}
                  </div>
                )}
                {isCancelled && (
                  <div className="order-status-badge status-cancelled" style={{ width: "fit-content" }}>Cancelled</div>
                )}

                <div className="order-card-bottom">
                  <div className="order-address-preview">
                    {order.address ? `${order.address.city}, ${order.address.state} - ${order.address.pincode}` : ""}
                  </div>
                  <div className="order-card-actions">
                    <span className="order-row-total">₹{Number(order.total).toLocaleString("en-IN")}</span>
                    {order.payment_status === "paid" && (
                      <button className="btn-outline order-invoice-btn" onClick={(e) => downloadInvoice(order.id, e)}>
                        Invoice
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}