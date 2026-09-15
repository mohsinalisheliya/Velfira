import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VariantEditor from './VariantEditor';

export default function ProductForm() {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: 'Aurelia 22K Handcrafted Temple Choker',
    slug: 'aurelia-22k-handcrafted-temple-choker',
    category: 'necklaces',
    description: 'Masterfully forged in pure 22-karat yellow gold, featuring authentic Kundan stone settings and heritage meenakari detailing on the inner bezel.',
    basePrice: 276699,
    gstRate: 3,
    hsnCode: '71131910',
    stockQty: 4,
    sku: 'VEL-NCK-042',
    is_active: true,
    is_bestseller: true,
  });

  // Calculate inclusive GST live for accurate billing preview
  const gstMultiplier = 1 + formData.gstRate / 100;
  const priceWithGst = Math.round(formData.basePrice * gstMultiplier);

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-10 font-sans text-[#2B2B2B]">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E5E0D8]">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8C827A] mb-1">
            <Link to="/admin/products" className="hover:text-[#B08D3E]">Catalog</Link>
            <span>/</span>
            <span>Product Editor</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif text-[#1F1D1B]">{formData.name || 'New Product Piece'}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 rounded-lg border border-[#D5CFC4] text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] hover:bg-[#F4EFE6] transition-all"
          >
            Discard
          </Link>
          <button
            type="button"
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#B08D3E] to-[#D4AF37] text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow-md hover:brightness-105 transition-all"
          >
            Publish Changes
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-[#E5E0D8] mb-8 gap-8">
        {[
          { id: 'general', label: '1. General & Pricing' },
          { id: 'variants', label: '2. Variants & Customization' },
          { id: 'media', label: '3. Imagery & Video' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-xs uppercase tracking-widest font-semibold transition-all relative ${
              activeTab === tab.id ? 'text-[#B08D3E]' : 'text-[#8C827A] hover:text-[#1F1D1B]'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#B08D3E] to-[#D4AF37]"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: General & Tax */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#ECE7DE] rounded-xl p-6 shadow-sm">
              <h3 className="font-serif text-lg text-[#1F1D1B] mb-4">Core Specifications</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-2">
                    Piece Title *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-[#E5E0D8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#B08D3E] focus:ring-1 focus:ring-[#B08D3E]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-2">
                      Collection Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-11 px-4 rounded-lg border border-[#E5E0D8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#B08D3E]"
                    >
                      <option value="necklaces">Necklaces</option>
                      <option value="rings">Rings</option>
                      <option value="earrings">Earrings</option>
                      <option value="bracelets">Bracelets</option>
                      <option value="solitaires">Solitaires</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-2">
                      Product URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full h-11 px-4 rounded-lg border border-[#E5E0D8] bg-[#FDFBF7] text-xs font-mono text-[#6B6B6B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-2">
                    Artisanal Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 rounded-lg border border-[#E5E0D8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#B08D3E] focus:ring-1 focus:ring-[#B08D3E]"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & GST Requirements */}
            <div className="bg-white border border-[#ECE7DE] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-[#1F1D1B]">Valuation & GST Compliance</h3>
                <span className="text-xs bg-[#F4EFE6] text-[#B08D3E] font-medium px-2.5 py-1 rounded">Indian Tax Ready</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-2">
                    Base Net Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full h-11 px-4 rounded-lg border border-[#E5E0D8] bg-[#FDFBF7] font-semibold text-sm focus:outline-none focus:border-[#B08D3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-2">
                    GST Rate Slab *
                  </label>
                  <select
                    value={formData.gstRate}
                    onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                    className="w-full h-11 px-4 rounded-lg border border-[#E5E0D8] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#B08D3E]"
                  >
                    <option value={3}>3% (Gold & Gems)</option>
                    <option value={5}>5% (Silver & Fashion)</option>
                    <option value={12}>12% (Accessories)</option>
                    <option value={18}>18% (Standard Service)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-2">
                    HSN / SAC Code *
                  </label>
                  <input
                    type="text"
                    value={formData.hsnCode}
                    onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-[#E5E0D8] bg-[#FDFBF7] text-sm font-mono focus:outline-none focus:border-[#B08D3E]"
                  />
                </div>
              </div>

              {/* Live Invoice Preview Pill */}
              <div className="mt-6 p-4 rounded-lg bg-[#FAF7F2] border border-[#EBE5DB] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8C827A] block">Customer Facing Display Price (Incl. GST)</span>
                  <span className="text-xl font-serif text-[#1F1D1B] font-bold">₹{priceWithGst.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right text-xs text-[#6B6B6B]">
                  GST Breakdown: <span className="font-semibold">₹{(priceWithGst - formData.basePrice).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Properties */}
          <div className="space-y-6">
            <div className="bg-white border border-[#ECE7DE] rounded-xl p-6 shadow-sm">
              <h3 className="font-serif text-lg text-[#1F1D1B] mb-4">Stock & Inventory</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-2">Master SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-[#E5E0D8] bg-[#FDFBF7] text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-2">Vault Units Available</label>
                  <input
                    type="number"
                    value={formData.stockQty}
                    onChange={(e) => setFormData({ ...formData, stockQty: Number(e.target.value) })}
                    className="w-full h-11 px-4 rounded-lg border border-[#E5E0D8] bg-[#FDFBF7] text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#ECE7DE] rounded-xl p-6 shadow-sm">
              <h3 className="font-serif text-lg text-[#1F1D1B] mb-4">Storefront Status</h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-lg border border-[#E5E0D8] cursor-pointer hover:bg-[#FDFBF7]">
                  <span className="text-xs font-semibold text-[#1F1D1B] uppercase tracking-wider">Public Visibility</span>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 accent-[#B08D3E]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-[#E5E0D8] cursor-pointer hover:bg-[#FDFBF7]">
                  <span className="text-xs font-semibold text-[#1F1D1B] uppercase tracking-wider">Bestseller Badge</span>
                  <input
                    type="checkbox"
                    checked={formData.is_bestseller}
                    onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                    className="w-4 h-4 accent-[#B08D3E]"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Variants Sub-editor */}
      {activeTab === 'variants' && (
        <div className="bg-white border border-[#ECE7DE] rounded-xl p-6 shadow-sm">
          <VariantEditor basePrice={formData.basePrice} />
        </div>
      )}

      {/* Tab 3: Media Gallery */}
      {activeTab === 'media' && (
        <div className="bg-white border border-[#ECE7DE] rounded-xl p-6 shadow-sm">
          <h3 className="font-serif text-lg text-[#1F1D1B] mb-2">High-Resolution Photography</h3>
          <p className="text-xs text-[#8C827A] mb-6">Drag and reorder product imagery. First item serves as the primary storefront card.</p>
          
          <div className="border-2 border-dashed border-[#D5CFC4] rounded-xl p-10 text-center bg-[#FDFBF7] cursor-pointer hover:border-[#B08D3E] transition-colors">
            <svg className="w-10 h-10 mx-auto text-[#B08D3E] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs uppercase tracking-wider text-[#1F1D1B] font-semibold block">Drop master jewelry assets here</span>
            <span className="text-[11px] text-[#8C827A] mt-1 block">Supports PNG, JPG, WebP up to 15MB</span>
          </div>
        </div>
      )}
    </div>
  );
}