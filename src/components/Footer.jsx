import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section brand">
          <h3>Clothing Haven</h3>
          <p className="tagline">Timeless Fashion, Modern Elegance</p>
          <div className="social-links">
            {[
              { href: "https://facebook.com", icon: "fab fa-facebook-f", label: "Facebook" },
              { href: "https://instagram.com", icon: "fab fa-instagram", label: "Instagram" },
              { href: "https://twitter.com", icon: "fab fa-twitter", label: "Twitter" },
              { href: "https://pinterest.com", icon: "fab fa-pinterest-p", label: "Pinterest" }
            ].map((social, index) => (
              <a 
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="social-icon"
              >
                <i className={social.icon}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-section categories">
          <h4>Shop by Category</h4>
          <ul>
            <li>Men</li>
            <li>Women</li>
            <li>Kids</li>
            <li>Accessories</li>
          </ul>
        </div>

        <div className="footer-section support">
          <h4>Support</h4>
          <ul>
            <li>Returns</li>
            <li>Shipping</li>
            <li>FAQ</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h4>Contact Us</h4>
          <div className="contact-details">
            <p><i className="fas fa-envelope"></i> support@clothinghaven.com</p>
            <p><i className="fas fa-phone"></i> +91 98765 43210</p>
            <p><i className="fas fa-map-marker-alt"></i> Mumbai, India</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright">© {new Date().getFullYear()} Clothing Haven</p>
          <div className="payment-methods">
            <i className="fab fa-cc-visa payment-icon" title="Visa"></i>
            <i className="fab fa-cc-mastercard payment-icon" title="Mastercard"></i>
            <i className="fab fa-cc-paypal payment-icon" title="Paypal"></i>
            <i className="fas fa-wallet payment-icon" title="UPI"></i> {/* Using wallet as a proxy for UPI */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;