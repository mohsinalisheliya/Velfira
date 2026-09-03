import { Link } from "react-router-dom";

export default function RelatedProducts({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="section-head">
        <div><span className="eyebrow">You may also like</span><h2>Similar Products</h2></div>
      </div>
      <div className="grid">
        {items.map((item) => (
          <Link to={`/product/${item.related_product_slug}`} key={item.related_product_slug} className="card">
            <div className="card-img"><div className="card-gem"></div></div>
            <div className="card-body">
              <h4>{item.related_product_name}</h4>
              <div className="price">₹{Number(item.related_product_price).toLocaleString("en-IN")}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}