import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/NewHome.css';

function NewHome({ token }) {
  const [products, setProducts] = useState([]);
  const [usedProductIds, setUsedProductIds] = useState(new Set());
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchNewProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      console.log(API_URL)
      const allProducts = response.data;

      const availableProducts = allProducts.filter(
        product => !usedProductIds.has(product._id)
      );

      if (availableProducts.length === 0) {
        setUsedProductIds(new Set());
        return fetchNewProducts();
      }

      const shuffled = availableProducts.sort(() => 0.5 - Math.random());
      const selectedProducts = shuffled.slice(0, Math.min(10, availableProducts.length));

      setProducts(selectedProducts);
      document.documentElement.style.setProperty('--product-count', selectedProducts.length);

      const newIds = new Set([...usedProductIds, ...selectedProducts.map(p => p._id)]);
      setUsedProductIds(newIds);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchNewProducts();
    const intervalId = setInterval(() => {
      fetchNewProducts();
    }, 20000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="new-home">
      <header className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Discover Your Fashion</h1>
          <p className="tagline">Elegant styles for every moment.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/products')} className="shop-now">Explore Now</button>
            {!token && (
              <button onClick={() => navigate('/signup')} className="join-now">Join Us</button>
            )}
          </div>
        </div>
      </header>

      <section className="featured-products">
        <h2>Latest Fashion Picks</h2>
        {products.length > 0 ? (
          <div className="image-slider">
            <div className="slider-container">
              <div className="slider-track">
                {products.map((product, index) => (
                  <div key={index} className="slider-item">
                    <img src={product.images[0]} alt={product.name || `Product ${index}`} />
                  </div>
                ))}
                {products.map((product, index) => (
                  <div key={`duplicate-${index}`} className="slider-item">
                    <img src={product.images[0]} alt={product.name || `Product ${index}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="no-products">Loading your style...</p>
        )}
        <button onClick={() => navigate('/products')} className="view-all">See All Styles</button>
      </section>

      <section className="featured-collections">
        <h2>Explore Our Collections</h2>
        <div className="collections-grid">
          <div className="collection-item" onClick={() => navigate('/products?category=men')}>
            <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=300&q=80" alt="Men's Fashion" />
            <div className="collection-overlay">
              <h3>Men's Fashion</h3>
              <p>Sharp looks for every occasion</p>
            </div>
          </div>
          <div className="collection-item" onClick={() => navigate('/products?category=women')}>
            <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80" alt="Women's Fashion" />
            <div className="collection-overlay">
              <h3>Women's Fashion</h3>
              <p>Elegance meets modern style</p>
            </div>
          </div>
          <div className="collection-item" onClick={() => navigate('/products?category=accessories')}>
            <img src="https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?auto=format&fit=crop&w=300&q=80" alt="Accessories" />
            <div className="collection-overlay">
              <h3>Accessories</h3>
              <p>Perfect your look</p>
            </div>
          </div>
        </div>
      </section>

      <section className="style-spotlight">
        <h2>Style That Defines Us</h2>
        <div className="spotlight-grid">
          <div className="spotlight-item">
            <div className="spotlight-icon">✨</div>
            <h3>Curated Trends</h3>
            <p>Handpicked styles to keep you in vogue.</p>
          </div>
          <div className="spotlight-item">
            <div className="spotlight-icon">🌍</div>
            <h3>Global Shipping</h3>
            <p>Worldwide delivery, right to your door.</p>
          </div>
          <div className="spotlight-item">
            <div className="spotlight-icon">💎</div>
            <h3>Premium Quality</h3>
            <p>Fashion that lasts, designed for you.</p>
          </div>
        </div>
      </section>

      <section className="community-highlights">
        <h2>Our Fashion Community</h2>
        <div className="highlights-slider">
          <div className="highlights-track">
            {[
              { img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", quote: "Loving the vibe of these outfits!", name: "Priya M." },
              { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", quote: "Perfect fit, amazing quality!", name: "Amit R." },
              { img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", quote: "My go-to fashion store!", name: "Neha S." },
              { img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", quote: "Stylish and affordable!", name: "Rahul K." }
            ].map((item, index) => (
              <div key={index} className="highlight-item">
                <img src={item.img} alt={item.name} />
                <p>"{item.quote}"</p>
                <span>- {item.name}</span>
              </div>
            ))}
            {[
              { img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", quote: "Loving the vibe of these outfits!", name: "Priya M." },
              { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", quote: "Perfect fit, amazing quality!", name: "Amit R." },
              { img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", quote: "My go-to fashion store!", name: "Neha S." },
              { img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", quote: "Stylish and affordable!", name: "Rahul K." }
            ].map((item, index) => (
              <div key={`duplicate-${index}`} className="highlight-item">
                <img src={item.img} alt={item.name} />
                <p>"{item.quote}"</p>
                <span>- {item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default NewHome;