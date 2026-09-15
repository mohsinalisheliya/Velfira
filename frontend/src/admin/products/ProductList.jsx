import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample data structure matching Velfira schema
  const [products] = useState([
    {
      id: 1,
      name: 'Aethelgard Diamond Solitaire Ring',
      sku: 'VEL-RNG-001',
      category: 'Rings',
      price: 125000,
      gst_rate: 3,
      stock_qty: 8,
      is_active: true,
      variants_count: 3,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 2,
      name: 'Aurelia 22K Handcrafted Temple Choker',
      sku: 'VEL-NCK-042',
      category: 'Necklaces',
      price: 285000,
      gst_rate: 3,
      stock_qty: 2,
      is_active: true,
      variants_count: 2,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 3,
      name: 'Elysian Rose Gold Pearl Drops',
      sku: 'VEL-EAR-108',
      category: 'Earrings',
      price: 42000,
      gst_rate: 3,
      stock_qty: 0,
      is_active: false,
      variants_count: 4,
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=150&q=80'
    }
  ]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-10 font-sans text-[#2B2B2B]">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E5E0D8]">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#B08D3E] font-semibold">Catalog Management</span>
          <h1 className="text-3xl lg:text-4xl font-serif text-[#1F1D1B] mt-1">Products & Pieces</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/categories"
            className="px-5 py-2.5 rounded-lg border border-[#D5CFC4] text-xs font-semibold uppercase tracking-wider text-[#1F1D1B] hover:bg-[#F4EFE6] transition-all"
          >
            Manage Categories
          </Link>
          <Link
            to="/admin/products/new"
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#B08D3E] to-[#D4AF37] text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow-md hover:brightness-105 transition-all"
          >
            + Add New Piece
          </Link>
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Catalog', value: '148 Items', sub: 'In 6 categories' },
          { label: 'Low Stock Alert', value: '4 Pieces', sub: 'Under 3 units left', alert: true },
          { label: 'Out of Stock', value: '2 Items', sub: 'Needs restocking' },
          { label: 'Avg Retail Price', value: '₹84,200', sub: 'Incl. 3% GST slab' }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-[#ECE7DE] rounded-xl p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-[#6B6B6B] font-medium">{stat.label}</div>
            <div className={`text-2xl font-serif mt-2 ${stat.alert ? 'text-amber-700 font-bold' : 'text-[#1F1D1B]'}`}>
              {stat.value}
            </div>
            <div className="text-xs text-[#8C827A] mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#ECE7DE] rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C827A]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by title, SKU, or metal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E0D8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#B08D3E] focus:ring-1 focus:ring-[#B08D3E]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-[#E5E0D8] bg-[#FDFBF7] text-sm text-[#2B2B2B] focus:outline-none focus:border-[#B08D3E]"
          >
            <option value="all">All Collections</option>
            <option value="rings">Rings</option>
            <option value="necklaces">Necklaces</option>
            <option value="earrings">Earrings</option>
            <option value="bracelets">Bracelets</option>
          </select>

          <select className="px-4 py-2.5 rounded-lg border border-[#E5E0D8] bg-[#FDFBF7] text-sm text-[#2B2B2B] focus:outline-none focus:border-[#B08D3E]">
            <option value="newest">Latest Uploads</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="stock_asc">Lowest Stock</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#ECE7DE] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1F1D1B] text-white text-[11px] uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Product & SKU</th>
                <th className="py-4 px-6 font-semibold">Collection</th>
                <th className="py-4 px-6 font-semibold">Price (Inc. GST)</th>
                <th className="py-4 px-6 font-semibold">Variants</th>
                <th className="py-4 px-6 font-semibold">Stock Status</th>
                <th className="py-4 px-6 font-semibold">Visibility</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6] text-sm">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[#FDFBF7] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover border border-[#E5E0D8] shrink-0"
                      />
                      <div>
                        <div className="font-medium text-[#1F1D1B] group-hover:text-[#B08D3E] transition-colors">
                          {p.name}
                        </div>
                        <div className="text-xs text-[#8C827A] font-mono mt-0.5">{p.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#6B6B6B] font-medium">{p.category}</td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-[#1F1D1B]">₹{p.price.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-[#8C827A]">{p.gst_rate}% Gold Slab</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-[#F4EFE6] text-[#6B6B6B] font-medium border border-[#E5E0D8]">
                      {p.variants_count} options
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {p.stock_qty > 3 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        {p.stock_qty} in Vault
                      </span>
                    ) : p.stock_qty > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Only {p.stock_qty} left
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Sold Out
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        p.is_active ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-gray-300'
                      }`}
                      title={p.is_active ? 'Live on Storefront' : 'Draft'}
                    ></span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="px-3 py-1.5 text-xs font-semibold text-[#B08D3E] hover:text-[#1F1D1B] hover:bg-[#F4EFE6] rounded transition-all"
                      >
                        Edit
                      </Link>
                      <button className="p-1.5 text-[#8C827A] hover:text-rose-600 rounded transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-6 py-4 bg-[#FDFBF7] border-t border-[#ECE7DE] flex items-center justify-between text-xs text-[#6B6B6B]">
          <span>Showing 3 of 148 luxury products</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1.5 rounded border border-[#D5CFC4] bg-white disabled:opacity-40">Previous</button>
            <button className="px-3 py-1.5 rounded border border-[#B08D3E] bg-[#B08D3E] text-white font-semibold">1</button>
            <button className="px-3 py-1.5 rounded border border-[#D5CFC4] bg-white hover:bg-[#F4EFE6]">2</button>
            <button className="px-3 py-1.5 rounded border border-[#D5CFC4] bg-white hover:bg-[#F4EFE6]">3</button>
            <button className="px-3 py-1.5 rounded border border-[#D5CFC4] bg-white hover:bg-[#F4EFE6]">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}