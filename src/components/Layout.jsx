import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/Layout.css';

function Layout({ role, token,username, cartItemCount, logout }) {
  console.log('Layout props:', { role, token, username  });
  return (
    <div className="layout">
      <Navbar role={role} token={token} username={username} logout={logout} cartItemCount={cartItemCount}/>
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;