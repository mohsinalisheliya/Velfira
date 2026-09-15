import React from 'react';

export default function ProductList() {
  return (
    <div className="min-h-screen p-6 bg-velfira-ivory font-sans text-velfira-charcoal-light">
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif text-velfira-charcoal-dark">Product Catalog</h1>
        
        <button className="px-6 py-2.5 text-white transition-all rounded-md shadow-sm bg-gradient-to-r from-velfira-gold to-velfira-gold-light hover:shadow-md">
          + Add New Product
        </button>
      </div>

      <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm">
        <table className="min-w-full text-left border-collapse">
          <thead className="text-white bg-velfira-charcoal-dark">
            <tr>
              <th className="px-6 py-4 text-sm font-medium">Product Name</th>
              <th className="px-6 py-4 text-sm font-medium">Category</th>
              <th className="px-6 py-4 text-sm font-medium">Price (inc. GST)</th>
              <th className="px-6 py-4 text-sm font-medium">Stock</th>
              <th className="px-6 py-4 text-sm font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Example Row */}
            <tr className="transition-all cursor-pointer hover:border-velfira-gold hover:border hover:shadow-sm hover:bg-gray-50">
              <td className="flex items-center gap-4 px-6 py-4">
                <div className="w-12 h-12 overflow-hidden border border-gray-100 rounded-md bg-gray-50">
                  <img src="/placeholder.jpg" alt="Product" className="object-cover w-full h-full" />
                </div>
                <span className="font-medium text-velfira-charcoal-dark">24k Gold Chain</span>
              </td>
              <td className="px-6 py-4 text-velfira-grey">Necklaces</td>
              <td className="px-6 py-4 font-medium">₹45,000</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs text-green-700 bg-green-50 rounded-md">In Stock (12)</span>
              </td>
              <td className="px-6 py-4 font-medium text-right text-velfira-gold hover:text-velfira-charcoal-dark">
                <button>Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}