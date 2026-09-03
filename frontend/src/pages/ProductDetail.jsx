import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../api/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import VariantSelector from "../components/product/VariantSelector";
import RelatedProducts from "../components/product/RelatedProducts";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProduct(slug)
      .then((res) => {
        setProduct(res.data);
        if (res.data.variants?.length > 0) {
          setSelectedVariant(res.data.variants[0]);
        }
        setActiveImage(0);
      })
      .catch((err) => console.error("Failed to load product", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="section"><p style={{ padding: "0 34px" }}>Loading…</p></div>;
  if (!product) return <div className="section"><p style={{ padding: "0 34px" }}>Product not found.</p></div>;

  const effectivePrice = selectedVariant?.effective_price ?? product.price;
  const stock = selectedVariant?.stock_qty ?? product.stock_qty;
  const outOfStock = stock <= 0;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/account?next=" + encodeURIComponent(window.location.pathname));
      return;
    }
    setAdding(true);
    try {
      await addItem(product.id, quantity, selectedVariant?.id || null);
    } catch (err) {
      console.error("Add to cart failed", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <div className="pdp">
        <div className="pdp-gallery">
          <div className="pdp-main-img">
            {product.images?.[activeImage] ? (
              <img src={product.images[activeImage].image} alt={product.name} />
            ) : (
              <div className="card-gem" style={{ width: 90, height: 90 }}></div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="pdp-thumbs">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  className={`pdp-thumb ${i === activeImage ? "active" : ""}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img.image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp-info">
          <span className="cat-label">{product.category?.name}</span>
          <h1>{product.name}</h1>
          <div className="pdp-price">
            ₹{Number(effectivePrice).toLocaleString("en-IN")}
            <span className="pdp-gst"> incl. GST</span>
          </div>

          {outOfStock ? (
            <div className="stock-badge out">Out of stock</div>
          ) : stock <= 5 ? (
            <div className="stock-badge low">Only {stock} left</div>
          ) : null}

          {product.variants?.length > 0 && (
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelect={setSelectedVariant}
            />
          )}

          <div className="qty-row">
            <h5>Quantity</h5>
            <div className="qty-stepper">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} type="button">−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} type="button">+</button>
            </div>
          </div>

          <button className="btn-gold pdp-add-btn" onClick={handleAddToCart} disabled={outOfStock || adding}>
            {outOfStock ? "Out of Stock" : adding ? "Adding…" : "Add to Cart"}
          </button>

          {product.description && (
            <div className="pdp-description">
              <h5>Description</h5>
              <p>{product.description}</p>
            </div>
          )}
        </div>
      </div>

      <RelatedProducts items={product.related_products} />
    </>
  );
}