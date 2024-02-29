// import React from 'react';
// import '../Home/HomePage.css'; // Assuming the CSS styles are applicable

// const Cart = ({ cartItems }) => {
//   const totalPrice = cartItems.reduce((total, item) => total + item.itemPrice, 0);

//   return (
//     <div className="cart-container">
//       <h2>Your Cart</h2>
//       {cartItems.length === 0 ? (
//         <p>Your cart is currently empty.</p>
//       ) : (
//         <ul>
//           {cartItems.map((item) => (
//             <li key={item._id}>
//               <img
//                 src={`data:image/jpeg;base64,${item.itemPicture}`} // Replace "jpeg" if needed
//                 alt={item.itemName}
//                 width="200"
//                 height="200"
//               />
//               <div className="item-details">
//                 <h3>{item.itemName}</h3>
//                 <p>Price: ${Number(item.itemPrice).toFixed(2)}</p>
//                 <p>{item.itemDescription}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//       {cartItems.length > 0 && (
//         <div className="cart-summary">
//           <p>Total: ${totalPrice.toFixed(2)}</p>
//           <button>Proceed to Checkout</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;
