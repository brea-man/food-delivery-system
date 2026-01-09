import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Footer from "../components/Footer.jsx";
import HeaderNavbar from "../components/HeaderNavbar";
import "../assets/Landing.css";

export default function Landing() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, role);
  };
  const handleLoginClick = () => {
    setShowLoginForm(true);
  };
  useEffect(() => {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          // Restart animation
          targetSection.style.animation = 'none';
          setTimeout(() => {
            targetSection.style.animation = '';
          }, 10);
        }
      });
    });
  }, []);
  return (
    <div className="landing-container">
      <HeaderNavbar onLoginClick={handleLoginClick} />
      <main className="landing-main">
        <section id="home" className="hero-section">
          <div className="hero-container">
            <h1 className="landing-title">Welcome to Food Delivery System</h1>
            <p className="landing-description">Experience fast, reliable, and smart food delivery right at your fingertips. Order from your favorite restaurants with ease and convenience.</p>
            {!user && (
              <button onClick={() => setShowLoginForm(true)} className="cta-button">Get Started</button>
            )}
          </div>
        </section>
        <section id="services" className="features-section">
          <div className="features-container">
            <h2 className="features-title">Why Choose Us?</h2>
            <div className="features-grid">
              <div className="feature-item feature-fast">
                <div className="feature-icon">🚀</div>
                <h3>Fast Delivery</h3>
                <p>Get your food delivered quickly and hot, every time.</p>
              </div>
              <div className="feature-item feature-secure">
                <div className="feature-icon">🔒</div>
                <h3>Secure & Reliable</h3>
                <p>Your orders and data are protected with top-notch security.</p>
              </div>
              <div className="feature-item feature-smart">
                <div className="feature-icon">📱</div>
                <h3>Smart Ordering</h3>
                <p>Intelligent recommendations and easy-to-use interface.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="about-section">
          <div className="about-wrapper">
            <h2>About Us</h2>
            <div className="about-container">
              <div className="about-content">
                <ul>
                  <li>Dedicated to providing the best food delivery experience in our surroundings</li>
                  <li>Platform connects you with local restaurants, ensuring fast and reliable service</li>
                  <li>Founded in 2023, Food Delivery System has revolutionized the way people enjoy their favorite meals</li>
                  <li>Mission: make food delivery seamless, secure, and enjoyable for everyone</li>
                </ul>
              </div>
              <div className="about-content">
                <ul>
                  <li>Team of passionate food enthusiasts and tech experts collaborated togather</li>
                  <li>Partner with hundreds of restaurants across the city to bring diverse cuisines to your doorstep</li>
                  <li>Prioritize quality, speed, and customer satisfaction in everything we do</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section id="contact" className="contact-section">
          <div className="contact-container">
            <h2>Contact Us</h2>
            <p>Have questions? We're here to help! Reach out to our friendly support team.</p>
            <div className="contact-info">
              <div className="contact-item">
                <h3>📧 Email Support</h3>
                <p>support@fooddelivery.com</p>
              </div>
              <div className="contact-item">
                <h3>📞 Phone Support</h3>
                <p>(123) 456-7890</p>
                
              </div>
              <div className="contact-item">
                <h3>📍 Office Address</h3>
                <p>123 Food Street, FC 12345</p>
              </div>
            </div>
          </div>
        </section>

        {!user && showLoginForm && (
          <div className="modal-overlay" onClick={() => setShowLoginForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={() => setShowLoginForm(false)}>×</button>
              <form onSubmit={handleSubmit} className="login-form">
                <h2>Login to Your Account</h2>

                <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <select
               value={role}
          onChange={(e) => setRole(e.target.value)}
>
        <option value="" disabled>
         Role
        </option>
        <option value="admin">Admin</option>
        <option value="restaurant">Restaurant</option>
        </select>

                <button type="submit">Login</button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer onLoginClick={handleLoginClick} />
    </div>
  );
}
