import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OtpVerify from "../components/checkout/OtpVerify";

export default function MyAccount() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLoginSuccess = () => {
    const next = searchParams.get("next");
    navigate(next || "/account/orders");
  };

  if (!isLoggedIn) {
    return (
      <div className="section">
        <div className="account-panel">
          <OtpVerify onSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  // Format the display name (Fallback to mobile if name is missing)
  const displayName = user.first_name || user.last_name 
    ? `${user.first_name} ${user.last_name}`.trim() 
    : user.mobile_number;

  return (
    <div className="section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Welcome back</span>
          <h2>{displayName}</h2>
        </div>
      </div>
      
      <div style={{ padding: "0 34px", marginBottom: "32px" }}>
        {/* Profile Details Box */}
        <div style={{ background: "var(--sand)", padding: "24px", border: "1px solid var(--grey-line)", maxWidth: "500px", marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px", fontSize: "16px", color: "var(--gold)", textTransform: "uppercase", letterSpacing: "1px" }}>
            Profile Details
          </h3>
          
          <p style={{ margin: "10px 0", fontSize: "14.5px", color: "var(--charcoal-soft)" }}>
            <strong style={{ color: "var(--charcoal)", display: "inline-block", width: "80px" }}>Name:</strong> 
            {user.first_name} {user.last_name}
          </p>
          
          <p style={{ margin: "10px 0", fontSize: "14.5px", color: "var(--charcoal-soft)" }}>
            <strong style={{ color: "var(--charcoal)", display: "inline-block", width: "80px" }}>Mobile:</strong> 
            +91 {user.mobile_number} 
            {user.mobile_verified && (
              <span style={{ color: "#3A7D44", fontSize: "12px", marginLeft: "10px", fontWeight: "500" }}>✓ Verified</span>
            )}
          </p>
          
          <p style={{ margin: "10px 0", fontSize: "14.5px", color: "var(--charcoal-soft)" }}>
            <strong style={{ color: "var(--charcoal)", display: "inline-block", width: "80px" }}>Email:</strong> 
            {user.email || <span style={{ color: "var(--grey)", fontStyle: "italic" }}>Not provided</span>}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/account/orders" className="btn-outline">My Orders</Link>
          <button className="btn-outline" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}