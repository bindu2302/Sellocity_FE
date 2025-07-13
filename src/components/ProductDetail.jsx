import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showZoom, setShowZoom] = useState(false);
  const navigate = useNavigate();
  const imageRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:8080/getProductById/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x: Math.max(0, Math.min(x, 100)),
      y: Math.max(0, Math.min(y, 100)),
    });
  };

  const inc = () => setQty(qty + 1);
  const dec = () => setQty(Math.max(1, qty - 1));

  const handleAddToCart = async () => {
    const username = localStorage.getItem("username");
    if (!username) return alert("Please sign in first");

    try {
      const resp = await fetch("http://localhost:8080/addToCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, username, quantity: qty }),
      });

      resp.ok
        ? alert(`Added “${product.name}” (x${qty}) to cart`)
        : alert("Could not add to cart");
    } catch (err) {
      console.error(err);
      alert("Could not add to cart");
    }
  };

  if (!product) return <div className="loading">Loading product...</div>;

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate("/")}>🛍️ Sales Savvy</div>
        <ul className="nav-links">
          <li onClick={() => navigate("/customer_home")}>Home</li>
          <li onClick={() => navigate("/cart")}>Cart</li>
          <li onClick={() => navigate("/orders")}>Orders</li>
          <li onClick={() => { localStorage.clear(); navigate("/", { replace: true }); }}>Logout</li>
        </ul>
      </nav>

      <div className="product-detail-container">
        <div
          className="zoom-wrapper"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
        >
          <img
            ref={imageRef}
            src={product.photo}
            alt={product.name}
            className="main-image"
          />
          {showZoom && (
            <div
              className="zoom-image"
              style={{
                backgroundImage: `url(${product.photo})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
              }}
            />
          )}
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-price">₹{product.price.toLocaleString()}</p>
          <p className="product-desc">{product.description}</p>

          <div className="product-rating">
            Rating: {product.rating?.toFixed(1)} ★
          </div>

          <div className="qty-control">
            <button onClick={dec}>−</button>
            <span>{qty}</span>
            <button onClick={inc}>+</button>
          </div>

          <button className="btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}