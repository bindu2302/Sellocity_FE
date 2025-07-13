import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Productcard.css";

/**
 * Props:
 *   product       { id, name, price, description, photo, rating }
 *   onAddToCart   fn(product, qty)
 */
export default function ProductCard({ product, onAddToCart }) {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  if (!product) return null;

  const inc = () => setQty((q) => q + 1);
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const rating = Math.round((product.rating || 0) * 2) / 2;

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // prevent navigation when clicking "Add to cart"
    onAddToCart(product, qty);
  };

  return (
    <article className="product-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <figure className="product-img-wrap">
        <img
          src={product.photo || "/placeholder.png"}
          alt={product.name}
          loading="lazy"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
      </figure>

      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
        <p className="product-desc">{product.description}</p>

        <div className="product-rating">
          {rating > 0 && (
            <>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= Math.floor(rating)
                      ? "star full"
                      : star - 0.5 === rating
                      ? "star half"
                      : "star empty"
                  }
                >
                  ★
                </span>
              ))}
              <span className="rating-text">({rating.toFixed(1)})</span>
            </>
          )}
        </div>

        <div className="qty-control" onClick={(e) => e.stopPropagation()}>
          <button onClick={dec} aria-label="decrease quantity">−</button>
          <span className="qty-value">{qty}</span>
          <button onClick={inc} aria-label="increase quantity">+</button>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={handleAddToCart}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}