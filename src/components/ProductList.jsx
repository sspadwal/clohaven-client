import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductList.css';

function ProductList({ products, addToCart }) {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="pl-container">
      <div className="pl-grid">
        {products.map((product) => (
          <article 
            key={product._id} 
            className="pl-card"
            onClick={() => handleProductClick(product._id)}
          >
            <div className="pl-image-wrapper">
              <img 
                src={product.images[0] || 'https://via.placeholder.com/300'} 
                alt={product.name} 
                className="pl-image"
                loading="lazy"
              />
              <div className="pl-overlay">
                <button 
                  className="pl-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product._id);
                  }}
                >
                  <span className="pl-cart-icon">🛒</span> Add to Cart
                </button>
              </div>
            </div>
            <div className="pl-content">
              <h3 className="pl-title">{product.name}</h3>
              <div className="pl-meta">
                <span className="pl-price">₹{product.price.toLocaleString()}</span>
                <span className="pl-category">{product.category?.name || 'Clothing'}</span>
              </div>
              {product.inStock === false && (
                <div className="pl-badge pl-badge-outofstock">Out of Stock</div>
              )}
              {product.isNew && (
                <div className="pl-badge pl-badge-new">New Arrival</div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ProductList;