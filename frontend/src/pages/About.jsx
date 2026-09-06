import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      {/* Hero / Editorial Section */}
      <section className="editorial" style={{ paddingTop: "var(--sp-7)", paddingBottom: "var(--sp-7)" }}>
        <span className="eyebrow">Our Story</span>
        <blockquote>"Redefining everyday luxury for the modern woman."</blockquote>
        <div className="divider"></div>
        <p className="sub">
          Velfira was born from a simple belief: high-quality, elegant jewellery shouldn't come with an intimidating price tag or the fear of tarnishing.
        </p>
      </section>

      {/* Mission Section */}
      <section className="section" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", padding: "var(--sp-6) var(--sp-4)" }}>
        <h2 style={{ fontSize: "32px", marginBottom: "24px" }}>Luxury Without Limits</h2>
        <p style={{ fontSize: "16px", color: "var(--grey)", lineHeight: "1.8", marginBottom: "16px" }}>
          We noticed a gap in the market. You either had to spend a fortune on solid gold, or settle for imitation pieces that lost their shine after a few wears. Velfira bridges that gap perfectly.
        </p>
        <p style={{ fontSize: "16px", color: "var(--grey)", lineHeight: "1.8" }}>
          Our pieces are meticulously crafted with premium materials and finished with an advanced anti-tarnish coating. This means you get the rich, heavy look of fine jewellery that effortlessly withstands perfumes, lotions, and your daily hustle.
        </p>
      </section>

      {/* Pillars / USPs Grid */}
      <section className="section" style={{ background: "var(--sand)", padding: "var(--sp-6) 0" }}>
        <div className="section-head" style={{ justifyContent: "center", textAlign: "center", marginBottom: "48px" }}>
          <div>
            <span className="eyebrow">Why Choose Us</span>
            <h2>The Velfira Promise</h2>
          </div>
        </div>
        
        <div className="grid" style={{ maxWidth: "1180px", margin: "0 auto" }}>
          {/* USP 1 */}
          <div className="card" style={{ padding: "32px 24px", textAlign: "center", background: "var(--ivory)", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div className="order-confirm-icon" style={{ margin: "0 auto 16px", width: "48px", height: "48px", fontSize: "20px" }}>✨</div>
            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "8px", color: "var(--charcoal)" }}>Anti-Tarnish</h4>
            <p style={{ fontSize: "13.5px", color: "var(--grey)", lineHeight: "1.6", margin: 0 }}>
              Advanced plating technology ensures your jewellery keeps its original shine, wear after wear.
            </p>
          </div>

          {/* USP 2 */}
          <div className="card" style={{ padding: "32px 24px", textAlign: "center", background: "var(--ivory)", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div className="order-confirm-icon" style={{ margin: "0 auto 16px", width: "48px", height: "48px", fontSize: "20px" }}>💧</div>
            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "8px", color: "var(--charcoal)" }}>Skin Friendly</h4>
            <p style={{ fontSize: "13.5px", color: "var(--grey)", lineHeight: "1.6", margin: 0 }}>
              100% lead and nickel free. Designed to be hypoallergenic and safe for sensitive skin.
            </p>
          </div>

          {/* USP 3 */}
          <div className="card" style={{ padding: "32px 24px", textAlign: "center", background: "var(--ivory)", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div className="order-confirm-icon" style={{ margin: "0 auto 16px", width: "48px", height: "48px", fontSize: "20px" }}>💎</div>
            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "8px", color: "var(--charcoal)" }}>Premium Finish</h4>
            <p style={{ fontSize: "13.5px", color: "var(--grey)", lineHeight: "1.6", margin: 0 }}>
              Crafted to mimic the exact weight, texture, and visual appeal of real 18k and 22k gold.
            </p>
          </div>

          {/* USP 4 */}
          <div className="card" style={{ padding: "32px 24px", textAlign: "center", background: "var(--ivory)", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div className="order-confirm-icon" style={{ margin: "0 auto 16px", width: "48px", height: "48px", fontSize: "20px" }}>🏷️</div>
            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "8px", color: "var(--charcoal)" }}>Accessible Luxury</h4>
            <p style={{ fontSize: "13.5px", color: "var(--grey)", lineHeight: "1.6", margin: 0 }}>
              High-end aesthetic designs curated at a price point that doesn't make you think twice.
            </p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="section" style={{ textAlign: "center", padding: "var(--sp-7) var(--sp-4)" }}>
        <h2 style={{ fontSize: "32px", marginBottom: "16px" }}>Ready to elevate your everyday?</h2>
        <p style={{ fontSize: "15px", color: "var(--grey)", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Explore our latest collection of earrings, rings, necklaces, and bangles designed for you.
        </p>
        <Link to="/shop" className="btn-gold">Explore Collection</Link>
      </section>
    </>
  );
}