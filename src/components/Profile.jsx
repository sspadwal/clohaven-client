import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

function Profile({ token, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Sort orders by createdAt date (newest first)
        const sortedOrders = response.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [token, navigate, API_URL]);

  const handleLogout = () => {
    onLogout(navigate);
  };

  const formatOrderDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const formatOrderId = (id) => {
    return id.substring(18, 24).toUpperCase();
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Your Order History</h1>
        <button
          className="logout-button"
          onClick={handleLogout}
          aria-label="Logout"
        >
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button
            className="shop-now-button"
            onClick={() => navigate('/products')}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="orders-container">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{formatOrderId(order._id)}</h3>
                <p className="order-date">
                  {formatOrderDate(order.createdAt)}
                </p>
              </div>

              <div className="order-details">
                <div className="order-summary">
                  <p><strong>Status:</strong> {order.status || 'Completed'}</p>
                  <p><strong>Total:</strong> ₹{order.total?.toFixed(2) || '0.00'}</p>
                </div>

                <div className="order-items">
                  <h4>Items ({order.items.length}):</h4>
                  <ul>
                    {order.items.map(item => (
                      <li key={item.product?._id || item._id} className="order-item">
                        <img
                          src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                          alt={item.product?.name || 'Deleted Product'}
                          className="order-image"
                          loading="lazy"
                        />
                        <div className="item-details">
                          <p className="item-name">
                            {item.product?.name || 'Deleted Product'}
                          </p>
                          <p className="item-price">
                            ₹{(item.price || 0).toFixed(2)} × {item.quantity}
                          </p>
                          <p className="item-total">
                            ₹{((item.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;