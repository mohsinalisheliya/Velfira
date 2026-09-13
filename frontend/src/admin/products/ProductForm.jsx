import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAdminProduct,
  createProduct,
  updateProduct,
  listAdminCategories,
  uploadProductMedia,
  deleteProductImage,
  deleteProductVideo,
} from "../../api/adminProducts";

const GST_RATES = [3, 5, 12, 18];

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", category: "", description: "", price: "",
    hsn_code: "", gst_rate: 3, stock_qty: 0, is_active: true, is_bestseller: false,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listAdminCategories().then((res) => setCategories(res.data)).catch(console.error);
    if (isEdit) {
      getAdminProduct(id).then((res) => {
        const p = res.data;
        setExistingImages(p.images || []);
        setExistingVideos(p.videos || []);
        setForm({
          name: p.name, slug: p.slug, category: p.category?.id || "", description: p.description || "",
          price: p.price, hsn_code: p.hsn_code, gst_rate: p.gst_rate, stock_qty: p.stock_qty,
          is_active: p.is_active, is_bestseller: p.is_bestseller,
        });
      }).catch(console.error);
    }
  }, [id]);

  const update = (field, value) => setForm({ ...form, [field]: value });

  const autoSlug = (name) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, category: Number(form.category), price: String(form.price), gst_rate: String(form.gst_rate) };
      let savedId = id;
      if (isEdit) await updateProduct(id, payload);
      else savedId = (await createProduct(payload)).data.id;
      if (newImages.length || newVideos.length) {
        await uploadProductMedia(savedId, newImages, newVideos);
      }
      navigate("/admin/products");
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      setError(JSON.stringify(err.response?.data || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="admin-page-title">{isEdit ? "Edit Product" : "Add Product"}</h2>
      <form className="admin-panel admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-row">
          <label>Name</label>
          <input value={form.name} onChange={(e) => {
            const val = e.target.value;
            setForm((prev) => ({ ...prev, name: val, slug: !isEdit ? autoSlug(val) : prev.slug }));
          }} required />
        </div>
        <div className="admin-form-row">
          <label>Slug</label>
          <input value={form.slug} onChange={(e) => update("slug", e.target.value)} required />
        </div>
        <div className="admin-form-row">
          <label>Category</label>
          <select value={form.category} onChange={(e) => update("category", e.target.value)} required>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="admin-form-row">
          <label>Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-row">
            <label>Price (₹)</label>
            <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} required />
          </div>
          <div className="admin-form-row">
            <label>HSN Code</label>
            <input value={form.hsn_code} onChange={(e) => update("hsn_code", e.target.value)} required />
          </div>
          <div className="admin-form-row">
            <label>GST Rate</label>
            <select value={form.gst_rate} onChange={(e) => update("gst_rate", e.target.value)}>
              {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
            </select>
          </div>
          <div className="admin-form-row">
            <label>Stock Qty</label>
            <input type="number" value={form.stock_qty} onChange={(e) => update("stock_qty", e.target.value)} required />
          </div>
        </div>
        <div className="admin-checkbox-row">
          <label><input type="checkbox" checked={form.is_active} onChange={(e) => update("is_active", e.target.checked)} /> Active</label>
          <label><input type="checkbox" checked={form.is_bestseller} onChange={(e) => update("is_bestseller", e.target.checked)} /> Bestseller</label>
        </div>
        {isEdit && (
          <div className="admin-form-row">
            <label>Existing Images</label>
            <div className="admin-media-grid">
              {existingImages.map((img) => (
                <div key={img.id} className="admin-media-thumb">
                  <img src={img.image} alt="" />
                  <button type="button" onClick={async () => { await deleteProductImage(id, img.id); setExistingImages(existingImages.filter((i) => i.id !== img.id)); }}>×</button>
                </div>
              ))}
            </div>

            <label>Existing Videos</label>
            <div className="admin-media-grid">
              {existingVideos.map((v) => (
                <div key={v.id} className="admin-media-thumb">
                  <video src={v.video} muted />
                  <button type="button" onClick={async () => { await deleteProductVideo(id, v.id); setExistingVideos(existingVideos.filter((x) => x.id !== v.id)); }}>×</button>
                </div>
              ))}
            </div>

            <label>Add New Images</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setNewImages([...e.target.files])} />
            <label>Add New Videos</label>
            <input type="file" accept="video/*" multiple onChange={(e) => setNewVideos([...e.target.files])} />
            <button
              type="button"
              className="admin-btn-primary"
              disabled={uploading}
              onClick={async () => {
                setUploading(true);
                try {
                  await uploadProductMedia(id, newImages, newVideos);
                  location.reload();
                } finally {
                  setUploading(false);
                }
              }}
            >
              {uploading ? "Uploading…" : "Upload Media"}
            </button>
          </div>
        )}
        {error && <p className="otp-error">{error}</p>}
        <button className="admin-btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Product"}</button>
      </form>
    </div>
  );
}