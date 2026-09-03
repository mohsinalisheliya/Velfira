export default function CartItem({ item, onUpdateQty, onRemove }) {
  const price = item.variant?.effective_price ?? item.product.price;

  return (
    <div className="cart-item">
      <div className="cart-item-img">
        {item.product.primary_image ? (
          <img src={item.product.primary_image} alt={item.product.name} />
        ) : (
          <div className="card-gem"></div>
        )}
      </div>
      <div className="cart-item-info">
        <span className="cat-label">{item.product.category_name}</span>
        <h4>{item.product.name}</h4>
        {item.variant?.attributes && (
          <p className="cart-item-attrs">
            {Object.entries(item.variant.attributes).map(([k, v]) => `${v}`).join(" · ")}
          </p>
        )}
        <div className="cart-item-price">₹{Number(price).toLocaleString("en-IN")}</div>
      </div>
      <div className="cart-item-actions">
        <div className="qty-stepper">
          <button onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))} type="button">−</button>
          <span>{item.quantity}</span>
          <button onClick={() => onUpdateQty(item.id, item.quantity + 1)} type="button">+</button>
        </div>
        <button className="cart-remove" onClick={() => onRemove(item.id)} type="button">Remove</button>
      </div>
    </div>
  );
}