import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import './myaccount.css';
const MyAccount = ({ username }) => {
  const [formData, setFormData] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  
  const fetchFormData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/getFormData/${username}`);
      if (response.status === 200) {
        if(response.data.length >0){
        setFormData(response.data);
        }
      } else {
        console.error('Failed to fetch user form data');
      }
    } catch (error) {
      console.error('Error fetching user form data:', error);
    }
  };
  const fetchUserData = async () => {
    if(username !=null){
    console.log(username + '+++++++++++++++++++++++++++++++++++++++++')
    try {
       const response = await axios.get(`http://localhost:3001/api/search/${username}`);
       console.log(response.data);
      if (response.status === 200) {
        
           if(response.data){
        setUserInfo(response.data.user);
        console.log(response.data.user.email)
           }
           
        
      } else if (response.status === 404) {
        console.error('User not found');
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchFormData();
    fetchUserData();
  }, [username]);

  

  return (
    <div className="my-account-container">
      <h2>Welcome to {username}'s page</h2>
      <div>
        <h2>User Information</h2>
        <p>Email: {userInfo.email}</p>
        <p>Username: {userInfo.username}</p>
      </div>
      <div className="orders-container"> {/* Added container for orders */}
        {formData.length > 0 ? (
          formData.map((data, index) => (
            <div className="order-card" key={index}>
              <div className="order-title">Order ID: {data._id}</div>
              <div className="order-details">
                <p>OrderDate: {data.OrderDate}</p>
                <p>Address: {data.address}</p>
                <p >Items Ordered:</p>
                <ul>
                  {data.itemsCheckout.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p>No user form data found</p>
        )}
      </div>
    </div>
  );
};

export default MyAccount;