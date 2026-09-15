import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAdminProducts, deleteProduct } from "../../api/adminProducts";

const PAGE_SIZE = 10;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    listAdminProducts().then((res) => setProducts(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const load = () => {
    setLoading(true);
    listAdminProducts().then((res) => setProducts(res.data)).catch(console.error).finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    load();
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Products</h2>
        <Link to="/admin/products/new" className="admin-btn-primary">+ Add Product</Link>
      </div>

      <input
        className="admin-search-input"
        placeholder="Search products…"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />

      <div className="admin-panel">
        {loading ? <p className="admin-empty-note">Loading…</p> : (
          <>
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Active</th><th>Bestseller</th><th></th></tr></thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.images?.[0] ? (
                        <img src={p.images[0].image} alt={p.name} className="admin-row-thumb" />
                      ) : (
                        <div className="admin-row-thumb admin-row-thumb-empty">—</div>
                      )}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category?.name}</td>
                    <td>₹{p.price}</td>
                    <td className={p.stock_qty <= 5 ? "admin-stock-low" : ""}>{p.stock_qty}</td>
                    <td>{p.is_active ? "✅" : "❌"}</td>
                    <td>{p.is_bestseller ? "⭐" : "—"}</td>
                    <td className="admin-row-actions">
                      <Link to={`/admin/products/${p.id}/edit`} className="admin-icon-btn" title="Edit">✏️</Link>
                      <button className="admin-icon-btn admin-icon-btn-danger" title="Delete" onClick={() => handleDelete(p.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={8} className="admin-empty-note">No products found.</td></tr>
                )}
              </tbody>
            </table>

            <div className="admin-pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>‹ Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next ›</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}