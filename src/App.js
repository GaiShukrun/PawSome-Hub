import './App.css';

import React , { useState }  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp/SignUpPage';
import Login from './components/Login/LoginPage';
import HomePage from './components/Home/HomePage';
import GuestNavbar from './components/Navbar/GuestNavbar';
import UserNavbar from './components/Navbar/UserNavbar';
import Cart from './components/Cart/CartPage';




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [activeUser, setActiveUser] = useState('');



  return (
    <Router>
      <div className="App">
      {isLoggedIn ? (
        <UserNavbar activeUser={activeUser}/>
      ) : (
        <GuestNavbar />
      )}
        <Routes>  
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setActiveUser={setActiveUser}/>} />
        <Route path="/mycart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/" element={<HomePage cartItems={cartItems} setCartItems={setCartItems} />} />
          {/* Other routes can be added here */}
        </Routes>
      </div>
    </Router>
  );
}


export default App;
