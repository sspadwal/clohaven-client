import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Cart.css';

function Cart({ token, updateCartCount }) {
  const [cart, setCart] = useState({ items: [], totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const items = response.data.items || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        setCart({
          items,
          totalItems
        });
        updateCartCount(totalItems);
      } catch (err) {
        setError('Failed to load cart');
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCart();
  }, [token, updateCartCount, API_URL]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setLoading(true);
      await axios.put(
        `${API_URL}/api/cart/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedItems = cart.items.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );

      const updatedTotal = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      setCart({
        items: updatedItems,
        totalItems: updatedTotal
      });
      updateCartCount(updatedTotal);
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Error updating quantity:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedItems = cart.items.filter(item => item.product._id !== productId);
      const updatedTotal = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      setCart({
        items: updatedItems,
        totalItems: updatedTotal
      });
      updateCartCount(updatedTotal);
    } catch (err) {
      setError('Failed to remove item');
      console.error('Error removing item:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/api/cart/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart({ items: [], totalItems: 0 });
      updateCartCount(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
      console.error('Error during checkout:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity, 0
  );

  return (
    <div className="cart">
      <h1>Your Cart</h1>
      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading-overlay">Loading...</div>}

      {cart.items.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.product?._id} className="cart-item">
                <img
                  src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                  alt={item.product?.name || 'Product'}
                  className="cart-image"
                />
                <div className="cart-item-details">
                  <h3>{item.product?.name || 'Product'}</h3>
                  <p className="price">₹{(item.product?.price || 0).toFixed(2)}</p>

                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      disabled={loading || item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      disabled={loading}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <p className="item-total">
                    ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </p>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.product._id)}
                    disabled={loading}
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Items:</span>
              <span>{cart.totalItems}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={checkout}
              disabled={loading || cart.items.length === 0}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;