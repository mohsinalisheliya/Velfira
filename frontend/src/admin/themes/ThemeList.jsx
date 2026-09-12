import { useEffect, useState } from "react";
import { listThemesAdmin, createTheme, activateTheme, deleteTheme } from "../../api/adminExtras";

export default function ThemeList() {
  const [themes, setThemes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", primary_color: "#B08D3E", accent_color: "#D4AF37", background_color: "#FDFBF7", font_pair: "Playfair Display, Inter" });

  const load = () => listThemesAdmin().then((res) => setThemes(res.data)).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTheme(form);
      setShowForm(false);
      load();
    } catch (err) {
      alert(JSON.stringify(err.response?.data));
    }
  };

  const handleActivate = async (id) => { await activateTheme(id); load(); };
  const handleDelete = async (id) => { if (!confirm("Delete theme?")) return; await deleteTheme(id); load(); };

  return (
    <div>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Themes</h2>
        <button className="admin-btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ Add Theme"}</button>
      </div>

      {showForm && (
        <form className="admin-panel admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-row"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="admin-form-row"><label>Primary Color</label><input type="color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} /></div>
            <div className="admin-form-row"><label>Accent Color</label><input type="color" value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} /></div>
            <div className="admin-form-row"><label>Background</label><input type="color" value={form.background_color} onChange={(e) => setForm({ ...form, background_color: e.target.value })} /></div>
          </div>
          <button className="admin-btn-primary" type="submit">Save Theme</button>
        </form>
      )}

      <div className="admin-panel">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Preview</th><th>Active</th><th></th></tr></thead>
          <tbody>
            {themes.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>
                  <span style={{ display: "inline-block", width: 20, height: 20, background: t.primary_color, borderRadius: 4, marginRight: 4 }}></span>
                  <span style={{ display: "inline-block", width: 20, height: 20, background: t.accent_color, borderRadius: 4 }}></span>
                </td>
                <td>{t.is_active ? "✅ Active" : "—"}</td>
                <td>
                  {!t.is_active && <button className="admin-link" onClick={() => handleActivate(t.id)}>Activate</button>}
                  {" · "}
                  <button className="admin-link-danger" onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}