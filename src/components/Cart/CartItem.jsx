import React from 'react';
import './CartPage.css'
import { FaMinus, FaPlus } from 'react-icons/fa'; // Import icons from react-icons library


function CartItem({ item, cartItems, setCartItems}) {

    const handleRemoveFromCart = (itemId) => {
        // Call the removeFromCart function passed from the parent component
        removeFromCart(itemId);
      };
      
      const handleIncrementQuantity = (itemId) => {
        // Call the updateQuantity function passed from the parent component
        updateQuantity(itemId, 1);
      };
    
      const handleDecrementQuantity = (itemId) => {
        const currentItem = cartItems.find(item => item._id === itemId);
        if (currentItem.quantity === 1) {
            // If the quantity is 1, remove the item from the cart
            removeFromCart(itemId);
        } else if (currentItem.quantity > 1) {
            // Call the updateQuantity function passed from the parent component
            updateQuantity(itemId, -1);
        }
      };
    
      const updateQuantity = (itemId, newQuantity) => {
        setCartItems(prevItems => {
          return prevItems.map(item => {
            if (item._id === itemId) {
              return { ...item, quantity: item.quantity + newQuantity };
            }
            return item;
          });
        });
      };

      const removeFromCart = (itemId) => {
        const updatedCartItems = cartItems.filter((item) => item._id !== itemId);
        setCartItems(updatedCartItems);
      };
      
  return (
    <div className="cart-item">
      <img
        src={`data:image/jpeg;base64,${item.itemPicture}`} // Replace "jpeg" if needed
        alt={item.itemName} />
      <div className="item-details">
        <h3>{item.itemName}</h3>
        <p>Price: ${item.itemPrice}</p>
        <p className="quantity-buttons"> Quantity:
            <button onClick={() => handleDecrementQuantity(item._id)}><FaMinus className="icon" /></button>
            <span>{ item.quantity }</span>
            <button onClick={() => handleIncrementQuantity(item._id)}><FaPlus className="icon" /></button>
        </p>
        <button className="remove-button" onClick={() => handleRemoveFromCart(item._id)}>Remove from Cart</button>
      </div>
    </div>
  );
}

export default CartItem;
