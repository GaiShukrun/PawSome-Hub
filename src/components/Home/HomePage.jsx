
// import React, { useState, useEffect } from 'react';
// import './HomePage.css';
// import Cart from '../Cart/Cart.jsx';

// const HomePage = ({ cartItems, setCartItems }) => {
//   const [featuredItems, setFeaturedItems] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [petSearch, setPetSearch] = useState(''); // New state for pet type search
//   const [sortByPrice, setSortByPrice] = useState(''); // Default sort: null
//   const [cartItems, setCartItems] = useState([]);


//   useEffect(() => {
//     fetchFeaturedItems();
//   }, []);

//   const fetchFeaturedItems = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/api/get-featured-items');
//       if (!response.ok) {
//         throw new Error('Failed to fetch featured items');
//       }
//       const data = await response.json();
//       setFeaturedItems(data);
//     } catch (error) {
//       console.error('Error fetching featured items:', error);
//     }
//   };
//   const addToCart = (item) => {
//     const updatedCartItems = [...cartItems, item];
//     setCartItems(updatedCartItems);
//   };


//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value.toLowerCase()); // Ensure case-insensitive search
//   };

//   const handlePetSearchChange = (event) => {
//     setPetSearch(event.target.value); // Maintain case sensitivity for pet search
//   };
  
//   const handleSortChange = (event) => {
//     setSortByPrice(event.target.value);
//   };
 
  

//   const filteredItems = featuredItems.filter((item) => {
//     // Combined search logic with case-insensitive and optional pet filtering
//     const itemNameSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
//     const petSearchMatch = petSearch ? item.itemPet?.toLowerCase().includes(petSearch.toLowerCase()) : true; // Allow all items if petSearch is empty
//     return itemNameSearch && petSearchMatch;
//   });

//   // Optimized sorting approach using a single sort function
//   const sortedItems = [...filteredItems].sort((itemA, itemB) => {
//     if (sortByPrice === 'ascending') {
//       return itemA.itemPrice - itemB.itemPrice;
//     } else if (sortByPrice === 'descending') {
//       return itemB.itemPrice - itemA.itemPrice;
//     } else {
//       // Default: no sorting
//       return 0;
//     }
//   });
  

//   return (
//     <div>
//       <h2>Featured Items</h2>
//       <div className="search-container">
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search items..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             autoComplete="off"
//             style={{ height: '30px', padding: '5px 50px' }} // Adjust height and padding
//           />
//           <button type="submit" style={{ height: '40px', padding: '5px 20px' }}>Search</button>
//         </div>
//         <select
//             value={petSearch}
//             onChange={handlePetSearchChange}
//             style={{ width: '100px', marginRight: '10px' }} // Adjust width and margin
//           >
//             <option value="">All Pets</option>
//             <option value="cat">Cat</option>
//             <option value="dog">Dog</option>
//             {/* ... Add more options for other types (if applicable) */}
//           </select>
//         <div className="sort-dropdown">
//           <select value={sortByPrice} onChange={handleSortChange}>
//             <option value="">Sort by Price</option>
//             <option value="ascending">Lowest to Highest</option>
//             <option value="descending">Highest to Lowest</option>
//           </select>
//         </div>
//       </div>
//       <div className="items">
//         {sortedItems.map((item) => (
//           <div className="item-box" key={item._id}>
//             <img
//               src={`data:image/jpeg;base64,${item.itemPicture}`} // Replace "jpeg" if needed
//               alt={item.itemName}
//               width="200"
//               height="200"
//             />
//             <h3>{item.itemName}</h3>
//             <p>Price: ${Number(item.itemPrice).toFixed(2)}</p>
//             <p>{item.itemDescription}</p>
//             <button onClick={() => addToCart(item)}>Add to Cart</button>
          
//             <p>Remains in stock: {item.itemAmount}</p>
            
//           </div>
//         ))}
       
//       </div>
      
//     </div>
//   );
// };

// export default HomePage;
import React, { useState, useEffect } from 'react';
import './HomePage.css';
import Cart from '../Cart/Cart.jsx';

const HomePage = ({ cartItems, setCartItems }) => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [petSearch, setPetSearch] = useState('');
  const [sortByPrice, setSortByPrice] = useState('');

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/get-featured-items');
      if (!response.ok) {
        throw new Error('Failed to fetch featured items');
      }
      const data = await response.json();
      setFeaturedItems(data);
    } catch (error) {
      console.error('Error fetching featured items:', error);
    }
  };

  const addToCart = (item) => {
    // const updatedCartItems = [...cartItems, item];
    // setCartItems(updatedCartItems);
    const existingItemIndex = cartItems.findIndex((cartItem) => cartItem._id === item._id);

  if (existingItemIndex !== -1) {
    // If item already exists in the cart, update its quantity
    const updatedCartItems = [...cartItems];
    updatedCartItems[existingItemIndex].quantity += 1;
    setCartItems(updatedCartItems);
  } else {
    // If item is not already in the cart, add it
    const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
    setCartItems(updatedCartItems);
  }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handlePetSearchChange = (event) => {
    setPetSearch(event.target.value);
  };
  
  const handleSortChange = (event) => {
    setSortByPrice(event.target.value);
  };

  const filteredItems = featuredItems.filter((item) => {
    const itemNameSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const petSearchMatch = petSearch ? item.itemPet?.toLowerCase().includes(petSearch.toLowerCase()) : true;
    return itemNameSearch && petSearchMatch;
  });

  const sortedItems = [...filteredItems].sort((itemA, itemB) => {
    if (sortByPrice === 'ascending') {
      return itemA.itemPrice - itemB.itemPrice;
    } else if (sortByPrice === 'descending') {
      return itemB.itemPrice - itemA.itemPrice;
    } else {
      return 0;
    }
  });
  

  return (
    <div>
      <h2>Featured Items</h2>
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearchChange}
            autoComplete="off"
            style={{ height: '30px', padding: '5px 50px' }}
          />
          <button type="submit" style={{ height: '40px', padding: '5px 20px' }}>Search</button>
        </div>
        <select
            value={petSearch}
            onChange={handlePetSearchChange}
            style={{ width: '100px', marginRight: '10px' }}
          >
            <option value="">All Pets</option>
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
          </select>
        <div className="sort-dropdown">
          <select value={sortByPrice} onChange={handleSortChange}>
            <option value="">Sort by Price</option>
            <option value="ascending">Lowest to Highest</option>
            <option value="descending">Highest to Lowest</option>
          </select>
        </div>
      </div>
      <div className="items">
        {sortedItems.map((item) => (
          <div className="item-box" key={item._id}>
            <img
              src={`data:image/jpeg;base64,${item.itemPicture}`}
              alt={item.itemName}
              width="200"
              height="200"
            />
            <h3>{item.itemName}</h3>
            <p>Price: ${Number(item.itemPrice).toFixed(2)}</p>
            <p>{item.itemDescription}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
            <p>Remains in stock: {item.itemAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
