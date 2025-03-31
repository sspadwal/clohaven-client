import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

function AdminDashboard({ token }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    images: ['']
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, ordersRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/api/products`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/admin/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/categories`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, API_URL]);

  const addProduct = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/products`,
        newProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts([...products, response.data.product]);
      setNewProduct({ name: '', price: '', description: '', category: '', images: [''] });
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(
          `${API_URL}/api/products/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product');
      }
    }
  };

  if (loading) return <div className="admin-dashboard-loading">Loading Dashboard...</div>;
  if (error) return <div className="admin-dashboard-error">Error: {error}</div>;

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>

      <nav className="admin-dashboard-tabs">
        <button
          className={`admin-dashboard-tab ${activeTab === 'products' ? 'admin-dashboard-tab-active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`admin-dashboard-tab ${activeTab === 'orders' ? 'admin-dashboard-tab-active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`admin-dashboard-tab ${activeTab === 'add' ? 'admin-dashboard-tab-active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add Product
        </button>
      </nav>

      <main className="admin-dashboard-main">
        {activeTab === 'products' && (
          <section className="admin-dashboard-products">
            <h2>Product Management</h2>
            <div className="admin-dashboard-product-grid">
              {products.map(product => (
                <div key={product._id} className="admin-dashboard-product-card">
                  <div className="admin-dashboard-product-image">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/150'}
                      alt={product.name}
                    />
                  </div>
                  <div className="admin-dashboard-product-info">
                    <h3>{product.name}</h3>
                    <p className="admin-dashboard-product-price">₹{product.price}</p>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="admin-dashboard-delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'orders' && (
          <section className="admin-dashboard-orders">
            <h2>Order Management</h2>
            <div className="admin-dashboard-order-list">
              {orders.map(order => (
                <div key={order._id} className="admin-dashboard-order-card">
                  <div className="admin-dashboard-order-header">
                    <span className="admin-dashboard-order-id">Order #{order._id.substring(0, 8)}</span>
                    <span className="admin-dashboard-order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="admin-dashboard-order-total">₹{order.total}</span>
                  </div>
                  <div className="admin-dashboard-order-user">
                    Customer: {order.user?.email || 'Guest'}
                  </div>
                  <ul className="admin-dashboard-order-items">
                    {order.items.map(item => (
                      <li key={item.product?._id || item._id}>
                        {item.product?.name || 'Deleted Product'} -
                        ₹{item.price} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'add' && (
          <section className="admin-dashboard-add-product">
            <h2>Add New Product</h2>
            <form onSubmit={(e) => { e.preventDefault(); addProduct(); }}>
              <div className="admin-dashboard-form-group">
                <label>Product Name</label>
                <input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>
              <div className="admin-dashboard-form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="admin-dashboard-form-group">
                <label>Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  required
                  rows="3"
                />
              </div>
              <div className="admin-dashboard-form-group">
                <label>Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="admin-dashboard-form-group">
                <label>Image URL</label>
                <input
                  value={newProduct.images[0]}
                  onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                  required
                />
              </div>
              <button type="submit" className="admin-dashboard-submit-btn">
                Add Product
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;