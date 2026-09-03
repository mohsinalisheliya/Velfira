import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listProducts } from "../api/products";
import ProductCard from "../components/product/ProductCard";
import ProductFilters from "../components/product/ProductFilters";

const SORT_MAP = {
  new: "-created_at",
  bestseller: "-created_at", // bestseller filtered separately below
  price_low: "price",
  price_high: "-price",
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = {
    category: searchParams.get("category") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
  };
  const sort = searchParams.get("sort") || "new";

  const updateFilters = (next) => {
    const params = {};
    if (next.category) params.category = next.category;
    if (next.min_price) params.min_price = next.min_price;
    if (next.max_price) params.max_price = next.max_price;
    if (sort) params.sort = sort;
    setSearchParams(params);
  };

  const updateSort = (newSort) => {
    const params = { ...Object.fromEntries(searchParams), sort: newSort };
    setSearchParams(params);
  };

  useEffect(() => {
    setLoading(true);
    const params = {
      ordering: SORT_MAP[sort] || "-created_at",
    };
    if (filters.category) params.category = filters.category;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;
    if (sort === "bestseller") params.is_bestseller = true;

    listProducts(params)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to load products", err))
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <span className="eyebrow">{products.length} styles</span>
          <h2>{filters.category ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1) : "All Jewellery"}</h2>
        </div>
        <select className="sort-select" value={sort} onChange={(e) => updateSort(e.target.value)}>
          <option value="new">Newest first</option>
          <option value="bestseller">Best sellers</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>

      <div className="shop-layout">
        <ProductFilters filters={filters} onChange={updateFilters} />

        <div className="shop-results">
          {loading ? (
            <p style={{ color: "var(--grey)" }}>Loading…</p>
          ) : products.length === 0 ? (
            <p style={{ color: "var(--grey)" }}>No products match these filters.</p>
          ) : (
            <div className="grid shop-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}