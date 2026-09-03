import { useEffect, useState } from "react";
import { listProducts } from "../api/products";
import ProductCard from "../components/product/ProductCard";
import CategoryCircleRow from "../components/product/CategoryCircleRow";

export default function Home() {
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [bsRes, naRes] = await Promise.all([
          listProducts({ is_bestseller: true }),
          listProducts({ ordering: "-created_at" }),
        ]);
        setBestsellers(bsRes.data.slice(0, 4));
        setNewArrivals(naRes.data.slice(0, 4));
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <div className="banner-wrap">
        <div className="banner" style={{ backgroundImage: "url('/banner.jpg')" }}>
          <div className="banner-eyebrow">Festive Edit</div>
          <h2>EXTRA 30% OFF</h2>
          <p className="sub">On our full imitation jewellery collection</p>
          <div className="code">Code: <strong>FESTIVE30</strong></div>
          <a href="/shop" className="btn-outline">Shop Now</a>
        </div>
      </div>
      <div className="ticker">
        <span>Gifts For Her @ Flat 40% Off</span>
        <span>Ships In 24 Hours</span>
        <span>5L+ Happy Customers</span>
        <span>Skin-Friendly, Nickel Free</span>
      </div>

      <section className="section">
        <div className="section-head">
          <div><span className="eyebrow">Shop by category</span><h2>Browse the edit</h2></div>
        </div>
        <CategoryCircleRow />
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div><span className="eyebrow">Loved by everyone</span><h2>Best Sellers</h2></div>
          <a href="/shop?sort=bestseller">View all →</a>
        </div>
        {!loading && bestsellers.length === 0 ? (
          <p style={{ padding: "0 34px", color: "var(--grey)" }}>
            No bestsellers marked yet — tag a product as "Best Seller" from the admin panel.
          </p>
        ) : (
          <div className="grid">
            {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div><span className="eyebrow">Just dropped</span><h2>New Arrivals</h2></div>
          <a href="/shop?sort=new">View all →</a>
        </div>
        <div className="grid">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="editorial">
        <span className="eyebrow">The Velfira promise</span>
        <blockquote>"Real-gold shine, imitation-friendly price — anti-tarnish plating that holds its finish wear after wear."</blockquote>
        <div className="divider"></div>
        <p className="sub">Designed for everyday glam and festive drama alike — jewellery you don't have to save for someday.</p>
      </section>
    </>
  );
}      