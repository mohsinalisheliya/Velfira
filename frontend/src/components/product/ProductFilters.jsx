import { useEffect, useState } from "react";
import { listCategories } from "../../api/products";

export default function ProductFilters({ filters, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    listCategories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  return (
    <div className="filters">
      <div className="filter-group">
        <h5>Category</h5>
        <label className="filter-option">
          <input
            type="radio"
            name="category"
            checked={!filters.category}
            onChange={() => onChange({ ...filters, category: "" })}
          />
          All
        </label>
        {categories.map((cat) => (
          <label className="filter-option" key={cat.id}>
            <input
              type="radio"
              name="category"
              checked={filters.category === cat.slug}
              onChange={() => onChange({ ...filters, category: cat.slug })}
            />
            {cat.name}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h5>Price</h5>
        <label className="filter-option">
          <input type="radio" name="price" checked={!filters.min_price && !filters.max_price} onChange={() => onChange({ ...filters, min_price: "", max_price: "" })} />
          All prices
        </label>
        <label className="filter-option">
          <input type="radio" name="price" checked={filters.max_price === "500"} onChange={() => onChange({ ...filters, min_price: "", max_price: "500" })} />
          Under ₹500
        </label>
        <label className="filter-option">
          <input type="radio" name="price" checked={filters.min_price === "500" && filters.max_price === "1000"} onChange={() => onChange({ ...filters, min_price: "500", max_price: "1000" })} />
          ₹500 – ₹1,000
        </label>
        <label className="filter-option">
          <input type="radio" name="price" checked={filters.min_price === "1000"} onChange={() => onChange({ ...filters, min_price: "1000", max_price: "" })} />
          Above ₹1,000
        </label>
      </div>
    </div>
  );
}