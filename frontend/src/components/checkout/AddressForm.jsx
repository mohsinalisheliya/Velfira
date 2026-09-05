import React from "react";

const INDIA_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function AddressForm({ address, onChange }) {
  const update = (field, value) => onChange({ ...address, [field]: value });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
      
      {/* Full Name */}
      <div>
        <label style={labelStyle}>Full name (First and Last name)</label>
        <input type="text" style={inputStyle} value={address.full_name || ""} onChange={(e) => update("full_name", e.target.value)} required />
      </div>

      {/* Mobile */}
      <div>
        <label style={labelStyle}>Mobile number</label>
        <input type="tel" style={inputStyle} maxLength="10" value={address.mobile_number || ""} onChange={(e) => update("mobile_number", e.target.value.replace(/\D/g, ""))} required />
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--charcoal-soft)" }}>May be used to assist delivery</p>
      </div>

      {/* Pincode */}
      <div>
        <label style={labelStyle}>Pincode</label>
        <input type="text" style={inputStyle} maxLength="6" placeholder="6 digits [0-9] PIN code" value={address.pincode || ""} onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))} required />
      </div>

      {/* Flat / House */}
      <div>
        <label style={labelStyle}>Flat, House no., Building, Company, Apartment</label>
        <input type="text" style={inputStyle} value={address.flat || ""} onChange={(e) => update("flat", e.target.value)} required />
      </div>

      {/* Area / Street */}
      <div>
        <label style={labelStyle}>Area, Street, Sector, Village</label>
        <input type="text" style={inputStyle} value={address.area || ""} onChange={(e) => update("area", e.target.value)} required />
      </div>

      {/* Landmark */}
      <div>
        <label style={labelStyle}>Landmark</label>
        <input type="text" style={inputStyle} placeholder="E.g. near apollo hospital" value={address.landmark || ""} onChange={(e) => update("landmark", e.target.value)} />
      </div>

      {/* City and State Row */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Town/City</label>
          <input type="text" style={inputStyle} value={address.city || ""} onChange={(e) => update("city", e.target.value)} required />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>State</label>
          <select style={inputStyle} value={address.state || ""} onChange={(e) => update("state", e.target.value)} required>
            <option value="" disabled>Choose a state</option>
            {INDIA_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Default Checkbox */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
        <input type="checkbox" id="default-addr" checked={address.is_default || false} onChange={(e) => update("is_default", e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--charcoal)', cursor: 'pointer' }} />
        <label htmlFor="default-addr" style={{ fontSize: '14px', color: 'var(--charcoal)', cursor: 'pointer', fontWeight: '500' }}>Make this my default address</label>
      </div>

    </div>
  );
}

// Inline CSS matching the exact screenshot design
const labelStyle = { display: "block", fontSize: "14px", fontWeight: "700", marginBottom: "6px", color: "#111" };
const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #a6a6a6", borderRadius: "4px", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };