// CheckoutPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation,useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './NewCheckoutPage.css'
import AnimatedButton from './AnimatedButton'
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import emailjs from 'emailjs-com';
import {PayPalButtons} from "@paypal/react-paypal-js";
import { toBeRequired } from '@testing-library/jest-dom/dist/matchers';

///service id :service_dnd346u
///template id: template_6t47veg
const CheckoutPage = ({ username }) => {
    const [cookies] = useCookies(['itemId']);
    const itemId = cookies.itemId;
    const location = useLocation();
    const flag = location.state?.flag;
    // const [reloadFlag, setReloadFlag] = useState(false); // Manage reload flag state
    const [paypalCheckout, setIsPaypalCheckout] = useState(true);
    const [loading, setLoading] = useState(true); //loading page
    const navigate = useNavigate (); 


    useEffect(() => {
      if (cookies.itemId == null) {
        window.location.reload();
      }
    },[]); // 
    // if (cookies.itemId == null) {
    //   window.location.reload();
    // }
    
    // const reloadflag = false
    // if(!flag && reloadflag){
    //     window.location.reload();
    //     reloadflag = true;
    // }

    const [isFormValid, setIsFormValid] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        cardNumber: '',
        expiryDate: '',
        cvc: ''
      });
      
      const handleSubmit = async (e) => {
        console.log("flag: ",flag);
        e.preventDefault();
  
        if(flag){ //true = cart | false = buy now
          // Making sure the items that in the cart is still available to purchase
          const stillAvailable = await axios.get(`http://localhost:3001/api/checkout/${username}`);
          if (stillAvailable.status === 201){
            console.log(stillAvailable.data.message);
            alert (stillAvailable.data.message)
            window.location.href = "/";
            return;
          }
        }
        try {
          setLoading(true);
          const itemDescription = (items, flag) => {
            if (flag) { //true = cart | flase = buy now
              return items.map(item => `x${item.quantity} ${item.itemName}: $${item.itemPrice * item.quantity}\n`);
            }
            else {
              return items.map(item => `x1 ${item.itemName}: ${item.itemPrice}`);
            }
          };
          const formDataWithItems = {
            username: username,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cvc: formData.cvc
          };

          let url;
          if (flag) { //true = cart | false = buy now
            url = `http://localhost:3001/api/carts/${username}`;
          } else {
            url = `http://localhost:3001/api/Buynow/${itemId}`;
          }
      
          const response = await axios.get(url);
  
          const fetchedItems = Array.isArray(response.data) ? response.data : [response.data];
        
           
          
          //Email part
          formDataWithItems.itemsCheckout = itemDescription(fetchedItems, flag);
          const currentDate = new Date(); // Get current date
          
          formDataWithItems.OrderDate = currentDate.toLocaleDateString('en-GB');
        
          const userResponse = await axios.get(`http://localhost:3001/api/search/${username}`);
          const user = userResponse.data.user;
          console.log(user.email)
        
          const saveResponse = await axios.post('http://localhost:3001/api/saveFormData',formDataWithItems);
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
          setLoading(false);
          navigate('/');
          alert('Your Order has been placed successfully')
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

        // validation checks on the input value
        // console.log("HERE");
        // setIsFormValid (validateForm(formData));
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
        if(data.length >0){
        setItems(data);
        setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };
    fetchItem();
   
  }, [username, itemId, flag]);
  

  //////////////////////////////////// Total Price //////////////////////////////////
  function calculateTotalPrice(items) {
    return items.reduce((total, item) => total + item.itemPrice * (item.quantity||1), 0);
  }

  //////////////////////////////////// PAYPAL //////////////////////////////////

  const createOrder = (data, actions) => {  
    let url;
    if (flag) { //true = cart | false = buy now
      url = `http://localhost:3001/api/get-items-in-cart/${username}`;
    } else {
      url = `http://localhost:3001/api/get-item-buynow/${itemId}`;
    }          
    
    return axios.get(url)
      .then(response => {
        const responseData = response.data;
        let totalPrice = 0;
        if (flag){
          totalPrice = calculateTotalPrice(responseData);
        }
        else {
          totalPrice = responseData.itemPrice;
        }
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: totalPrice.toFixed(2), 
              },
            },
          ],
        });
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
        throw error;
      });
  };
  
  const handlePaymentApproval = async (data, actions) => {
    try {
      const orderDetails = await actions.order.capture();
      console.log("Payment successful:", orderDetails);
      const paypalOrderResponse = await axios.post("http://localhost:3001/api/save-order-paypal",{
        orderDetails,
        username,
        flag,
        itemId
      });

      console.log("Status:",paypalOrderResponse.status);
      console.log("Message:",paypalOrderResponse.data.message);

      if (paypalOrderResponse.status === 200){
        if (paypalOrderResponse.data.message)
          alert(paypalOrderResponse.data.message);
        else alert("Your order has been placed successfully!");
      }
      else if (paypalOrderResponse.status === 201){
        alert(paypalOrderResponse.data.message);
      }
      navigate('/');
    } catch (error) {
      console.error("Error capturing payment:", error);
      // Handle payment error
    }
  };




  // //////////////////////  validateForm  ////////////////////////////////////////
  // const validateForm = (formData) => {

  //   const { firstName, lastName, address, cardNumber, expiryDate, cvc } = formData;
  //   console.log(firstName,lastName,address,cardNumber,expiryDate,cvc);

  //   // Check if any of the required fields are empty
  //   if (!firstName || !lastName || !address || !cardNumber || !expiryDate || !cvc) {
  //     console.log("FALSE");
  //     return false;
  //   }
  
  //   // Check if the card number is valid (using a simple regex)
  //   const cardNumberRegex = /^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/;
  //   if (!cardNumberRegex.test(cardNumber)) {
  //     console.log("cardNumberRegex FALSE");

  //     return false;
  //   }
  
  //   // Check if the expiry date is valid (using a simple regex)
  //   const expiryDateRegex = /^[0-9]{2}\/[0-9]{2}$/;
  //   if (!expiryDateRegex.test(expiryDate)) {
  //     console.log("expiryDateRegex FALSE");

  //     return false;
  //   }

  //   const [month, year] = expiryDate.split('/');
  //   // Convert month to a number and check if it's between 1 and 12
  //   const monthNumber = parseInt(month, 10);
  //   if (monthNumber < 1 || monthNumber > 12) {
  //     console.log("monthNumber FALSE");

  //     return false;
  //   }
  
  //   // Check if the CVC is valid (using a simple regex)
  //   const cvcRegex = /^[0-9]{3}$/;
  //   if (!cvcRegex.test(cvc)) {
  //     console.log("cvc FALSE");
  //     return false;
  //   }
  
  //   // If all validations pass, return true
  //   console.log("TRUE");
  //   return true;
  // };


  const now = new Date();
  const nowYear = now.getFullYear(); // Current year
  const currentMonth = now.getMonth() + 1; // Current month (months are zero-based)


  return (
    <div className="checkout-container">
      {loading && <LoadingScreen />}
      <div className="form-container">
        <h2>Checkout</h2>
        {items && (
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Shipping information:</h3>
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
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

        <h3>Payment:</h3>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            onInput={(e) => {
              // Remove non-numeric characters from the input value
              const sanitizedValue = e.target.value.replace(/[^\d]/g, '');
              // Format the value with spaces for every 4 characters
              const formattedValue = sanitizedValue.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
              // Update the input value
              e.target.value = formattedValue;
              // Update the form data state
              handleInputChange(e);
          }}
            maxLength="19"
            pattern="[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}"
            required
            placeholder="XXXX XXXX XXXX XXXX"
          />
        </div>
        <div className="form-group">
          <div className="expiry-cvv-container">
            <div className="input-group">
              <label htmlFor="expiryDate">Expiry Date (MM/YY):</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                onInput={(e) => {
                  const sanitizedValue = e.target.value.replace(/[^\d]/g, '');
                  const formattedValue = sanitizedValue.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/'); // Insert '/' after every two numbers
                  const userEnteredMonth = parseInt(formattedValue.slice(0, 2), 10);
                  const userEnteredYear = parseInt(`20${formattedValue.slice(-2)}`, 10);
                  console.log(userEnteredMonth,userEnteredYear,nowYear,nowYear+10,currentMonth);
                  if (
                    userEnteredMonth < 1 ||
                    userEnteredMonth > 12 ||
                    userEnteredYear < nowYear ||
                    userEnteredYear > nowYear+10 ||
                    (userEnteredYear === nowYear && userEnteredMonth < currentMonth)

                  ) {
                    // User entered date is out of range, handle error or show warning
                    console.log('Date is out of range',formattedValue.length);
                    if(formattedValue.length === 5){
                      alert("Date is out of range");
                      e.target.value = '';
                    }
                    // You can also set a custom error message in the state and display it on the UI
                  } else {
                    e.target.value = formattedValue; // Update the input value with the formatted date
                    handleInputChange(e); // Call your input change handler
                  }                  
                }}               
                maxLength="5"
                required
                pattern="\d{2}/\d{2}"
                placeholder="MM/YY"
              />
            </div>
            <div className="input-group">
              <label htmlFor="cvc">CVC:</label>
              <input
                type="password"
                id="cvc"
                name="cvc"
                value={formData.cvc}
                onChange={handleInputChange}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^\d]/g, '');
                  handleInputChange(e);
                }}
                maxLength="3"
                required
                pattern="[0-9]{3}"
                placeholder="CVC"
              />
            </div>
          </div>
        </div>
            <AnimatedButton />
            <div className="separator">
              <hr className="line"/>
              <p>or pay using PayPal</p>
              <hr className="line"/>
            </div>
            <PayPalButtons
              createOrder={createOrder}
              onApprove={handlePaymentApproval}
              fundingSource="paypal"
              style={{
                color: "blue",
                layout: "vertical",
                height: 48,
                tagline: false,
                shape:"pill"
              }}
              />
          </form>
        )}
        
      </div>
      

      <div className="summary-container">
        <h3>Summary:</h3>
        <table className="summary-table">
          <thead>
            <tr>
              <th className="summary-header-left">Item</th>
              <th className="summary-header-mid">Price</th>
              <th className="summary-header-mid">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="summary-item">
                  <img src={'/images/' + item.itemPicture} alt={item.itemName} className="summary-img" />
                  <span>{item.itemName}</span>
                </td>
                <td className="summary-price">${Number(item.itemPrice).toFixed(2)}</td>
                <td className="summary-quantity">{flag ? item.quantity : 1}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td className="total-label" >Total:</td>
              <td className="total-price">${calculateTotalPrice(items).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>


    </div>
  );
  
};

export default CheckoutPage;