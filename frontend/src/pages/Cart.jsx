import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import CouponInput from "../components/cart/CouponInput";

export default function Cart() {
  const { cart, updateItem, removeItem, loading } = useCart();
  const { isLoggedIn } = useAuth();
  const [coupon, setCoupon] = useState(null);

  if (!isLoggedIn) {
    return (
      <div className="section">
        <div className="section-head"><h2>Your Cart</h2></div>
        <p style={{ padding: "0 34px" }}>
          <Link to="/account?next=/cart" className="btn-gold">Login to view your cart</Link>
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="section"><p style={{ padding: "0 34px" }}>Loading your cart…</p></div>;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="section">
        <div className="section-head"><h2>Your Cart</h2></div>
        <p style={{ padding: "0 34px", color: "var(--grey)" }}>Your cart is empty.</p>
        <div style={{ padding: "0 34px", marginTop: 16 }}>
          <Link to="/shop" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.variant?.effective_price ?? item.product.price;
    return sum + Number(price) * item.quantity;
  }, 0);
  const discount = coupon?.discount_amount || 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <section className="section">
      <div className="section-head"><h2>Your Cart</h2></div>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQty={updateItem}
              onRemove={removeItem}
            />
          ))}
          <CouponInput subtotal={subtotal} onApplied={setCoupon} />
        </div>
        <CartSummary
          subtotal={subtotal}
          discount={discount}
          total={total}
          itemCount={cart.item_count}
        />
      </div>
    </section>
  );
}