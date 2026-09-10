import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAdminProducts, deleteProduct } from "../../api/adminProducts";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    listAdminProducts().then((res) => setProducts(res.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Products</h2>
        <Link to="/admin/products/new" className="admin-btn-primary">+ Add Product</Link>
      </div>
      <div className="admin-panel">
        {loading ? <p className="admin-empty-note">Loading…</p> : (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Active</th><th></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category?.name}</td>
                  <td>₹{p.price}</td>
                  <td className={p.stock_qty <= 5 ? "admin-stock-low" : ""}>{p.stock_qty}</td>
                  <td>{p.is_active ? "✅" : "❌"}</td>
                  <td>
                    <Link to={`/admin/products/${p.id}/edit`} className="admin-link">Edit</Link>
                    {" · "}
                    <button className="admin-link-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}