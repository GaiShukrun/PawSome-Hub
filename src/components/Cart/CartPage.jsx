import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartPage.css';

const CartPage = ({ username }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(''); // Define error state
  const [errorItemId, setErrorItemId] = useState(null);




  const increaseQuantity = async (itemId) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/cart/increaseQuantity/${itemId}`);
      if (response.status === 200) {
        // Update the cart items state after increasing the quantity
        const updatedCartItems = cartItems.map(item =>
          item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updatedCartItems);
      }
      if (response.status == 202){
        setErrorItemId(itemId);
        setError(response.data.error);
        setTimeout(() => {
          setErrorItemId(null);
          setError('');
        }, 2000); // Clear error after 2 seconds
      }
    } catch (error) {
      if (error.response && error.response.status === 202) {
        // Handle the case where the item amount exceeds the available quantity
        alert('Cannot add more of this item. Exceeds available quantity.');
      } else {
        console.error('Error increasing quantity:', error);
      }
    }
  };
  
  
  const decreaseQuantity = async (itemId) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/cart/decreaseQuantity/${itemId}`);
      if (response.status === 200) {
        // Update the cart items state after decreasing the quantity
        const updatedCartItems = cartItems.map(item =>
          item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
        setCartItems(updatedCartItems.filter(item => item.quantity > 0)); // Refresh
      }
      if (response.status === 201){
        DeleteItemCart(itemId);
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };
  
  const DeleteItemCart = async (itemId) => {
    try {
      if (window.confirm('Are you sure you want to remove this item from the cart?')){
        const response = await axios.put(`http://localhost:3001/api/cart/removeItem/${itemId}`);
        if (response.status === 200) {
          const updatedCartItems = cartItems.filter(item => item._id !== itemId);
          setCartItems(updatedCartItems);
        }
      }
    }
    catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  useEffect(() => {
    // Calculate total price whenever cartItems change
    let total = 0;
    cartItems.forEach(item => {
      total += item.itemPrice * item.quantity;
    });
    setTotalPrice(total);
  }, [cartItems]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Fetch cart items from the server
        const response = await fetch(`http://localhost:3001/api/cart/${username}`);
        if (!response.ok) {
                throw new Error('Failed to fetch featured items');
              }
              const data = await response.json();
        setCartItems(data);
        
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems(); // Fetch cart items when component mounts
  }, [username]); // Fetch cart items whenever the username changes

  
 
  return (
    <div>
      <h2>My Cart</h2>
      {totalPrice > 0 ? (
        <div>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="cart-item-details">
                  <img
                    src={'/images/' + item.itemPicture}
                    alt={item.itemName}
                  />
                  <div>
                    <h3>{item.itemName}</h3>
                    <p>Price: ${item.itemPrice}</p>
                  </div>
                </div>
                <div className="quantity-control">
                  {errorItemId === item._id && (
                    <div className="error-message">{error}</div>
                  )}
                  <button onClick={() => decreaseQuantity(item._id)}>-</button>
                  <p>Quantity: {item.quantity}</p>
                  <button onClick={() => increaseQuantity(item._id)}>+</button>
                  <button onClick={() => DeleteItemCart(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total">Total Price: ${totalPrice.toFixed(2)}</div>
          <button className="checkout-button">Checkout</button>
        </div>
      ) : (
        <div>
          <h4>Your cart is empty.</h4>
          <p>Click <a href="/">here</a> to start shopping.</p>
        </div>
      )}
    </div>
  );
    
};

export default CartPage;
