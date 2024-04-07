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
import MyAccount from './components/myaccount/myaccount';
import { useCookies } from 'react-cookie';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


export const NameContext = createContext();

const initialOptions = {
  "client-id": "AVlnYkR20Xhf1CYGDGCYCs0lz_qL298_xHiuzMux-hfPmQUaKTvKBJSgoUeJkG_oKaEpKmtrJh8dmYc5",
  currency: "USD",
  intent: "capture",
};

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
    <PayPalScriptProvider options={initialOptions}>
      <Router>
        <div className="App">
        {isLoggedIn ? (
          <UserNavbar setIsLoggedIn={setIsLoggedIn}
                      username={username} />
        ) : (
          <GuestNavbar />
        )}
          <Routes>  
          <Route path= "/myaccount" element={< MyAccount username = {username} />}/>
          <Route path="/CheckoutPage/:username" element={<CheckoutPage username={username} />} />
          {/* <Route path="/CheckoutPage/:username" element={<CheckoutPage username={username} itemId={itemId} />} /> */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}  />} />
          <Route path="/mycart" element={<Cart username={username}  />} />
          <Route path="/" element={<HomePage  cartItems={cartItems}
                                              setCartItems={setCartItems}
                                              username={username}  />} />
            {/* Other routes can be added here */}
          </Routes>
        </div>
      </Router>
    </PayPalScriptProvider>
  );
}


export default App;
