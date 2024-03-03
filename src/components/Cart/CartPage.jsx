import React from 'react';
import CartItem from './CartItem';
import './CartPage.css'


function CartPage({ cartItems, setCartItems }) {

  const totalPrice = cartItems.reduce((total, item) => total + item.itemPrice * item.quantity, 0);

  // Validate cartItems before mapping
  if (cartItems.length <= 0 || !Array.isArray(cartItems) || !cartItems) {
    return <div className="cart-page"> Your cart is empty!</div>;
  }
  
  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.map(item => (
          <CartItem key={item.id} item={item} cartItems={cartItems} setCartItems={setCartItems} />
        ))}
      </div>
      <div className="cart-total">Total Price: ${totalPrice.toFixed(2)}</div>
      <button className="checkout-button">Checkout</button>
    </div>
    
  );
}

export default CartPage;

