import { useEffect, useState } from "react";
import { listCoupons, createCoupon, deleteCoupon } from "../../api/adminExtras";

export default function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", discount_type: "percent", value: "", min_order_value: 0, valid_from: "", valid_to: "", usage_limit: 0, is_active: true });

  const load = () => listCoupons().then((res) => setCoupons(res.data)).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCoupon(form);
    setShowForm(false);
    setForm({ code: "", discount_type: "percent", value: "", min_order_value: 0, valid_from: "", valid_to: "", usage_limit: 0, is_active: true });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete coupon?")) return;
    await deleteCoupon(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Coupons</h2>
        <button className="admin-btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ Add Coupon"}</button>
      </div>

      {showForm && (
        <form className="admin-panel admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-row"><label>Code</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required /></div>
            <div className="admin-form-row"><label>Type</label>
              <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}>
                <option value="percent">Percent</option><option value="flat">Flat</option>
              </select>
            </div>
            <div className="admin-form-row"><label>Value</label><input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required /></div>
            <div className="admin-form-row"><label>Min Order (₹)</label><input type="number" value={form.min_order_value} onChange={(e) => setForm({ ...form, min_order_value: e.target.value })} /></div>
            <div className="admin-form-row"><label>Valid From</label><input type="datetime-local" value={form.valid_from} onChange={(e) => setForm({ ...form, valid_from: e.target.value })} required /></div>
            <div className="admin-form-row"><label>Valid To</label><input type="datetime-local" value={form.valid_to} onChange={(e) => setForm({ ...form, valid_to: e.target.value })} required /></div>
            <div className="admin-form-row"><label>Usage Limit (0=unlimited)</label><input type="number" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} /></div>
          </div>
          <button className="admin-btn-primary" type="submit">Save Coupon</button>
        </form>
      )}

      <div className="admin-panel">
        <table className="admin-table">
          <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Used</th><th>Active</th><th></th></tr></thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.discount_type}</td>
                <td>{c.value}</td>
                <td>{c.times_used}{c.usage_limit > 0 ? `/${c.usage_limit}` : ""}</td>
                <td>{c.is_active ? "✅" : "❌"}</td>
                <td><button className="admin-link-danger" onClick={() => handleDelete(c.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}