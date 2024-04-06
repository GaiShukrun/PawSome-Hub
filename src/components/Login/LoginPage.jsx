import React, { useState,useEffect,useContext } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import './NewLoginPage.css'
import { NameContext } from "../../App";
import { useCookies } from 'react-cookie';
import HomePage from '../Home/HomePage';
function Login({ setIsLoggedIn }) {

  const [error, setError] = useState(''); // Define error state

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  

  const navigate = useNavigate (); 
  const [cookies, setCookie] = useCookies(['token','username']);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3001/api/login', formData);
      console.log('Login successful:', response.data);
      setCookie('token', response.data.token, { path: '/' });
      // Handle successful login (redirect, display message, etc.)
      setCookie('username', formData.username.toString(), { path: '/' });
      setIsLoggedIn(true);
      // console.log(formData.username.toString());
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Set the error message
      }
      else {
      console.error('Login failed:', error.response.data);
      // Handle login failure (display error message, reset form, etc.)
      }
    }
  };

  return (
    <div className="login-page">
    <div className="login-container" >
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <br/>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br/>
        {error && <a className="login-error-message">{error}</a>}
        <br/>
        <button className="login-button" type="submit">Login</button>
        <br/>
        <a className="dont-have-account" href="/signup">Don't have an account?</a>
      </form>

      <div class="drops">
        <div class="drop drop-1"></div>
        <div class="drop drop-2"></div>
        <div class="drop drop-3"></div>
        <div class="drop drop-4"></div>
        <div class="drop drop-5"></div>
      </div>
      


  <div className="dog">
    <div className="ears"></div>
    
    <div className="body">
      <div className="eyes"></div>
      <div className="beard">
        <div className="mouth">
          <div className="tongue"></div>
        </div>
      </div>
      <div className="belt">
        <div className="locket"></div>
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
        <div className="dot dot4"></div>
        <div className="tag"></div>
      </div>
      <div className="stomach">
      </div>
      <div className="legs">
        <div className="left"></div>
        <div className="right"></div>
      </div>
    </div>
    <div className="tail">
    </div>
  </div>



  <div className="dog2">
    <div className="ears"></div>
    
    <div className="body">
      <div className="eyes"></div>
      <div className="beard">
        <div className="mouth">
          <div className="tongue"></div>
        </div>
      </div>
      <div className="belt">
        <div className="locket"></div>
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
        <div className="dot dot4"></div>
        <div className="tag"></div>
      </div>
      <div className="stomach">
      </div>
      <div className="legs">
        <div className="left"></div>
        <div className="right"></div>
      </div>
    </div>
    <div className="tail">
    </div>
  </div>
    </div>
    
    </div>
    
  );



}

export default Login;
