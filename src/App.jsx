import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import NewHome from './pages/NewHome';
import Products from './pages/Products';
import Login from './components/Login';
import Signup from './components/Signup';
import Cart from './components/Cart';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import Checkout from './components/Checkout'; // Add Checkout import
import SingleProduct from './components/SingleProduct';
import './styles/App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const decoded = JSON.parse(atob(savedToken.split('.')[1]));
        setToken(savedToken);
        setRole(decoded.role);
        setUsername(decoded.username);
      } catch (error) {
        console.error('Invalid token in localStorage:', error);
        localStorage.removeItem('token');
        setToken('');
        setRole('');
        setUsername('');
      }
    }
  }, []);

  const fetchCartCount = async () => {
    if (!token) {
      setCartItemCount(0);
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItemCount(response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(selectedCategory
            ? `${API_URL}/api/products?category=${selectedCategory}`
            : `${API_URL}/api/products`)
        ]);
        setCategories(categoriesRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, API_URL]);

  const login = (email, password, navigate, setError) => {
    axios.post(`${API_URL}/api/auth/login`, { email, password })
      .then(response => {
        const token = response.data.token;
        localStorage.setItem('token', token);
        setToken(token);
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setRole(decoded.role);
        setUsername(decoded.username);
        fetchCartCount();
        navigate(decoded.role === 'admin' ? '/admin' : '/products');
      })
      .catch(error => {
        const errorMsg = error.response?.data?.message || 'Error logging in';
        setError(errorMsg);
        console.error('Login failed:', errorMsg);
      });
  };

  const signup = (username, email, password, mobile, navigate, setMessage) => {
    axios.post(`${API_URL}/api/auth/signup`, { username, email, password, mobile })
      .then(response => {
        setMessage(response.data.message);
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch(error => {
        const errorMsg = error.response?.data?.message || 'Error signing up';
        setMessage(errorMsg);
        console.error('Signup failed:', errorMsg);
      });
  };

  const logout = (navigate) => {
    localStorage.removeItem('token');
    setToken('');
    setRole('');
    setUsername('');
    setCartItemCount(0);
    navigate('/login');
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      return;
    }

    try {
      await axios.post(`${API_URL}/api/cart`, { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCartCount(); // Update cart count after adding item
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const ProtectedRoute = ({ children, isAdminRoute = false }) => {
    const location = useLocation();

    if (!token) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (isAdminRoute && role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              role={role}
              token={token}
              username={username}
              logout={logout}
              cartItemCount={cartItemCount}
            />
          }
        >
          <Route index element={<NewHome token={token} addToCart={addToCart} />} />
          <Route path="login" element={<Login login={login} />} />
          <Route path="signup" element={<Signup signup={signup} />} />
          <Route
            path="products"
            element={
              <Products
                products={products}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                addToCart={addToCart}
                token={token}
                loading={loading}
              />
            }
          />
          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <Cart token={token} updateCartCount={fetchCartCount} />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <Checkout token={token} updateCartCount={fetchCartCount} />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile token={token} onLogout={logout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute isAdminRoute>
                <AdminDashboard token={token} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <SingleProduct
                addToCart={addToCart}
                token={token}
              />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;