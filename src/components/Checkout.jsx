import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../styles/Checkout.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ token, cart, formData, setOrderSuccess, setOrderDetails, setError, setLoading, clearCart }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Creating payment intent...');
      const { data: { clientSecret } } = await axios.post(
        `${API_URL}/api/payments/create-payment-intent`,
        { amount: Math.round(cart.total * 100) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Payment intent created:', clientSecret);

      console.log('Confirming payment...');
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.name,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zip,
            },
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status !== 'succeeded') {
        throw new Error('Payment not completed');
      }
      console.log('Payment succeeded:', result.paymentIntent.id);

      console.log('Creating order...');
      console.log('Form data:', formData);
      console.log('Cart items:', cart.items);
      const orderData = {
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        paymentMethod: formData.paymentMethod,
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total: cart.total,
        paymentStatus: 'paid',
        paymentId: result.paymentIntent.id,
      };
      console.log('Order data being sent:', JSON.stringify(orderData, null, 2));

      const orderResponse = await axios.post(
        `${API_URL}/api/orders`,
        orderData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      console.log('Order created:', orderResponse.data._id);

      console.log('Clearing cart...');
      await clearCart();

      setOrderDetails(orderResponse.data);
      setOrderSuccess(true);
    } catch (err) {
      console.error('Checkout error:', err);
      console.log('Error response from server:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Shipping Information</h2>
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => formData.setFormData({ ...formData, name: e.target.value })}
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
          onChange={(e) => formData.setFormData({ ...formData, email: e.target.value })}
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
          onChange={(e) => formData.setFormData({ ...formData, address: e.target.value })}
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
            onChange={(e) => formData.setFormData({ ...formData, city: e.target.value })}
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
            onChange={(e) => formData.setFormData({ ...formData, state: e.target.value })}
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
            onChange={(e) => formData.setFormData({ ...formData, zip: e.target.value })}
            required
          />
        </div>
      </div>

      <h3>Payment Details</h3>
      <div className="form-group">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }}
        />
      </div>

      <button
        type="submit"
        className="place-order-btn"
        disabled={!stripe || !elements || formData.loading}
      >
        {formData.loading ? 'Processing...' : `Pay ₹${cart.total.toFixed(2)}`}
      </button>
    </form>
  );
}

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
    paymentMethod: 'credit_card',
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const clearCart = async () => {
    try {
      const url = `${API_URL}/api/cart/clear`;
      console.log('Sending DELETE request to:', url);
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Clear cart response:', response.data, 'Status:', response.status);
      
      // Check for the exact expected message
      if (response.status === 200 && response.data.message === 'Cart cleared successfully') {
        setCart({ items: [], total: 0 });
        updateCartCount(0);
        console.log('Cart cleared successfully in frontend');
      } else if (response.status === 404 && response.data.message === 'Cart not found') {
        setCart({ items: [], total: 0 });
        updateCartCount(0);
        console.log('Cart not found, treated as cleared in frontend');
      } else {
        throw new Error(`Unexpected response from clear cart endpoint: ${JSON.stringify(response.data)}`);
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart after payment. Please try refreshing.');
      throw err;
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = response.data.items || [];
        const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        setCart({ items, total });
        console.log('Cart fetched:', { items, total });
      } catch (err) {
        setError('Failed to load cart items');
        console.error('Cart fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchCart();
  }, [token, API_URL]);

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
                {item.product.name || 'Product'} - {item.quantity} x ₹{item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="total">Total: ₹{orderDetails.total.toFixed(2)}</p>
        </div>
        <button onClick={() => navigate('/products')} className="continue-shopping-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

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

        <Elements stripe={stripePromise}>
          <CheckoutForm
            token={token}
            cart={cart}
            formData={{ ...formData, setFormData, loading }}
            setOrderSuccess={setOrderSuccess}
            setOrderDetails={setOrderDetails}
            setError={setError}
            setLoading={setLoading}
            clearCart={clearCart}
          />
        </Elements>
      </div>
    </div>
  );
}

export default Checkout;