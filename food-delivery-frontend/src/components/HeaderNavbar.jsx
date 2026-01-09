import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/Landing.css"; // Corrected import path

const HeaderNavbar = ({ onLoginClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="header-navbar">
      {/* LEFT */}
      <h1 className="header-title">
       <span className="header-icon" role="img" aria-label="delivery">
  🛵
</span>
   Food Deliver System
      </h1>

      {/* RIGHT */}
      <nav className="header-nav">
        <a href="#home" className="nav-link">Home</a>
        <a href="#services" className="nav-link">Services</a>
        <a href="#about" className="nav-link">About</a>
        <a href="#contact" className="nav-link">Contact</a>
        {!user ? (
          <button className="nav-link login-btn" onClick={onLoginClick}>Login</button>
        ) : (
          <>
            
          </>
        )}
      </nav>
    </header>
  );
};

export default HeaderNavbar;
