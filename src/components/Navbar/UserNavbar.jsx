import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


function UserNavbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link">Logout</Link>
        </li>
        <li className="nav-item">
          <Link to="/myaccount" className="nav-link">My account</Link>
        </li>
        <li className="nav-item">
          <Link to="/mycart" className="nav-link">My cart</Link>
        </li>
        
        {/* Add more navigation links as needed */}
      </ul>
    </nav>
  );
}

export default UserNavbar;
