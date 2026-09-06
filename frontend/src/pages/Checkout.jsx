import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { checkout } from "../api/orders";
import { initiatePayment } from "../api/payments";
// Nayi API call import karo (maan lo tune accounts.js mein banayi hai)
import { listAddresses } from "../api/accounts"; 
import AddressForm from "../components/checkout/AddressForm";
import OtpVerify from "../components/checkout/OtpVerify";

const STEPS = { VERIFY: "verify", ADDRESS: "address", PLACING: "placing" };

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(user?.mobile_verified ? STEPS.ADDRESS : STEPS.VERIFY);
  
  // Address States
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState({ 
    full_name: "", 
    mobile_number: user?.mobile_number || "", // Default pre-fill user ka number
    pincode: "", flat: "", area: "", landmark: "", city: "", state: "", is_default: false 
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch saved addresses when user is logged in and on ADDRESS step
  useEffect(() => {
    if (isLoggedIn && step === STEPS.ADDRESS) {
      setLoading(true);
      listAddresses()
        .then((res) => {
          setSavedAddresses(res.data);
          // Auto-select first address if available
          if (res.data.length > 0) {
            setSelectedAddressId(res.data[0].id);
          } else {
            setIsAddingNew(true); // Default to form if no saved addresses
          }
        })
        .catch((err) => console.error("Failed to load addresses", err))
        .finally(() => setLoading(false));
    }
  }, [isLoggedIn, step]);

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

  // Consider coupon if already applied in cart
  const discount = cart.discount_amount || 0; // Assuming backend sends this if applied
  const finalTotal = Math.max(0, subtotal - discount);

  const addressValid = newAddress.flat && newAddress.area && newAddress.city && newAddress.state && newAddress.pincode.length === 6;
  const handleOtpSuccess = () => {
    setStep(STEPS.ADDRESS);
  };

  const handlePlaceOrder = async () => {
    setError("");
    
    // Determine which address to use
    let payload = {};
    if (!isAddingNew && selectedAddressId) {
      payload = { address_id: selectedAddressId };
    } else if (isAddingNew && addressValid) {
      payload = { new_address: newAddress };
    } else {
      setError("Please select an address or fill in all required fields for a new one.");
      return;
    }

    // Coupon code hataya gaya hai, backend ko cart se handle karna chahiye
    
    setLoading(true);
    setStep(STEPS.PLACING);
    try {
      const { data: order } = await checkout(payload);
      // Mock payment auto-succeeds in dev
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
              <h3 className="checkout-block-title">Step 1   Verify your mobile number</h3>
              <p className="otp-sub">Required before we can place your order.</p>
              <OtpVerify onSuccess={handleOtpSuccess} />
            </div>
          )}
          
          {(step === STEPS.ADDRESS || step === STEPS.PLACING) && (
            <div className="checkout-block">
              <h3 className="checkout-block-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Delivery Address
                {savedAddresses.length > 0 && !isAddingNew && (
                  <button onClick={() => setIsAddingNew(true)} className="btn-outline" style={{ padding: "4px 8px", fontSize: "11px" }}>
                    + ADD NEW
                  </button>
                )}
                {isAddingNew && savedAddresses.length > 0 && (
                   <button onClick={() => setIsAddingNew(false)} className="btn-outline" style={{ padding: "4px 8px", fontSize: "11px", border: "none" }}>
                    Cancel
                  </button>
                )}
              </h3>

              {loading ? (
                 <p>Loading addresses...</p>
              ) : (
                <>
                  {/* Saved Addresses Selection */}
                  {!isAddingNew && savedAddresses.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                      {savedAddresses.map((addr) => (
                        <label 
                          key={addr.id} 
                          style={{ 
                            display: "flex", 
                            alignItems: "flex-start", 
                            gap: "12px", 
                            padding: "16px", 
                            border: selectedAddressId === addr.id ? "2px solid var(--gold)" : "1px solid var(--grey-line)",
                            background: "var(--sand)",
                            cursor: "pointer"
                          }}
                        >
                          <input 
                            type="radio" 
                            name="addressSelection" 
                            checked={selectedAddressId === addr.id} 
                            onChange={() => setSelectedAddressId(addr.id)} 
                            style={{ marginTop: "4px", accentColor: "var(--gold)" }}
                          />
                          <div>
                            <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "var(--charcoal)", fontWeight: "500" }}>
                              {user.first_name} {user.last_name}
                            </p>
                            <p style={{ margin: 0, fontSize: "13px", color: "var(--charcoal-soft)" }}>
                             {addr.flat}, {addr.area} {addr.landmark ? `(Near ${addr.landmark})` : ""}
                            </p>
                            <p style={{ margin: 0, fontSize: "13px", color: "var(--charcoal-soft)" }}>
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* New Address Form */}
                  {(isAddingNew || savedAddresses.length === 0) && (
                    <div style={{ marginTop: "16px" }}>
                      <AddressForm address={newAddress} onChange={setNewAddress} />
                    </div>
                  )}
                </>
              )}

              {error && <p className="otp-error" style={{ marginTop: 14 }}>{error}</p>}
              
              <button
                className="btn-gold"
                style={{ width: "100%", marginTop: 24 }}
                onClick={handlePlaceOrder}
                disabled={loading || step === STEPS.PLACING}
              >
                {step === STEPS.PLACING ? "Placing order..." : "Place Order"}
              </button>
            </div>
          )}
        </div>
        
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.items.map((item) => (
            <div className="checkout-summary-item" key={item.id}>
              <span>{item.product.name} × {item.quantity}</span>
              <span> ₹{(Number(item.variant?.effective_price ?? item.product.price) * item.quantity).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Subtotal</span>
            <span> ₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          {discount > 0 && (
             <div className="summary-row" style={{ color: "var(--gold)" }}>
               <span>Discount</span>
               <span>- ₹{discount.toLocaleString("en-IN")}</span>
             </div>
          )}
           <div className="summary-row total" style={{ borderTop: 'none', paddingTop: 0 }}>
            <span>Final Total</span>
            <span> ₹{finalTotal.toLocaleString("en-IN")}</span>
          </div>
          <p className="summary-note">Final total (incl. GST) confirmed after order is placed.</p>
        </div>
      </div>
    </section>
  );
}