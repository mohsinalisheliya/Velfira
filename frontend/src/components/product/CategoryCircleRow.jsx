import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCategories } from "../../api/products";

export default function CategoryCircleRow() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCategories({ homepage: true })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to load categories", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (categories.length === 0) {
    return (
      <p style={{ padding: "0 34px", color: "var(--grey)" }}>
        No categories yet — add some from the admin panel.
      </p>
    );
  }

  return (
    <div className="circle-row-wrap">
      <div className="circle-row">
        {categories.map((cat) => (
          <Link to={`/shop?category=${cat.slug}`} key={cat.id} className="circle-item">
            <div className="circle-img">
              {cat.image && (
                <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              )}
            </div>
            <h4>{cat.name}</h4>
          </Link>
        ))}
      </div>
      <div className="circle-fade"></div>
    </div>
  );
}