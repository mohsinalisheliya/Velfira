import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.slug}`} className="card">
      <div className="card-img">
        {product.is_bestseller && <span className="card-badge">Bestseller</span>}
        {product.primary_image ? (
          <img src={product.primary_image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div className="card-gem"></div>
        )}
      </div>
      <div className="card-body">
        <span className="cat-label">{product.category_name}</span>
        <h4>{product.name}</h4>
        <div className="price">₹{Number(product.price).toLocaleString("en-IN")}</div>
      </div>
    </Link>
  );
}