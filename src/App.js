import './App.css';

import React , { useState }  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp/SignUpPage';
import Login from './components/Login/LoginPage';
import HomePage from './components/Home/HomePage';
import GuestNavbar from './components/Navbar/GuestNavbar';
import UserNavbar from './components/Navbar/UserNavbar';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
      {isLoggedIn ? (
        <UserNavbar />
      ) : (
        <GuestNavbar />
      )}
        <Routes>  
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/" element={<HomePage />} />
          {/* Other routes can be added here */}
        </Routes>
      </div>
    </Router>
  );
}


export default App;
