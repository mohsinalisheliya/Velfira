import { useEffect, useState } from "react";
import { listBannersAdmin, createBanner, updateBanner, deleteBanner } from "../../api/adminExtras";

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: "", link_url: "", position: "homepage_hero", is_active: true });

  const load = () => listBannersAdmin().then((res) => setBanners(res.data)).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("image", file);
    await createBanner(fd);
    setShowForm(false);
    setFile(null);
    load();
  };

  const toggleActive = async (b) => { await updateBanner(b.id, { is_active: !b.is_active }); load(); };
  const handleDelete = async (id) => { if (!confirm("Delete banner?")) return; await deleteBanner(id); load(); };

  return (
    <div>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Banners</h2>
        <button className="admin-btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ Add Banner"}</button>
      </div>

      {showForm && (
        <form className="admin-panel admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-row"><label>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="admin-form-row"><label>Image</label><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required /></div>
          <div className="admin-form-row"><label>Link URL</label><input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} /></div>
          <div className="admin-form-row"><label>Position</label>
            <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>
              <option value="homepage_hero">Homepage Hero</option>
              <option value="homepage_strip">Homepage Strip</option>
            </select>
          </div>
          <button className="admin-btn-primary" type="submit">Save Banner</button>
        </form>
      )}

      <div className="admin-media-grid">
        {banners.map((b) => (
          <div key={b.id} className="admin-panel" style={{ width: 200 }}>
            <img src={b.image} alt="" style={{ width: "100%", borderRadius: 6, marginBottom: 8 }} />
            <p style={{ fontSize: 12, marginBottom: 6 }}>{b.title || "Untitled"} · {b.position}</p>
            <button className="admin-link" onClick={() => toggleActive(b)}>{b.is_active ? "Deactivate" : "Activate"}</button>
            {" · "}
            <button className="admin-link-danger" onClick={() => handleDelete(b.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}                       