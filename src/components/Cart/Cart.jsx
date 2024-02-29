import React from 'react';
import './Cart.css';
const Cart = ({ cartItems, removeFromCart ,  setCartItems}) => {
    
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
      const totalPrice = cartItems.reduce((acc, currentItem) => {
        return acc + currentItem.itemPrice * currentItem.quantity;
      }, 0);
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
    
  return (
    <div className="Cart">
      <h2>Your Cart <div className="total-price-box">
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
          </div></h2>
      {cartItems && cartItems.length > 0 ? (
        <div className="items">
          {cartItems.map((item) => (
            <div className="item-box" key={item._id}>
              <img
                src={`data:image/jpeg;base64,${item.itemPicture}`} // Replace "jpeg" if needed
                alt={item.itemName}
                width="200"
                height="200"
              />
              <h3>{item.itemName}</h3>
              <p>Price: ${Number(item.itemPrice).toFixed(2)}</p>
              <p>{item.itemDescription}</p>
              <div className="quantity-control">
            <button onClick={() => handleDecrementQuantity(item._id)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => handleIncrementQuantity(item._id)}>+</button>
        </div>
        <p>  </p>
        <button onClick={() => handleRemoveFromCart(item._id)}>Remove from Cart</button>
    </div>
          ))}
        
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;



