import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function OtpVerify({ onSuccess }) {
  const { sendOtp, verifyOtp } = useAuth();
  
  const [step, setStep] = useState("mobile"); // "mobile" | "otp"
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"
  
  const [mobile, setMobile] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const validMobile = /^[6-9]\d{9}$/.test(mobile);

  const startResendTimer = () => {
    setResendIn(30);
    const interval = setInterval(() => {
      setResendIn((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    // Basic Validation
    if (!validMobile) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    
    // Name validation only if user is signing up
    if (authMode === "signup" && (!firstName.trim() || !lastName.trim())) {
      setError("First Name and Last Name are compulsory for new accounts.");
      return;
    }

    setLoading(true);
    try {
      await sendOtp(mobile);
      setStep("otp");
      startResendTimer();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    
    setLoading(true);
    try {
      // Pass profile fields ONLY if it's a signup, otherwise pass empty object
      const profileData = authMode === "signup" 
        ? { first_name: firstName, last_name: lastName, email: email } 
        : {};
        
      await verifyOtp(mobile, otp, profileData);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || "Incorrect OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "mobile") {
    return (
      <form className="otp-form" onSubmit={handleSendOtp}>
        
        {/* Auth Mode Toggle Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--grey-line)", marginBottom: "20px" }}>
          <button
            type="button"
            onClick={() => { setAuthMode("login"); setError(""); }}
            style={{
              flex: 1, padding: "12px 0", background: "none", border: "none", cursor: "pointer",
              fontWeight: authMode === "login" ? "600" : "400",
              color: authMode === "login" ? "var(--charcoal)" : "var(--grey)",
              borderBottom: authMode === "login" ? "2px solid var(--gold)" : "2px solid transparent",
              transition: "all 0.2s"
            }}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode("signup"); setError(""); }}
            style={{
              flex: 1, padding: "12px 0", background: "none", border: "none", cursor: "pointer",
              fontWeight: authMode === "signup" ? "600" : "400",
              color: authMode === "signup" ? "var(--charcoal)" : "var(--grey)",
              borderBottom: authMode === "signup" ? "2px solid var(--gold)" : "2px solid transparent",
              transition: "all 0.2s"
            }}
          >
            SIGN UP
          </button>
        </div>

        <p className="otp-sub">
          {authMode === "login" ? "Welcome back! Enter your mobile number." : "Create a new Velfira account."}
        </p>
        
        {/* Render Name & Email ONLY for Sign Up Mode */}
        {authMode === "signup" && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                  <label className="otp-label">First Name *</label>
                  <div className="otp-input-row">
                    <input 
                      type="text" 
                      placeholder="John" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      required={authMode === "signup"}
                    />
                  </div>
              </div>
              <div style={{ flex: 1 }}>
                  <label className="otp-label">Last Name *</label>
                  <div className="otp-input-row">
                    <input 
                      type="text" 
                      placeholder="Doe" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      required={authMode === "signup"}
                    />
                  </div>
              </div>
            </div>

            <label className="otp-label">Email (Optional)</label>
            <div className="otp-input-row">
              <input 
                type="email" 
                placeholder="john@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          </>
        )}

        {/* Mobile Number Field (Common for both) */}
        <label className="otp-label">Mobile Number *</label>
        <div className="otp-input-row">
          <span className="otp-prefix">+91</span>
          <input
            type="tel"
            maxLength={10}
            placeholder="9876543210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            required
          />
        </div>

        {error && <p className="otp-error">{error}</p>}
        
        <button className="btn-gold" type="submit" disabled={loading} style={{ width: "100%", marginTop: "8px" }}>
          {loading ? "Sending OTP..." : "Get OTP"}
        </button>
      </form>
    );
  }

  // OTP Verification Step
  return (
    <form className="otp-form" onSubmit={handleVerifyOtp}>
      <h3>Enter OTP</h3>
      <p className="otp-sub">Sent to +91 {mobile}. <button type="button" className="otp-link" onClick={() => setStep("mobile")}>Change</button></p>
      
      <label className="otp-label">6-digit code</label>
      <input
        type="text"
        maxLength={6}
        placeholder="------"
        className="otp-code-input"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
      />
      
      {error && <p className="otp-error">{error}</p>}
      
      <button className="btn-gold" type="submit" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Verifying..." : "Verify & Continue"}
      </button>
      
      <button
        type="button"
        className="otp-link"
        disabled={resendIn > 0}
        onClick={handleSendOtp}
        style={{ marginTop: 14 }}
      >
        {resendIn > 0 ? `Resend OTP in ${resendIn}s` : "Resend OTP"}
      </button>
    </form>
  );
}