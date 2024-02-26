import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


function GuestNavbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </li>
        {/* Add more navigation links as needed */}
      </ul>
    </nav>
  );
}

export default GuestNavbar;
