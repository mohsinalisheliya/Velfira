import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();

  return (
    <>
      <div className="announce">
        Free shipping above ₹999 <span>|</span> Tarnish-resistant plating <span>|</span> 7-day easy returns
      </div>

      <div className="topbar">
        <Link to="/" className="topbar-logo">
          <img src="/logo-full.png" alt="Velfira" />
        </Link>

        <div className="searchbar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search earrings, necklaces, rings…" />
        </div>

        <div className="topbar-icons">
          <Link to="/account" className="icon-btn" aria-label="Account">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
            </svg>
            <span className="icon-label">Account</span>
          </Link>
          <Link to="/cart" className="icon-btn" aria-label={`Cart, ${cart.item_count} items`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 8h12l-1.2 11a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span className="badge">{cart.item_count}</span>
          </Link>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className="catnav">
        <div className="catnav-inner">
          <Link to="/shop?sort=new">New Arrivals</Link>
          <Link to="/shop?sort=bestseller">Best Sellers</Link>
          <Link to="/gifting">Gifting</Link>
          <Link to="/about">About Us</Link>
        </div>
      </div>

      <div className={`scrim ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`mobile-panel ${menuOpen ? "open" : ""}`}>
        <button className="panel-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
        <Link to="/shop?sort=new" onClick={() => setMenuOpen(false)}>New Arrivals</Link>
        <Link to="/shop?sort=bestseller" onClick={() => setMenuOpen(false)}>Best Sellers</Link>
        <Link to="/shop?category=rings" onClick={() => setMenuOpen(false)}>Rings</Link>
        <Link to="/shop?category=necklaces" onClick={() => setMenuOpen(false)}>Necklaces</Link>
        <Link to="/shop?category=earrings" onClick={() => setMenuOpen(false)}>Earrings</Link>
        <Link to="/shop?category=bangles" onClick={() => setMenuOpen(false)}>Bangles</Link>
        <Link to="/gifting" onClick={() => setMenuOpen(false)}>Gifting</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
        <Link to="/account" onClick={() => setMenuOpen(false)}>My Account</Link>
        <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({cart.item_count})</Link>
      </div>
    </>
  );
}