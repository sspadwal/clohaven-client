import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import LoginPrompt from '../components/LoginPrompt';
import '../styles/Products.css';

function Products({ products, categories, selectedCategory, setSelectedCategory, addToCart, token }) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleAddToCart = (productId) => {
    if (!token) {
      setShowLoginPrompt(true);
    } else {
      addToCart(productId);
    }
  };

  return (
    <div className="products-page">
      <h1>All Products</h1>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="category-select"
      >
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      {products.length > 0 ? (
        <ProductList products={products} addToCart={handleAddToCart} />
      ) : (
        <p>Loading products...</p>
      )}
      
      {showLoginPrompt && (
        <LoginPrompt onClose={() => setShowLoginPrompt(false)} />
      )}
    </div>
  );
}

export default Products;