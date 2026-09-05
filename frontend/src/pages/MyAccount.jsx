import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OtpVerify from "../components/checkout/OtpVerify";
import { listAddresses, createAddress, updateAddress, deleteAddress, updateProfile } from "../api/accounts";
import AddressForm from "../components/checkout/AddressForm";

export default function MyAccount() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
  });

  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  
  // Updated Initial State for New Fields
  const [addressForm, setAddressForm] = useState({
    full_name: "", mobile_number: user?.mobile_number || "", pincode: "", flat: "", area: "", landmark: "", city: "", state: "", is_default: false
  });

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

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email
      };
      const res = await updateProfile(payload);
      const currentUser = JSON.parse(localStorage.getItem("velfira_user") || "{}");
      const updatedUser = { ...currentUser, ...res.data };
      localStorage.setItem("velfira_user", JSON.stringify(updatedUser));
      setIsEditingProfile(false);
      window.location.reload();
    } catch (err) {
      console.error("Profile update failed", err);
      alert("Failed to update profile. Check console.");
    }
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressForm);
      } else {
        await createAddress(addressForm);
      }
      await fetchAddresses();
      cancelAddressEdit();
    } catch (err) {
      console.error("Failed to save address", err);
      alert("Failed to save address. Check console.");
    }
  };

  const handleDeleteAddress = async (id) => {
    if(!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id);
      await fetchAddresses();
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
    setAddressForm({ full_name: "", mobile_number: user?.mobile_number || "", pincode: "", flat: "", area: "", landmark: "", city: "", state: "", is_default: false });
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
          
          {/* PROFILE SECTION */}
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
                  {user.mobile_verified && <span style={{ color: "#3A7D44", fontSize: "12px", marginLeft: "10px", fontWeight: "500" }}>✓ Verified</span>}
                </p>
                <p style={{ margin: "10px 0", fontSize: "14.5px", color: "var(--charcoal-soft)" }}>
                  <strong style={{ color: "var(--charcoal)", display: "inline-block", width: "70px" }}>Email:</strong> 
                  {profileData.email || <span style={{ color: "var(--grey)", fontStyle: "italic" }}>Not provided</span>}
                </p>
              </>
            )}
          </div>

          {/* ADDRESS SECTION */}
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
            
            {(isAddingAddress || editingAddressId) ? (
              <form onSubmit={handleAddressSave} style={{ borderTop: "1px solid var(--grey-line)", paddingTop: "16px" }}>
                <AddressForm address={addressForm} onChange={setAddressForm} />
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button type="submit" className="btn-gold" style={{ padding: "8px 16px", fontSize: "12px" }}>Save Address</button>
                  <button type="button" className="btn-outline" onClick={cancelAddressEdit} style={{ padding: "8px 16px", fontSize: "12px", border: "none" }}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                {addressLoading ? (
                  <p style={{ fontSize: "13.5px", color: "var(--grey)", margin: 0, textAlign: "center" }}>Loading...</p>
                ) : addresses.length === 0 ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--grey-line)", padding: "20px", textAlign: "center" }}>
                    <p style={{ fontSize: "13.5px", color: "var(--grey)", margin: 0 }}>
                      No saved addresses yet.<br/>Add one for faster checkout.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {addresses.map(addr => (
                      <div key={addr.id} style={{ borderBottom: "1px solid var(--grey-line)", paddingBottom: "16px", position: "relative" }}>
                        {addr.is_default && (
                           <span style={{ position: "absolute", top: 0, right: 0, background: "var(--ivory)", border: "1px solid var(--gold)", color: "var(--gold)", fontSize: "10px", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>DEFAULT</span>
                        )}
                        <p style={{ fontSize: "14.5px", color: "var(--charcoal)", marginBottom: "4px", fontWeight: "600" }}>
                          {addr.full_name} <span style={{fontWeight: "500", marginLeft: "12px", color: "var(--charcoal-soft)"}}>{addr.mobile_number}</span>
                        </p>
                        <p style={{ margin: 0, fontSize: "13.5px", color: "var(--charcoal-soft)", lineHeight: "1.6", marginBottom: "8px" }}>
                          {addr.flat}, {addr.area}
                          <br/>
                          {addr.landmark ? `${addr.landmark}, ` : ""}
                          {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
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

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/account/orders" className="btn-gold">View Order History</Link>
          <button className="btn-outline" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}