import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/admin";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await adminLogin(username, password);
      localStorage.setItem("velfira_admin_access", data.access);
      localStorage.setItem("velfira_admin_refresh", data.refresh);
      localStorage.setItem("velfira_admin_username", data.username);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <img src="/logo-full.png" alt="Velfira" style={{ height: 40, margin: "0 auto 20px", display: "block" }} />
        <h2>Admin Login</h2>
        <div className="form-row">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="otp-error">{error}</p>}
        <button className="btn-gold" type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}