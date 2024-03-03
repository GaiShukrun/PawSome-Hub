
import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = ({cartItems, setCartItems}) => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [petSearch, setPetSearch] = useState(''); // New state for pet type search
  const [sortByPrice, setSortByPrice] = useState(''); // Default sort: null
  const [addedItemIds, setAddedItemIds] = useState([]); // State variable to track added item IDs

  useEffect(() => {
    fetchFeaturedItems();
  }, []);


  // Function to fetch featured items from the server
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
  

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase()); // Ensure case-insensitive search
  };

  const handlePetSearchChange = (event) => {
    setPetSearch(event.target.value); // Maintain case sensitivity for pet search
  };
  
  const handleSortChange = (event) => {
    setSortByPrice(event.target.value);
  };
 
  

  const filteredItems = featuredItems.filter((item) => {
    // Combined search logic with case-insensitive and optional pet filtering
    const itemNameSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const petSearchMatch = petSearch ? item.itemPet?.toLowerCase().includes(petSearch.toLowerCase()) : true; // Allow all items if petSearch is empty
    return itemNameSearch && petSearchMatch;
  });

  // Optimized sorting approach using a single sort function
  const sortedItems = [...filteredItems].sort((itemA, itemB) => {
    if (sortByPrice === 'ascending') {
      return itemA.itemPrice - itemB.itemPrice;
    } else if (sortByPrice === 'descending') {
      return itemB.itemPrice - itemA.itemPrice;
    } else {
      // Default: no sorting
      return 0;
    }
  });


  // Function to handle adding an item to the cart
  const addToCart = (item) => {
    // Check if the item is already in the cart
    const existingItem = cartItems.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      // If the item is already in the cart, increase its quantity
      const updatedCartItems = cartItems.map(cartItem =>
        cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      );
      setCartItems(updatedCartItems);
    } else {
      // If the item is not in the cart, add it with quantity 1
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }

    setAddedItemIds([...addedItemIds, item._id]); // Add item ID to addedItemIds
    setTimeout(() => {
      // Remove item ID from addedItemIds after 0.7 seconds
      setAddedItemIds(addedItemIds.filter(id => id !== item._id));
    }, 700);

    console.log(`Added item ${item._id} to cart`);
    
  };

  // Function to handle proceeding to checkout with an item
  const buyNow = (itemId) => {
    // Implement your logic to proceed to checkout with the item
    console.log(`Proceeding to checkout with item ${itemId}`);
  };
  

  return (
    <div class>
      <h2>Featured Items</h2>
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearchChange}
            autoComplete="off"
            style={{ height: '30px', padding: '5px 50px' }} // Adjust height and padding
          />
          <button type="submit" style={{ height: '40px', padding: '5px 20px' }}>Search</button>
        </div>
        <select
            value={petSearch}
            onChange={handlePetSearchChange}
            style={{ width: '100px', marginRight: '10px' }} // Adjust width and margin
          >
            <option value="">All Pets</option>
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
            {/* ... Add more options for other types (if applicable) */}
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
            <h3>{item.itemName}</h3>
            <img
              src={`data:image/jpeg;base64,${item.itemPicture}`} // Replace "jpeg" if needed
              alt={item.itemName}
            />
            <div className="item-details">  
              <p>Price: ${Number(item.itemPrice).toFixed(2)}</p>
              <p style={{ fontSize: '14px',maxHeight: '83px', overflowY: 'auto' }}>{item.itemDescription}</p>
            </div>
            <p>Remains in stock: {item.itemAmount}</p>
            <div className='item-buttons'>
              <button onClick={() => addToCart(item)}>Add to Cart</button>
              <button onClick={() => buyNow(item)}>Buy Now</button>
            </div>
            {/* Debugging statements */}
            {console.log('addedItemIds:', addedItemIds)}
            {console.log('item._id:', item._id)}
            {console.log('CART:', cartItems)}
            {/* Render message below the item */}
            {addedItemIds.includes(item._id) && <div>Item added to your cart</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
