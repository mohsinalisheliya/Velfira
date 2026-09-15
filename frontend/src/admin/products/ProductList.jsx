import React from 'react';
import './admin-products.css'; // Import the new stylesheet

export default function ProductList() {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Product Catalog</h1>
        <button className="btn-primary">+ Add New Product</button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="product-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price (inc. GST)</th>
              <th>Stock</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                  <img src="/placeholder.jpg" alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                </div>
                <strong>24k Gold Chain</strong>
              </td>
              <td style={{ color: 'var(--warm-grey)' }}>Necklaces</td>
              <td>₹45,000</td>
              <td>
                <span style={{ padding: '4px 8px', backgroundColor: '#e6f4ea', color: '#137333', borderRadius: '4px', fontSize: '12px' }}>
                  In Stock (12)
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <button style={{ color: 'var(--gold-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}