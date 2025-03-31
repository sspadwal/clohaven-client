import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Checkout.css';

function Checkout({ token, updateCartCount }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'credit_card'
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const items = response.data.items || [];
        const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        
        setCart({
          items,
          total
        });
      } catch (err) {
        setError('Failed to load cart items');
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCart();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create order
      const orderResponse = await axios.post(
        `${API_URL}/api/orders`,
        {
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip
          },
          paymentMethod: formData.paymentMethod,
          items: cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
          }))
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear cart after successful order
      await axios.delete(`${API_URL}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrderDetails(orderResponse.data);
      setOrderSuccess(true);
      updateCartCount(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      console.error('Error placing order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="checkout-success">
        <div className="success-icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <p>Your order ID is: {orderDetails._id}</p>
        <p>We've sent a confirmation to {formData.email}</p>
        <div className="order-summary">
          <h3>Order Summary</h3>
          <ul>
            {orderDetails.items.map((item, index) => (
              <li key={index}>
                {item.product.name} - {item.quantity} x ₹{item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="total">Total: ₹{orderDetails.totalAmount.toFixed(2)}</p>
        </div>
        <button 
          onClick={() => navigate('/products')} 
          className="continue-shopping-btn"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {error && <div className="error-message">{error}</div>}
      
      <div className="checkout-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          {cart.items.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <ul className="cart-items">
                {cart.items.map((item, index) => (
                  <li key={index} className="cart-item">
                    <div className="item-image">
                      <img 
                        src={item.product.images?.[0] || 'https://via.placeholder.com/150'} 
                        alt={item.product.name} 
                      />
                    </div>
                    <div className="item-details">
                      <h3>{item.product.name}</h3>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="order-total">
                <p>Total: ₹{cart.total.toFixed(2)}</p>
              </div>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Shipping Information</h2>
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="zip">ZIP Code</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={formData.paymentMethod === 'credit_card'}
                  onChange={handleInputChange}
                />
                Credit Card
              </label>
              
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={handleInputChange}
                />
                PayPal
              </label>
              
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                />
                Cash on Delivery
              </label>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="place-order-btn"
            disabled={loading || cart.items.length === 0}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;