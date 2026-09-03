import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function OtpVerify({ onSuccess }) {
  const { sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState("mobile"); // "mobile" | "otp"
  const [mobile, setMobile] = useState("");
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
    if (!validMobile) {
      setError("Enter a valid 10-digit mobile number.");
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
      await verifyOtp(mobile, otp);
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
        <h3>Login / Sign up</h3>
        <p className="otp-sub">We'll send you a one-time code to verify your number.</p>
        <label className="otp-label">Mobile Number</label>
        <div className="otp-input-row">
          <span className="otp-prefix">+91</span>
          <input
            type="tel"
            maxLength={10}
            placeholder="9876543210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
          />
        </div>
        {error && <p className="otp-error">{error}</p>}
        <button className="btn-gold" type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Sending…" : "Send OTP"}
        </button>
      </form>
    );
  }

  return (
    <form className="otp-form" onSubmit={handleVerifyOtp}>
      <h3>Enter OTP</h3>
      <p className="otp-sub">Sent to +91 {mobile}. <button type="button" className="otp-link" onClick={() => setStep("mobile")}>Change</button></p>
      <label className="otp-label">6-digit code</label>
      <input
        type="text"
        maxLength={6}
        placeholder="••••••"
        className="otp-code-input"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
      />
      {error && <p className="otp-error">{error}</p>}
      <button className="btn-gold" type="submit" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Verifying…" : "Verify & Continue"}
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