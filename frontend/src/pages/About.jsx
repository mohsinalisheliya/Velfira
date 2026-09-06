export default function About() {
  return (
    <>
      <section className="about-hero">
        <span className="eyebrow">Our Story</span>
        <h1>Jewellery that doesn't ask you to choose</h1>
        <p>
          Velfira was born from a simple frustration — real gold jewellery is
          beautiful but out of reach for everyday wear, and most "imitation"
          alternatives look and feel cheap. We build the middle ground:
          gold-plated, anti-tarnish pieces that photograph like the real
          thing and last through everyday wear, without the everyday price.
        </p>
      </section>

      <section className="section">
        <div className="section-head">
          <div><span className="eyebrow">Why Velfira</span><h2>What we promise</h2></div>
        </div>
        <div className="about-values">
          <div className="about-value-card">
            <h4>Anti-tarnish plating</h4>
            <p>Multi-layer gold plating that resists fading, even with daily wear and humidity.</p>
          </div>
          <div className="about-value-card">
            <h4>Skin-friendly</h4>
            <p>Nickel and lead free base metals — safe for sensitive skin and everyday use.</p>
          </div>
          <div className="about-value-card">
            <h4>Real-gold look</h4>
            <p>Designed to photograph and shine like fine jewellery, at a fraction of the cost.</p>
          </div>
          <div className="about-value-card">
            <h4>Fast, easy returns</h4>
            <p>7-day no-questions-asked returns, because we want you confident in every order.</p>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <div className="about-stat"><h3>5L+</h3><p>Happy customers</p></div>
        <div className="about-stat"><h3>500+</h3><p>Designs and counting</p></div>
        <div className="about-stat"><h3>24 hrs</h3><p>Dispatch time</p></div>
        <div className="about-stat"><h3>4.7★</h3><p>Average rating</p></div>
      </section>

      <section className="editorial">
        <span className="eyebrow">The Velfira promise</span>
        <blockquote>"Real-gold shine, imitation-friendly price — anti-tarnish plating that holds its finish wear after wear."</blockquote>
        <div className="divider"></div>
        <p className="sub">Designed for everyday glam and festive drama alike — jewellery you don't have to save for someday.</p>
      </section>

      <section className="about-cta">
        <h2>Ready to find your piece?</h2>
        <a href="/shop" className="btn-gold">Shop the collection</a>
      </section>
    </>
  );
}