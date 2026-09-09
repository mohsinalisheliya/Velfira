import { Link } from "react-router-dom";

export default function Gifting() {
  return (
    <>
      <section className="about-hero">
        <span className="eyebrow">Gifting</span>
        <h1>A gift that never goes out of style</h1>
        <p>Curated picks for every relationship, every budget, every occasion.</p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="recipient-grid">
          <Link to="/shop?tag=for-her" className="recipient-card">
            <span className="rc-tag">Gifts for Her →</span>
          </Link>
          <Link to="/shop?tag=for-him" className="recipient-card">
            <span className="rc-tag">Gifts for Him →</span>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div><span className="eyebrow">Shop by budget</span><h2>Gifts under...</h2></div>
        </div>
        <div className="gift-budget-grid">
          <Link to="/shop?max_price=500" className="gift-budget-tile">Under ₹500</Link>
          <Link to="/shop?max_price=1000" className="gift-budget-tile">Under ₹1,000</Link>
          <Link to="/shop?max_price=2000" className="gift-budget-tile">Under ₹2,000</Link>
        </div>
      </section>

      <section className="about-cta">
        <h2>Not sure what to pick?</h2>
        <p>Every order ships with free gift wrapping and a personal note card.</p>
        <Link to="/shop" className="btn-gold">Browse All Jewellery</Link>
      </section>
    </>
  );
}