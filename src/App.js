import './App.css';
import React , { useState,useEffect,createContext }  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp/SignUpPage';
import Login from './components/Login/LoginPage';
import HomePage from './components/Home/HomePage';
import GuestNavbar from './components/Navbar/GuestNavbar';
import UserNavbar from './components/Navbar/UserNavbar';
import Cart from './components/Cart/CartPage';
import CheckoutPage from './components/CheckoutPage/CheckoutPage';
import { useCookies } from 'react-cookie';

export const NameContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cookies] = useCookies(['token']);
  const [username, setUsername] = useState(null);
  const [itemId,setItemId] = useState(null);
  useEffect(() => {
    if (cookies.token) {
      setIsLoggedIn(true);
      setUsername(cookies.username);
      setItemId(cookies.itemId);
    }
  }, [cookies.token]);
  
  return (
    <Router>
      <div className="App">
      {isLoggedIn ? (
        <UserNavbar setIsLoggedIn={setIsLoggedIn} username={username} />
      ) : (
        <GuestNavbar />
      )}
        <Routes>  
        <Route path="/CheckoutPage/:username" element={<CheckoutPage username={username} />} />
        {/* <Route path="/CheckoutPage/:username" element={<CheckoutPage username={username} itemId={itemId} />} /> */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}  />} />
        <Route path="/mycart" element={<Cart username={username}  />} />
        <Route path="/" element={<HomePage cartItems={cartItems} setCartItems={setCartItems} username={username}  />} />
          {/* Other routes can be added here */}
        </Routes>
      </div>
    </Router>
  );
}


export default App;
