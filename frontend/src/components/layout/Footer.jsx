export default function Footer() {
  return (
    <footer>
      <div className="foot-grid">
        <div>
          <img src="/logo-full.png" alt="Velfira" />
          <p>Luxury without limits — affordable, anti-tarnish fashion jewellery, designed and shipped across India.</p>
        </div>
        <div className="foot-col">
          <h5>Shop</h5>
          <a href="/shop?category=rings">Rings</a>
          <a href="/shop?category=necklaces">Necklaces</a>
          <a href="/shop?category=earrings">Earrings</a>
          <a href="/shop?category=bangles">Bangles</a>
        </div>
        <div className="foot-col">
          <h5>Support</h5>
          <a href="/account/orders">Track order</a>
          <a href="/returns">Returns policy</a>
          <a href="/care-guide">Care guide</a>
          <a href="/contact">Contact us</a>
        </div>
        <div className="foot-col">
          <h5>Company</h5>
          <a href="/about">About Velfira</a>
          <a href="/grievance">Grievance officer</a>
          <a href="/privacy">Privacy policy</a>
          <a href="/terms">Terms of service</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 Velfira. All rights reserved.</span>
        <span>GSTIN: 24XXXXX1234X1ZX</span>
      </div>
    </footer>
  );
}