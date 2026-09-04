import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OtpVerify from "../components/checkout/OtpVerify";
import { listAddresses, createAddress, updateAddress, deleteAddress } from "../api/accounts";

export default function MyAccount() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // --- UI States ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
  });

  // --- Address States ---
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressForm, setAddressForm] = useState({
    line1: "", line2: "", city: "", state: "", pincode: "", is_default: false
  });

  // 1. DATABASE SE ADDRESS FETCH KARNA
  const fetchAddresses = async () => {
    setAddressLoading(true);
    try {
      const res = await listAddresses();
      setAddresses(res.data);
    } catch (err) {
      console.error("Failed to load addresses", err);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAddresses();
    }
  }, [isLoggedIn]);

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

  const displayName = profileData.firstName || profileData.lastName 
    ? `${profileData.firstName} ${profileData.lastName}`.trim() 
    : user.mobile_number;

  const handleProfileSave = (e) => {
    e.preventDefault();
    alert("Profile update API baki hai. Yeh abhi local save hua hai.");
    setIsEditingProfile(false);
  };

  // 2. DATABASE MEIN NAYA ADDRESS YA EDITED ADDRESS SAVE KARNA
  const handleAddressSave = async (e) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressForm);
      } else {
        await createAddress(addressForm);
      }
      await fetchAddresses(); // Update hone ke baad list ko refresh karo
      cancelAddressEdit();
    } catch (err) {
      console.error("Failed to save address", err);
      alert("Failed to save address. Check console.");
    }
  };

  // 3. DATABASE SE ADDRESS DELETE KARNA
  const handleDeleteAddress = async (id) => {
    if(!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id);
      await fetchAddresses(); // Delete hone ke baad list ko refresh karo
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  const startEditAddress = (addr) => {
    setAddressForm(addr);
    setEditingAddressId(addr.id);
  };

  const cancelAddressEdit = () => {
    setIsAddingAddress(false);
    setEditingAddressId(null);
    setAddressForm({ line1: "", line2: "", city: "", state: "", pincode: "", is_default: false });
  };

  return (
    <div className="section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Welcome back</span>
          <h2>{displayName}</h2>
        </div>
      </div>
      
      <div style={{ padding: "0 34px", marginBottom: "32px" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", maxWidth: "900px", marginBottom: "32px" }}>
          
          {/* --- PROFILE DETAILS SECTION --- */}
          <div style={{ background: "var(--sand)", padding: "24px", border: "1px solid var(--grey-line)", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--gold)", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                Profile Details
              </h3>
              {!isEditingProfile && (
                <button onClick={() => setIsEditingProfile(true)} className="btn-outline" style={{ padding: "4px 10px", fontSize: "11px", border: "none", textDecoration: "underline" }}>
                  Edit
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleProfileSave}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                  <input type="text" placeholder="First Name" value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} style={{ flex: 1, padding: "8px", border: "1px solid var(--grey-line)" }} required />
                  <input type="text" placeholder="Last Name" value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} style={{ flex: 1, padding: "8px", border: "1px solid var(--grey-line)" }} required />
                </div>
                <input type="email" placeholder="Email Address" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} style={{ width: "100%", padding: "8px", border: "1px solid var(--grey-line)", marginBottom: "12px" }} />
                
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" className="btn-gold" style={{ padding: "8px 16px", fontSize: "12px" }}>Save</button>
                  <button type="button" className="btn-outline" onClick={() => setIsEditingProfile(false)} style={{ padding: "8px 16px", fontSize: "12px", border: "none" }}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <p style={{ margin: "10px 0", fontSize: "14.5px", color: "var(--charcoal-soft)" }}>
                  <strong style={{ color: "var(--charcoal)", display: "inline-block", width: "70px" }}>Name:</strong> 
                  {profileData.firstName} {profileData.lastName}
                </p>
                <p style={{ margin: "10px 0", fontSize: "14.5px", color: "var(--charcoal-soft)" }}>
                  <strong style={{ color: "var(--charcoal)", display: "inline-block", width: "70px" }}>Mobile:</strong> 
                  +91 {user.mobile_number} 
                  {user.mobile_verified && (
                    <span style={{ color: "#3A7D44", fontSize: "12px", marginLeft: "10px", fontWeight: "500" }}>✓ Verified</span>
                  )}
                </p>
                <p style={{ margin: "10px 0", fontSize: "14.5px", color: "var(--charcoal-soft)" }}>
                  <strong style={{ color: "var(--charcoal)", display: "inline-block", width: "70px" }}>Email:</strong> 
                  {profileData.email || <span style={{ color: "var(--grey)", fontStyle: "italic" }}>Not provided</span>}
                </p>
              </>
            )}
          </div>

          {/* --- SAVED ADDRESSES SECTION --- */}
          <div style={{ background: "var(--sand)", padding: "24px", border: "1px solid var(--grey-line)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--gold)", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                Saved Addresses
              </h3>
              {(!isAddingAddress && !editingAddressId) && (
                <button onClick={() => setIsAddingAddress(true)} className="btn-outline" style={{ padding: "6px 12px", fontSize: "11px", letterSpacing: "0.5px" }}>
                  + ADD NEW
                </button>
              )}
            </div>
            
            {/* Address Form (Add / Edit) */}
            {(isAddingAddress || editingAddressId) ? (
              <form onSubmit={handleAddressSave} style={{ borderTop: "1px solid var(--grey-line)", paddingTop: "16px" }}>
                <input type="text" placeholder="Address Line 1" value={addressForm.line1} onChange={e => setAddressForm({...addressForm, line1: e.target.value})} required style={{ width: "100%", padding: "8px", border: "1px solid var(--grey-line)", marginBottom: "10px" }} />
                <input type="text" placeholder="Landmark / Line 2 (Optional)" value={addressForm.line2} onChange={e => setAddressForm({...addressForm, line2: e.target.value})} style={{ width: "100%", padding: "8px", border: "1px solid var(--grey-line)", marginBottom: "10px" }} />
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <input type="text" placeholder="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} required style={{ flex: 1, padding: "8px", border: "1px solid var(--grey-line)" }} />
                  <input type="text" placeholder="Pincode" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value.replace(/\D/g, "")})} maxLength="6" required style={{ width: "100px", padding: "8px", border: "1px solid var(--grey-line)" }} />
                </div>
                <input type="text" placeholder="State" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} required style={{ width: "100%", padding: "8px", border: "1px solid var(--grey-line)", marginBottom: "16px" }} />
                
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" className="btn-gold" style={{ padding: "8px 16px", fontSize: "12px" }}>Save Address</button>
                  <button type="button" className="btn-outline" onClick={cancelAddressEdit} style={{ padding: "8px 16px", fontSize: "12px", border: "none" }}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                {/* List of Saved Addresses */}
                {addressLoading ? (
                  <p style={{ fontSize: "13.5px", color: "var(--grey)", margin: 0, textAlign: "center" }}>Loading...</p>
                ) : addresses.length === 0 ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--grey-line)", padding: "20px", textAlign: "center" }}>
                    <p style={{ fontSize: "13.5px", color: "var(--grey)", margin: 0 }}>
                      No saved addresses yet.<br/>
                      Add one for faster checkout.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {addresses.map(addr => (
                      <div key={addr.id} style={{ borderBottom: "1px solid var(--grey-line)", paddingBottom: "16px" }}>
                        <p style={{ fontSize: "14px", color: "var(--charcoal)", marginBottom: "4px", fontWeight: "500" }}>
                          {addr.line1} {addr.line2 ? `, ${addr.line2}` : ""}
                        </p>
                        <p style={{ fontSize: "13px", color: "var(--charcoal-soft)", marginBottom: "8px" }}>
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <button onClick={() => startEditAddress(addr)} className="btn-outline" style={{ padding: "0", border: "none", fontSize: "12px", color: "var(--gold)", textDecoration: "underline", marginRight: "12px" }}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="btn-outline" style={{ padding: "0", border: "none", fontSize: "12px", color: "red", textDecoration: "underline" }}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/account/orders" className="btn-gold">View Order History</Link>
          <button className="btn-outline" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}