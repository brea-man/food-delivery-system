import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Footer = ({ onLoginClick }) => {
  const { user } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>🔗 Quick Links</h3>
            <nav className="footer-nav">
              <a href="#home" className="nav-link">Home</a>
              <a href="#services" className="nav-link">Services</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#contact" className="nav-link">Contact</a>

            </nav>
          </div>
          <div className="footer-section">
            <h3>📞 Contact Info</h3>
            <div className="footer-contact">
              <p>📧 support@fooddelivery.com</p>
              <p>📞 (123) 456-7890</p>
              <p>📍 123 Food Street, FC 12345</p>
            </div>
          </div>
          <div className="footer-section">
            <h3>🌐 Follow Us</h3>
            <div className="footer-social">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
          <div className="footer-section">
            <h3>📧 Newsletter</h3>
            <p>Subscribe to get updates on new restaurants and offers.</p>
            <div className="newsletter">
              <input type="email" placeholder="Enter your email" className="newsletter-input" />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy;2025 Food Delivery System. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
