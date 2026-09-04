import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { checkout } from "../api/orders";
import { initiatePayment } from "../api/payments";
import AddressForm from "../components/checkout/AddressForm";
import OtpVerify from "../components/checkout/OtpVerify";

const STEPS = { ADDRESS: "address", VERIFY: "verify", PLACING: "placing" };

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(user?.mobile_verified ? STEPS.ADDRESS : STEPS.VERIFY);
  const [address, setAddress] = useState({ line1: "", line2: "", city: "", state: "", pincode: "" });
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="section">
        <div className="section-head"><h2>Checkout</h2></div>
        <p style={{ padding: "0 34px" }}>
          <a href="/account?next=/checkout" className="btn-gold">Login to continue</a>
        </p>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="section">
        <div className="section-head"><h2>Checkout</h2></div>
        <p style={{ padding: "0 34px", color: "var(--grey)" }}>Your cart is empty.</p>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.variant?.effective_price ?? item.product.price;
    return sum + Number(price) * item.quantity;
  }, 0);

  const addressValid = address.line1 && address.city && address.state && address.pincode.length === 6;

  const handleOtpSuccess = () => {
    // mobile is now verified (AuthContext updated user internally) — move to address step
    setStep(STEPS.ADDRESS);
  };

  const handlePlaceOrder = async () => {
    setError("");
    if (!addressValid) {
      setError("Please fill in all required address fields.");
      return;
    }
    setLoading(true);
    setStep(STEPS.PLACING);
    try {
      const payload = { new_address: address };
      if (couponCode.trim()) payload.coupon_code = couponCode.trim().toUpperCase();

      const { data: order } = await checkout(payload);

      // Mock payment — auto-succeeds in dev
      const { data: paymentResult } = await initiatePayment(order.id);

      await refreshCart();
      navigate(`/order-confirmation/${order.id}`, { state: { invoiceNumber: paymentResult.invoice_number } });
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong placing your order.");
      setStep(STEPS.ADDRESS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="section-head"><h2>Checkout</h2></div>

      <div className="checkout-layout">
        <div className="checkout-main">
          {step === STEPS.VERIFY && (
            <div className="checkout-block">
              <h3 className="checkout-block-title">Step 1 — Verify your mobile number</h3>
              <p className="otp-sub">Required before we can place your order.</p>
              <OtpVerify onSuccess={handleOtpSuccess} />
            </div>
          )}

          {(step === STEPS.ADDRESS || step === STEPS.PLACING) && (
            <div className="checkout-block">
              <h3 className="checkout-block-title">Delivery Address</h3>
              <AddressForm address={address} onChange={setAddress} />

              <h3 className="checkout-block-title" style={{ marginTop: 28 }}>Coupon (optional)</h3>
              <input
                type="text"
                className="checkout-coupon-input"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />

              {error && <p className="otp-error" style={{ marginTop: 14 }}>{error}</p>}

              <button
                className="btn-gold"
                style={{ width: "100%", marginTop: 20 }}
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? "Placing order…" : "Place Order"}
              </button>
            </div>
          )}
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.items.map((item) => (
            <div className="checkout-summary-item" key={item.id}>
              <span>{item.product.name} × {item.quantity}</span>
              <span>₹{(Number(item.variant?.effective_price ?? item.product.price) * item.quantity).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <p className="summary-note">Final total (incl. GST, discount) confirmed after order is placed.</p>
        </div>
      </div>
    </section>
  );
}