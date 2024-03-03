import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useCookies } from 'react-cookie';

function UserNavbar({ setIsLoggedIn,username }) {
  const [, , removeCookie] = useCookies(['token']);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to remove this item from the cart?')){
      // Clear token from cookies
      removeCookie('token');
      // Update isLoggedIn state to false
      setIsLoggedIn(false);
      window.location.href = "/";
    }
    
  };
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Shop🏪</Link>
        </li>
        <li className="nav-item">
          {/* <Link to="/" className="nav-link">Logout</Link>
          <button  onClick={handleLogout}>Logout</button> */}
          <Link onClick={handleLogout} className="nav-link">Log-Out🔓</Link>
        </li>
        <li className="nav-item">
          <Link to="/myaccount" className="nav-link">{username} Account👤</Link>
        </li>
        <li className="nav-item">
          <Link to="/mycart" className="nav-link">{username} Cart🛒</Link>
        </li>
        {/* Add more navigation links as needed */}
      </ul>
    </nav>
  );
}

export default UserNavbar;
