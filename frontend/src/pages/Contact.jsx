import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="section">
      <div className="section-head"><h2>Contact Us</h2></div>
      <div className="contact-layout">
        <div className="contact-info">
          <div className="contact-info-block">
            <h5>Customer Support</h5>
            <p>support@velfira.com</p>
            <p>+91 98765 43210</p>
            <p>Mon–Sat, 10am–7pm IST</p>
          </div>
          <div className="contact-info-block">
            <h5>Grievance Officer</h5>
            <p>Mohsinali Sheliya</p>
            <p>grievance@velfira.com</p>
          </div>
          <div className="contact-info-block">
            <h5>Registered Office</h5>
            <p>Velfira, Ahmedabad, Gujarat, India</p>
            <p>GSTIN: 24XXXXX1234X1ZX</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {sent ? (
            <p className="contact-success">Thanks — we'll get back to you within 24 hours.</p>
          ) : (
            <>
              <div className="form-row">
                <label>Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Message</label>
                <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <button className="btn-gold" type="submit" style={{ width: "100%" }}>Send Message</button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}