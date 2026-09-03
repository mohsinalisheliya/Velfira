import { useNavigate, useSearchParams } from "react-router-dom";
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

  return (
    <div className="section">
      <div className="section-head">
        <div><span className="eyebrow">Welcome back</span><h2>{user.mobile_number}</h2></div>
      </div>
      <div style={{ padding: "0 34px" }}>
        <a href="/account/orders" className="btn-outline" style={{ marginRight: 12 }}>My Orders</a>
        <button className="btn-outline" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}