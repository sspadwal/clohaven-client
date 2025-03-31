import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SingleProduct.css';
import LoginPrompt from '../components/LoginPrompt';

function SingleProduct({ addToCart, token }) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(`Fetching product from: ${API_URL}/products/${id}`);
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        console.log('Product data:', response.data);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        console.error('Error response:', error.response);
        setError(error.response?.data?.message || error.message || 'Failed to fetch product');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!token) {
      setShowLoginPrompt(true);
    } else {
      addToCart(id, quantity);
    }
  };

  

  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h3>Error loading product</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/products')} className="back-btn">
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-state">
        <div className="not-found-icon">🔍</div>
        <h3>Product Not Found</h3>
        <p>The product you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/products')} className="back-btn">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="single-product-container">
      <div className="product-details-wrapper">
        <nav className="breadcrumb">
          <button onClick={() => navigate('/')}>Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')}>Products</button>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-details">
          <div className="product-gallery">
            <div className="thumbnail-container">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
            <div className="main-image-container">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="main-image"
              />
              {product.discount > 0 && (
                <span className="discount-badge">-{product.discount}%</span>
              )}
            </div>
          </div>

          <div className="product-info">
            <div className="product-header">
              <h1>{product.name}</h1>
              <div className="rating-container">
                <div className="stars">★★★★★</div>
                <span className="review-count">(42 reviews)</span>
              </div>
            </div>

            <div className="price-container">
              <span className="current-price">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {product.discount > 0 && (
                <span className="discount-text">You save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
              )}
            </div>

            

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || 'No description available.'}</p>
            </div>

            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button
                  type="button"
                  onClick={decrementQuantity}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(10, Number(e.target.value) || 1));
                    setQuantity(value);
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setQuantity(1);
                    }
                  }}
                  aria-label="Product quantity"
                />
                <button
                  type="button"
                  onClick={incrementQuantity}
                  aria-label="Increase quantity"
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={handleAddToCart} className="add-to-cart-btn">
                <span className="cart-icon">🛒</span>
                Add to Cart
              </button>
              <button className="buy-now-btn">
                Buy Now
              </button>
              <button className="wishlist-btn">
                ♡ Wishlist
              </button>
            </div>

            <div className="product-tags">
              <span>Tags: </span>
              {['Fashion', 'New Arrival', 'Trending'].map(tag => (
                <button key={tag} className="tag">{tag}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="product-tabs">
          <div className="tabs-header">
            <button className="tab active">Description</button>
            <button className="tab">Reviews</button>
            <button className="tab">Shipping</button>
            <button className="tab">Returns</button>
          </div>
          <div className="tabs-content">
            <div className="tab-panel active">
              <h3>Product Details</h3>
              <p>{product.description || 'No detailed description available.'}</p>
              <ul>
                <li>High-quality materials</li>
                <li>Premium craftsmanship</li>
                <li>Designed for comfort</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <LoginPrompt 
          onClose={() => setShowLoginPrompt(false)}
          onLogin={() => {
            setShowLoginPrompt(false);
            navigate('/login');
          }}
        />
      )}
    </div>
  );
}

export default SingleProduct;