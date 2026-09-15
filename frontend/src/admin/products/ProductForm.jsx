import React from 'react';

export default function ProductForm() {
  return (
    <div className="min-h-screen p-6 bg-velfira-ivory font-sans text-velfira-charcoal-light">
      <div className="max-w-4xl p-8 mx-auto bg-white border border-gray-100 rounded-lg shadow-sm">
        <h2 className="mb-6 text-2xl font-serif text-velfira-charcoal-dark">Product Details</h2>
        
        <form className="space-y-6">
          {/* General Info */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium">Product Name</label>
              <input 
                type="text" 
                className="w-full h-11 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-velfira-gold focus:ring-1 focus:ring-velfira-gold" 
                placeholder="e.g. Diamond Drop Earrings"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Category</label>
              <select className="w-full h-11 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-velfira-gold focus:ring-1 focus:ring-velfira-gold">
                <option>Select Category</option>
                <option>Earrings</option>
                <option>Necklaces</option>
              </select>
            </div>
          </div>

          {/* Tax & Pricing Requirements */}
          <div className="grid grid-cols-1 gap-6 pt-6 border-t border-gray-100 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium">Base Price</label>
              <input 
                type="number" 
                className="w-full h-11 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-velfira-gold focus:ring-1 focus:ring-velfira-gold" 
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">GST Slab</label>
              <select className="w-full h-11 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-velfira-gold focus:ring-1 focus:ring-velfira-gold">
                <option value="3">3% (Gold/Silver)</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">HSN Code</label>
              <input 
                type="text" 
                className="w-full h-11 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-velfira-gold focus:ring-1 focus:ring-velfira-gold" 
                placeholder="e.g. 7113"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 mt-4 border-t border-gray-50">
            <button type="button" className="px-6 py-2.5 text-velfira-gold transition-all border border-velfira-gold rounded-md hover:bg-velfira-gold/5">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 text-white transition-all rounded-md shadow-sm bg-gradient-to-r from-velfira-gold to-velfira-gold-light hover:shadow-md">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}