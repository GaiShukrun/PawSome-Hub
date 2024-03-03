import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function GuestNavbar() {
  return (
    <nav className="navbar">
      
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Shop🏪</Link>
        </li>
        <li className="nav-item">
          <Link to="/signup" className="nav-link">Sign-Up📋</Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">Login🔐</Link>
        </li>
        {/* Add more navigation links as needed */}
      </ul>
    </nav>
  );
}

export default GuestNavbar;

