import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      <section className="editorial about-editorial">
        <span className="eyebrow">Our Story</span>
        <blockquote>"Redefining everyday luxury for the modern woman."</blockquote>
        <div className="divider"></div>
        <p className="sub">
          Velfira was born from a simple belief: high-quality, elegant jewellery
          shouldn't come with an intimidating price tag or the fear of tarnishing.
        </p>
      </section>

      <section className="about-mission">
        <h2>Luxury Without Limits</h2>
        <p>
          We noticed a gap in the market. You either had to spend a fortune on
          solid gold, or settle for imitation pieces that lost their shine
          after a few wears. Velfira bridges that gap perfectly.
        </p>
        <p>
          Our pieces are meticulously crafted with premium materials and
          finished with an advanced anti-tarnish coating — the rich, heavy
          look of fine jewellery that effortlessly withstands perfumes,
          lotions, and your daily hustle.
        </p>
      </section>

      <section className="about-usp-section">
        <div className="section-head" style={{ justifyContent: "center", textAlign: "center" }}>
          <div>
            <span className="eyebrow">Why choose us</span>
            <h2>The Velfira Promise</h2>
          </div>
        </div>

        <div className="usp-grid">
          <div className="usp-card">
            <div className="usp-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 2l1.8 5.6L19 9l-5.2 1.4L12 16l-1.8-5.6L5 9l5.2-1.4L12 2Z"/></svg>
            </div>
            <h4>Anti-Tarnish</h4>
            <p>Advanced plating technology ensures your jewellery keeps its original shine, wear after wear.</p>
          </div>

          <div className="usp-card">
            <div className="usp-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11Z"/></svg>
            </div>
            <h4>Skin Friendly</h4>
            <p>100% lead and nickel free. Designed to be hypoallergenic and safe for sensitive skin.</p>
          </div>

          <div className="usp-card">
            <div className="usp-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 9l6-6 6 6-6 11-6-11Z"/><path d="M6 9h12"/></svg>
            </div>
            <h4>Premium Finish</h4>
            <p>Crafted to mimic the exact weight, texture, and visual appeal of real 18k and 22k gold.</p>
          </div>

          <div className="usp-card">
            <div className="usp-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M20.6 12.4 12.4 20.6a2 2 0 0 1-2.8 0l-6.2-6.2a2 2 0 0 1 0-2.8L11.6 3.4a2 2 0 0 1 1.4-.6H19a2 2 0 0 1 2 2v5.2a2 2 0 0 1-.4 1.8Z"/><circle cx="15.5" cy="7.5" r="1.2"/></svg>
            </div>
            <h4>Accessible Luxury</h4>
            <p>High-end aesthetic designs curated at a price point that doesn't make you think twice.</p>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to elevate your everyday?</h2>
        <p>Explore our latest collection of earrings, rings, necklaces, and bangles designed for you.</p>
        <Link to="/shop" className="btn-gold">Explore Collection</Link>
      </section>
    </>
  );
}