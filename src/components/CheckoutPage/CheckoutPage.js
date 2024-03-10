// CheckoutPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './CheckoutPage.css'
import emailjs from 'emailjs-com';
///service id :service_dnd346u
///template id: template_6t47veg
const CheckoutPage = ({ username }) => {
    const [cookies] = useCookies(['itemId']);
    const itemId = cookies.itemId;
    const location = useLocation();
    const flag = location.state?.flag;
    const [reloadFlag, setReloadFlag] = useState(false); // Manage reload flag state

    useEffect(() => {
      if (!flag && reloadFlag) {
        window.location.reload();
        setReloadFlag(true); // Update reload flag after reloading once
      }
    }, []); // 
    
    // const reloadflag = false
    // if(!flag && reloadflag){
    //     window.location.reload();
    //     reloadflag = true;
    // }

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        address: ''
      });
      
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
            const itemDescription = (items, flag) => {
                if (flag) {
                    return items.map(item => `${item.itemName} : ${item.quantity} X ${item.itemPrice} = ${item.itemPrice * item.quantity}`).join('\n');
                } else {
                    return items.map(item => `${item.itemName} : 1 X ${item.itemPrice} = ${item.itemPrice}`).join('\n');
                }
            };
          const formDataWithItems = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cvc: formData.cvc,
            address: formData.address
          };
      
          let url;
        //   let itemDescription;
      
          if (flag) {
            // console.log("BBBBBBBBB")
            url = `http://localhost:3001/api/carts/${username}`;
            // itemDescription = (item) => `${item.itemName} : ${item.quantity} X ${item.itemPrice} = ${item.itemPrice * item.quantity}`;
          } else {
            url = `http://localhost:3001/api/Buynow/${itemId}`;
            // itemDescription = (item) => `${item.itemName} : 1 X ${item.itemPrice} = ${item.itemPrice}`;
          }
      
          const response = await axios.get(url);
        //   1
        //   const fetchedItems = response.data;
        const fetchedItems = Array.isArray(response.data) ? response.data : [response.data];
        
           
          
      //2
        //    formDataWithItems.itemsCheckout = itemDescription(fetchedItems);
        formDataWithItems.itemsCheckout = itemDescription(fetchedItems, flag);
          
        
          const userResponse = await axios.get(`http://localhost:3001/api/search/${username}`);
          const user = userResponse.data.user;
          console.log(user.email)
        
          const saveResponse = await axios.post('http://localhost:3001/api/saveFormData', formDataWithItems);
          const templateParams = {
            to_email: user.email,
            to_name: formDataWithItems.firstName + ' ' + formDataWithItems.lastName,
            message: formDataWithItems.itemsCheckout
          };
          sendEmail(templateParams);
          if (saveResponse.status === 201) {
            console.log('Form data saved successfully');
            // Optionally, handle successful submission (e.g., redirect)
          }
        } catch (error) {
          console.error('Error saving form data:', error);
          // Handle errors (e.g., display error message)
        }

      };
      const sendEmail = (templateParams) => {
        
        emailjs.send('service_dnd346u', 'template_6t47veg', templateParams, 'A2IZK0tl7FBZIOKIs')
          .then((response) => {
            console.log('Email sent successfully:', response);
          })
          .catch((error) => {
            console.error('Email sending failed:', error);
          });
      };
      
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItem = async () => {
        console.log(itemId + 'TTTTTTTTTTTTTTTTTTTTTTTTT')
      try {
        const url = flag
          ? `http://localhost:3001/api/cart/${username}`
          : `http://localhost:3001/api/get-featured-items/${itemId}`;
        const response = await axios.get(url);
        
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setItems(data);
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };
    fetchItem();
   
  }, [username, itemId, flag]);
  return (
    <div>
      <h2>Checkout</h2>
      {items && (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            required
            pattern="[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}"
            placeholder="XXXX XXXX XXXX XXXX"
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date (MM/YY):</label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            required
            pattern="[0-9]{2}/[0-9]{2}"
            placeholder="MM/YY"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvc">CVC:</label>
          <input
            type="text"
            id="cvc"
            name="cvc"
            value={formData.cvc}
            onChange={handleInputChange}
            required
            pattern="[0-9]{3}"
            placeholder="XXX"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      )}
      <div className="items">
        {items.map((item) => (
          <div className="item-box" key={item._id}>
            <h3>{item.itemName}</h3>
            <img
              src= {'/images/' + item.itemPicture} // Replace "jpeg" if needed
              alt={item.itemName}
            />
            <div className="item-details">  
              <p>Price: ${Number(item.itemPrice).toFixed(2)}</p>
              <p style={{ fontSize: '14px',maxHeight: '83px', overflowY: 'auto' }}>{item.itemDescription}</p>
            </div>


          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutPage;
