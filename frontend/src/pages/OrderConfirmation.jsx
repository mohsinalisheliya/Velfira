import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { getOrder } from "../api/orders";
import axiosClient from "../api/axiosClient";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(orderId)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error("Failed to load order", err))
      .finally(() => setLoading(false));
  }, [orderId]);

  const downloadInvoice = async () => {
    const res = await axiosClient.get(`/invoices/${orderId}/`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${orderId}.txt`;
    a.click();
  };

  if (loading) return <div className="section"><p style={{ padding: "0 34px" }}>Loading…</p></div>;
  if (!order) return <div className="section"><p style={{ padding: "0 34px" }}>Order not found.</p></div>;

  return (
    <section className="section" style={{ textAlign: "center" }}>
      <div className="order-confirm-icon">✓</div>
      <h2 style={{ marginBottom: 8 }}>Order Confirmed!</h2>
      <p style={{ color: "var(--grey)", marginBottom: 24 }}>
        Order #{order.id} · {order.status.toUpperCase()} · Total ₹{Number(order.total).toLocaleString("en-IN")}
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn-gold" onClick={downloadInvoice}>Download Invoice</button>
        <Link to="/shop" className="btn-outline">Continue Shopping</Link>
      </div>
    </section>
  );
}