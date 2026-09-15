import React, { useState, useEffect } from 'react';
// Assuming you have a Link component from react-router-dom

export default function ProductList() {
  return (
    // Ivory White background, sans-serif body text (Inter/Lato)
    <div className="p-6 bg-[#FDFBF7] min-h-screen font-sans text-[#2B2B2B]">
      
      <div className="flex justify-between items-center mb-8">
        {/* Refined serif heading (Playfair Display/Georgia) */}
        <h1 className="text-3xl font-serif text-[#1F1D1B]">Product Catalog</h1>
        
        {/* Primary Gold Button with hover shimmer and 6px-8px rounding */}
        <button className="px-6 py-2 bg-gradient-to-r from-[#B08D3E] to-[#D4AF37] text-white rounded-md shadow-sm hover:shadow-md transition-all">
          + Add New Product
        </button>
      </div>

      {/* Card style: soft shadow, thin border, rounded corners */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-[#1F1D1B] text-white">
            <tr>
              <th className="py-3 px-6 font-medium text-sm">Product Name</th>
              <th className="py-3 px-6 font-medium text-sm">Category</th>
              <th className="py-3 px-6 font-medium text-sm">Price (inc. GST)</th>
              <th className="py-3 px-6 font-medium text-sm">Stock</th>
              <th className="py-3 px-6 font-medium text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Map your product data here. Example row: */}
            <tr className="hover:border-[#B08D3E] hover:border hover:shadow-sm transition-all cursor-pointer">
              <td className="py-4 px-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-md border border-gray-100 overflow-hidden">
                  {/* Lazy loaded image */}
                  <img src="/placeholder.jpg" alt="Product" className="w-full h-full object-cover" />
                </div>
                <span className="font-medium text-[#1F1D1B]">24k Gold Chain</span>
              </td>
              <td className="py-4 px-6 text-[#6B6B6B]">Necklaces</td>
              <td className="py-4 px-6 font-medium">₹45,000</td>
              <td className="py-4 px-6">
                <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs">In Stock (12)</span>
              </td>
              <td className="py-4 px-6 text-right">
                <button className="text-[#B08D3E] hover:text-[#1F1D1B] text-sm font-medium">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}