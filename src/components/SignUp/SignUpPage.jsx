import React, { useState } from 'react';
import './NewSignUpPage.css';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen'


function SignUpPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const navigate = useNavigate (); 

  const [error, setError] = useState(''); // Define error state

  const [loading, setLoading] = useState(false); //loading page


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3001/api/signup', formData);
      console.log('Signup successful:', response.data);
      setLoading(false);
      navigate('/login');
      alert("Thanks for signing up, now you can log in!");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Set the error message
      } else {
        setError('An unexpected error occurred. Please try again.'); // Generic error message
      }
    }
  };
  
  return (
    <div className="signup-page">
      {loading && <LoadingScreen />}
      <div className="signup-container">
        
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
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
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <br/>
          {error && <a className="signup-error-message">{error}</a>}
          <br/>
          <button className="signup-button" type="submit">Sign Up</button>
          <br/>
          <a className="already-have-account" href="/login">Already have an account?</a>
        </form> 

        <div className="drops">
          <div className="drop drop-1"></div>
          <div className="drop drop-2"></div>
          <div className="drop drop-3"></div>
          <div className="drop drop-4"></div>
          <div className="drop drop-5"></div>
        </div>
      

      <div className="cat-container">
        <div className="cat-shadow"></div>
        <div className="cat-mug"></div>
        <div className="cat">
          <ul className="cat-eyes">
            <li></li>
            <li></li>
          </ul>
          <div className="cat-mouth"></div>
        </div>
      </div>

      <div className="cat2-container">
        <div className="cat-shadow"></div>
        <div className="cat-mug"></div>
        <div className="cat">
          <ul className="cat-eyes">
            <li></li>
            <li></li>
          </ul>
          <div className="cat-mouth"></div>
        </div>
      </div>

      </div>
    </div>    
    
  );
}

export default SignUpPage;
