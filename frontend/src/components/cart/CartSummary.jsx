import { Link } from "react-router-dom";

export default function CartSummary({ subtotal, discount, total, itemCount }) {
  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>
      <div className="summary-row">
        <span>Subtotal ({itemCount} items)</span>
        <span>₹{subtotal.toLocaleString("en-IN")}</span>
      </div>
      {discount > 0 && (
        <div className="summary-row discount">
          <span>Discount</span>
          <span>−₹{discount.toLocaleString("en-IN")}</span>
        </div>
      )}
      <div className="summary-row total">
        <span>Total</span>
        <span>₹{total.toLocaleString("en-IN")}</span>
      </div>
      <p className="summary-note">GST calculated at checkout</p>
      <Link to="/checkout" className="btn-gold" style={{ width: "100%", textAlign: "center", display: "block" }}>
        Proceed to Checkout
      </Link>
    </div>
  );
}