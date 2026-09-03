import { useState } from "react";
import { applyCoupon } from "../../api/coupons";

export default function CouponInput({ subtotal, onApplied }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(null); // { ok, message }
  const [loading, setLoading] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setStatus(null);
    try {
      const { data } = await applyCoupon(code.trim().toUpperCase(), subtotal);
      setStatus({ ok: true, message: `Coupon applied — ₹${data.discount_amount} off` });
      onApplied({ code: data.code, discount_amount: data.discount_amount });
    } catch (err) {
      setStatus({ ok: false, message: err.response?.data?.detail || "Invalid coupon." });
      onApplied(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="coupon-form" onSubmit={handleApply}>
      <div className="coupon-input-row">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-outline">
          {loading ? "Applying…" : "Apply"}
        </button>
      </div>
      {status && (
        <p className={`coupon-status ${status.ok ? "ok" : "error"}`}>{status.message}</p>
      )}
    </form>
  );
}