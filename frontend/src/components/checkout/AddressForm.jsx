export default function AddressForm({ address, onChange }) {
  const update = (field, value) => onChange({ ...address, [field]: value });

  return (
    <div className="address-form">
      <div className="form-row">
        <label>Address Line 1</label>
        <input
          type="text"
          placeholder="House no, street, area"
          value={address.line1}
          onChange={(e) => update("line1", e.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <label>Address Line 2 (optional)</label>
        <input
          type="text"
          placeholder="Landmark, apartment"
          value={address.line2}
          onChange={(e) => update("line2", e.target.value)}
        />
      </div>
      <div className="form-row-split">
        <div className="form-row">
          <label>City</label>
          <input type="text" value={address.city} onChange={(e) => update("city", e.target.value)} required />
        </div>
        <div className="form-row">
          <label>State</label>
          <input type="text" value={address.state} onChange={(e) => update("state", e.target.value)} required />
        </div>
      </div>
      <div className="form-row">
        <label>Pincode</label>
        <input
          type="text"
          maxLength={6}
          value={address.pincode}
          onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))}
          required
        />
      </div>
    </div>
  );
}