
import { useNavigate  } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './HomePage.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import emailjs from 'emailjs-com';
import { waitFor } from '@testing-library/react';


const HomePage = ({cartItems, setCartItems,username}) => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [petSearch, setPetSearch] = useState(''); // New state for pet type search
  const [sortByPrice, setSortByPrice] = useState(''); // Default sort: null
  const [addedItemIds, setAddedItemIds] = useState([]); // State variable to track added item IDs
  const navigate = useNavigate ();
  const [error, setError] = useState(''); 
  const [errorItemId, setErrorItemId] = useState(null);
  const [cookies, setCookie] = useCookies(['itemId', 'itemLength']);
  const [itemsLength, setItemsLength] = useState(0);
  
  useEffect(() => {
    fetchFeaturedItems();
    const interval = setInterval(() => {
      checkForNewItems();
    }, 20000); // Check every 1 minute

    // Perform initial check when the component mounts
    checkForNewItems();

    return () => {
      clearInterval(interval);
    };
    
  }, []);
  const checkForNewItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/get-featured-items');
      const latestItems = response.data;
      const latestItemsLength = latestItems.length;

      // Get the previous length of items from cookies
      const prevItemsLength = parseInt(cookies.itemLength) || 0;
      console.log(latestItemsLength +' ? '+prevItemsLength)
        if(latestItemsLength < prevItemsLength){
          window.location.reload();
        }
        if (latestItemsLength > prevItemsLength) {
          // Trigger notification mechanism (e.g., send emails)
          console.log('New items found:', latestItems);
            const usersResponse = await axios.get('http://localhost:3001/api/users');
            const users = usersResponse.data;
            const newItem = latestItems[latestItems.length - 1];
            for (const user of users) {
              const templateParams = {
                from_name:'MyPetShop',
                to_name: user.username,
                to_email: user.email, // Assuming there's an email field in the user object
                subject: 'New item added!',
                message: `New item has been added to the store:\n\nItem Name: ${newItem.itemName}\nDescription: ${newItem.itemDescription}\nPrice: ${newItem.itemPrice}$`
              };
              sendEmail(templateParams);
              setCookie('itemLength', latestItemsLength.toString(), { path: '/' });
              setItemsLength(latestItemsLength);
            }

            setTimeout(() => {
              window.location.reload();
              
            }, 5000);
          // Implement notification logic here
        } else   {
          
          console.log('No new items found.');
          // window.location.reload();
        }
    

      // Update the cookie with the latest length of items
      setCookie('itemLength', latestItemsLength.toString(), { path: '/' });
      setItemsLength(latestItemsLength);
    } catch (error) {
      console.error('Error checking for new items:', error);
    }
  };
 
  
  

  const sendEmail = (templateParams) => {
        
    emailjs.send('service_dnd346u', 'template_hs3zhpf', templateParams, 'A2IZK0tl7FBZIOKIs')
      .then((response) => {
        console.log('Email sent successfully:', response);
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
      });
  };
  
  
  // Function to fetch featured items from the server
  const fetchFeaturedItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/get-featured-items');
      if (!response.ok) {
        throw new Error('Failed to fetch featured items');
      }
      const data = await response.json();
      // const filteredData = data.filter(item => item.itemAmount > 0);

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



  const SetAddedItemIds = async (item) => {
  // setAddedItemIds(prevAddedItemIds => [...prevAddedItemIds, item._id]);
  setAddedItemIds([...addedItemIds, item._id]); // Add item ID to addedItemIds
  setTimeout(() => {
    // Remove item ID from addedItemIds after 0.7 seconds
    setAddedItemIds(addedItemIds.filter(id => id !== item._id));
  }, 700);

  console.log(`Added item ${item._id} to cart`);
}

 const addToCart = async (item) => {

  const newCartItem = { 
    username: username, 
    itemId: item._id, 
    itemName: item.itemName, // Add itemName
    itemPicture: item.itemPicture, // Add itemPicture
    itemDescription: item.itemDescription, // Add itemDescription
    itemPrice: item.itemPrice,
    quantity:1
  };
  
  try {
    const response = await axios.post('http://localhost:3001/api/addToCart', newCartItem);
    // setCartItems(prevCartItems => [...prevCartItems, response.data]);
    if (response.status == 200 || response.status == 201){
      SetAddedItemIds(item);
    }
    else if (response.status == 203){

      setErrorItemId(item._id);
      setError(response.data.error);
      setTimeout(() => {
        setErrorItemId(null);
        setError('');
      }, 2000); // Clear error after 2 seconds
    }
  }
  catch (error) {
  console.error('Error adding item to cart:', error);
  }
 };



  // Function to handle proceeding to checkout with an item
  const buyNow = async (itemId) => {
    
    const randomParam = Math.random(); // Generate a random number
    console.log(username,itemId._id)
    setCookie('itemId', itemId._id, { path: '/CheckoutPage', expires: 0, search: `?rand=${randomParam}` }); // Append random parameter to URL
    navigate(`/CheckoutPage/${username}`, { state: { flag: false } });
    
 //, expires: 0, search: `?rand=${randomParam}`
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
              src= {'/images/' + item.itemPicture}
              alt={item.itemName}
            />
            <div className="item-details">  
              <p>Price: ${Number(item.itemPrice).toFixed(2)}</p>
              <p style={{ fontSize: '14px',maxHeight: '83px', overflowY: 'auto' }}>{item.itemDescription}</p>
            </div>

            <p>Remains in stock: {item.itemAmount}</p>
            
            { username ? (
              item.itemAmount > 0 ? (
            <div className='item-buttons'>
              <button onClick={() => addToCart(item)}>Add to Cart</button>
              <button onClick={() => buyNow(item)}>Buy Now</button>
            </div>
              ) : (
                <p style={{ fontWeight: 'bold',color:'red' }} >Out of stock!</p>
              )

            ) : (
              <p style={{ fontWeight: 'bold' }} >Login to add to cart!</p>
            )}

            {/* Debugging statements */}
            {console.log('addedItemIds:', addedItemIds)}
            {console.log('item._id:', item._id)}
            {console.log('CART:', cartItems)}
            {/* Render message below the item */}
            {addedItemIds.includes(item._id) && <div style={{ color: 'green' }}>Item added to your cart</div>}
            {errorItemId === item._id && <div className="error-message">{error}</div>}
            {}
          </div>
        ))}
      </div>
    </div>
  );


};

export default HomePage;