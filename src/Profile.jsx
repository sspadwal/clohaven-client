import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile({ token, onLogout }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setOrders(response.data))
      .catch(error => console.log('Error fetching orders:', error));
  }, [token]);

  return (
    <div>
      <h2>Your Order History</h2>
      <button onClick={onLogout}>Logout</button>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order._id}>
            <h3>Order on {new Date(order.createdAt).toLocaleDateString()}</h3>
            <p>Total: ${order.total}</p>
            <ul>
              {order.items.map(item => (
                <li key={item.product._id}>
                  {item.product.name} - ${item.price} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default Profile;