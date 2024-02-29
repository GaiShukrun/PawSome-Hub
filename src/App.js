import './App.css';

import React , { useState }  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp/SignUpPage';
import Login from './components/Login/LoginPage';
import HomePage from './components/Home/HomePage';
import GuestNavbar from './components/Navbar/GuestNavbar';
import UserNavbar from './components/Navbar/UserNavbar';
import Cart from './components/Cart/Cart';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const removeFromCart = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCartItems);
  };
  return (
    <Router>
      <div className="App">
      {isLoggedIn ? (
        <UserNavbar />
      ) : (
        <GuestNavbar />
      )}
        <Routes>  
        <Route
            path="/"
            element={<HomePage cartItems={cartItems} setCartItems={setCartItems} />}
          />
          {/* Pass cartItems as props to Cart */}
          <Route path="/mycart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} setCartItems={setCartItems} />} />
          
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        {/* <Route path="/" element={<HomePage />} /> */}
          {/* Other routes can be added here */}
        </Routes>
      </div>
    </Router>
  );
}


export default App;
