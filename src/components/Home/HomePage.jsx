
import { useNavigate  } from 'react-router-dom';
import React, { useState, useEffect,useRef } from 'react';
import './HomePage.css';
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import axios from 'axios';
import { useCookies } from 'react-cookie';
import emailjs from 'emailjs-com';
import { waitFor } from '@testing-library/react';


const HomePage = ({cartItems, setCartItems,username}) => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [PopularItems,setPopularItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlySaleItems, setShowOnlySaleItems] = useState(false);
  const [petSearch, setPetSearch] = useState(''); // New state for pet type search
  const [sortBy, setSortBy] = useState(''); // Default sort: null
  const [addedItemIds, setAddedItemIds] = useState([]); // State variable to track added item IDs
  const navigate = useNavigate ();
  const [error, setError] = useState(''); 
  const [errorItemId, setErrorItemId] = useState(null);
  const [cookies, setCookie] = useCookies(['itemId', 'itemLength','itemIds']);
  const [itemsLength, setItemsLength] = useState(0);
  const [userData, setUserData] = useState(null);
  const itemRefs = useRef({}); // Use a ref to store item references
  const [glowingItemId, setGlowingItemId] = useState(null);

  const [loading, setLoading] = useState(true); //loading page

  useEffect(() => {
    // Update the itemRefs object with the new references
    const newItemRefs = {};
    featuredItems.forEach((item) => {
      newItemRefs[item._id] = itemRefs.current[item._id] || null;
  
    });
    itemRefs.current = newItemRefs;
  }, [featuredItems]);
  
  useEffect(() => {
    fetchFeaturedItems();
    const interval = setInterval(() => {
      checkForNewItems();
      updateZeroAmountItemsInCookies();
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
      setFeaturedItems(data);


      const sortedData = data.sort((a, b) => b.soldCounter - a.soldCounter);
      // Get the top 3 items
      const top3Items = sortedData.slice(0, 3);
      setPopularItems(top3Items);
      setLoading(false);
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
    setSortBy(event.target.value);
  };
 
  

  const filteredItems = featuredItems.filter((item) => {
    // Combined search logic with case-insensitive and optional pet filtering
    const itemNameSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || item.itemId === parseInt(searchQuery);
    const petSearchMatch = petSearch ? item.itemPet?.toLowerCase().includes(petSearch.toLowerCase()) : true; // Allow all items if petSearch is empty
    const isSaleItem = !showOnlySaleItems || (showOnlySaleItems && item.itemFullPrice); // Filter for sale items if showOnlySaleItems is true
    return itemNameSearch && petSearchMatch && isSaleItem;
  });

  // Optimized sorting approach using a single sort function
  const sortedItems = [...filteredItems].sort((itemA, itemB) => {
    if (sortBy === 'ascending') {
      return itemA.itemPrice - itemB.itemPrice;
    } else if (sortBy === 'descending') {
        return itemB.itemPrice - itemA.itemPrice;
    } else if (sortBy === 'popular') {
        return itemB.soldCounter - itemA.soldCounter;
    }
    else {
    // Default: no sorting
    return;
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
  const buyNow = async (item) => {
    
    const randomParam = Math.random(); // Generate a random number
    console.log(username,item._id)
    setCookie('itemId', item._id, { path: '/CheckoutPage', expires: 0, search: `?rand=${randomParam}` }); // Append random parameter to URL
    navigate(`/CheckoutPage/${username}`, { state: { flag: false } });
    
 //, expires: 0, search: `?rand=${randomParam}`
  };


  const subscribeToNotification = async (itemId) => {
    try {
      // Fetch the current user's data from the server
      const userResponse = await axios.get(`http://localhost:3001/api/search/${username}`);
      const userData = userResponse.data.user;
  
  
      // Check if the itemId is already in the user's notificationList
      if (userData.notificationList.includes(itemId)) {
        console.log('Item   '+itemId +'   already in notification list');
      } else {
        console.log("item "+itemId+" Added to user notify list")
        // Update the user's notificationList with the itemId
        await axios.put(`http://localhost:3001/api/users/${username}/subscribe`, { itemId });
        // Optionally, provide feedback to the user that they have subscribed successfully
      }
    } catch (error) {
      setError('An error occurred while subscribing to notification');
    }
  };
  const checkItemAvailability = async () => {
    try {
      // Fetch all items from the server
      const response = await axios.get('http://localhost:3001/api/get-featured-items');
      const allItems = response.data;
      
      // Get the item IDs from cookies
      const itemIds = cookies.itemIds || [];
      // Filter items based on the IDs stored in cookies
      const itemsToCheck = allItems.filter(item => itemIds.includes(item._id));
      
      // Iterate through items and check if their amount has changed from 0 to a positive value
      itemsToCheck.forEach(async (item) => {
        
        if (item.itemAmount > 0) {
          
          // Fetch users who subscribed to this item
          const usersResponse = await axios.get('http://localhost:3001/api/users');
          const users = usersResponse.data;
          // Iterate through users and notify those who subscribed to this item
          users.forEach(async (user) => {
            if (user.notificationList.includes(item._id)) {
              
              try {
                const username = user.username
                const ITEMID = item._id ;    
                // Remove the subscription from the user's notificationList
                await axios.put(`http://localhost:3001/api/users/${username}/unsubscribe-item`, { itemId: ITEMID });
                // Notify user (e.g., send email)
                console.log(`User ${user.username} received msg !  item ${item.itemName} is now available to buy `);
                // Add your email sending logic here
                const updatedItemIds = itemIds.filter(id => id.toString() !== item._id.toString());
                setCookie('itemIds', updatedItemIds, { path: '/' });              
              } catch (error) {
                console.error('Error removing subscription or sending notification:', error);
              }
            }
          });
        }else{
          console.log("No changes in items amount found")
        }
      });
      
    } catch (error) {
      console.error('Error checking item availability:', error);
    }
  };
  // Set interval to check item availability every 3 minutes (180000 milliseconds)
const updateZeroAmountItemsInCookies = async () => {
  try {
    // Fetch all items from the server
    const response = await axios.get('http://localhost:3001/api/get-featured-items');
    const allItems = response.data;
    // Filter items with amount equal to 0
    const zeroAmountItems = allItems.filter(item => item.itemAmount === 0);
    // Get the item IDs from cookies
    const itemIds = cookies.itemIds || [];
    
    // Get the IDs of zero amount items
    const zeroAmountItemIds = zeroAmountItems.map(item => item._id);
    if (itemIds.length !== zeroAmountItemIds.length) {
      
      // Update cookies with all new zero amount item IDs
      setCookie('itemIds', zeroAmountItemIds, { path: '/' });
      
      console.log('Updated cookies with zero amount item IDs');
      checkItemAvailability();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  } catch (error) {
    console.error('Error fetching and updating zero amount items in cookies:', error);
  }
};



  

  return (
    <div className="home-page" >
      {loading && <LoadingScreen />}
      <h2>Featured Items</h2>
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search items... "
            value={searchQuery}
            onChange={handleSearchChange}
            autoComplete="off"
            // style={{ height: '30px', padding: '5px 50px' }} // Adjust height and padding
          />
        </div>

        <div className="sort-dropdown">
        <select
            value={petSearch}
            onChange={handlePetSearchChange}
            // style={{ width: '100px', marginRight: '10px', marginBottom:'5px' }} // Adjust width and margin
          >
            <option value="">Category</option>
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
            {/* ... Add more options for other types (if applicable) */}
          </select>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="">Sort by ⇵</option>
            <option value="ascending">Price low to high</option>
            <option value="descending">Price low to high</option>
            <option value="popular">Most Popular</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={showOnlySaleItems}
              onChange={() => setShowOnlySaleItems(!showOnlySaleItems)}
            />
            Show only sale items
          </label>
        </div>
      </div>
      <div className="items">
        {sortedItems.map((item) => (
          <div
            className={`item-box ${glowingItemId === item._id ? 'glowing' : ''}`}
            key={item._id}
            ref={(ref) => (itemRefs.current[item._id] = ref)}
          >
            <div className="badge-container">
              {PopularItems.find((popularItem) => popularItem._id === item._id) && (
                <span className="badge badge-popular"> Popular </span>)
              }
              {item.itemFullPrice && (
                // <span className="badge badge-sale"> Sale</span>
                <span className="badge badge-sale"> Sale </span>)
              }
            </div>
            <h3>
              {item.itemName}
            </h3>
            <img
              src= {'/images/' + item.itemPicture}
              alt={item.itemName}
            />
            { item.itemFullPrice ? ( 
              <div className="item-details"> 
              <p><strong>Price: <s> ${Number(item.itemFullPrice).toFixed(2)} </s></strong> <strong style={{color:'red'}}>${Number(item.itemPrice).toFixed(2)}</strong> </p>
              <p style={{ fontSize: '14px',maxHeight: '83px', overflowY: 'auto' }}>{item.itemDescription}</p>
            </div>
            ) : (
            <div className="item-details">  
              <p><strong>Price: ${Number(item.itemPrice).toFixed(2)}</strong></p>
              <p style={{ fontSize: '14px',maxHeight: '83px', overflowY: 'auto' }}>{item.itemDescription}</p>
            </div>
            )}

            <p>Remains in stock: {item.itemAmount}</p>
            
            { username ? (
              item.itemAmount > 0 ? (
            <div className='item-buttons'>
              <button onClick={() => addToCart(item)}>Add to Cart</button>
              <button onClick={() => buyNow(item)}>Buy Now</button>
            </div>
              ) : (
              <div>
                <p style={{ fontWeight: 'bold',color:'red' }} >Out of stock!</p>
                <button onClick={() => subscribeToNotification(item._id)}>Subscribe</button>
              </div>
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
      
      {searchQuery === '' && !showOnlySaleItems && (
      <>
      <h2>Top 3 Items</h2>
      <div className="popular-items">
        {PopularItems.map((item) => (
          <div className="item-box1" key={item._id}
          onClick={() => {
            const featuredItem = featuredItems.find((featuredItem) => featuredItem._id === item._id);
            if (featuredItem) {
              setGlowingItemId(featuredItem._id);
              itemRefs.current[featuredItem._id]?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          >
            <h3>{item.itemName}</h3>
            <img src={'/images/' + item.itemPicture} alt={item.itemName} />
            {/* Render other details of the popular item */}
            <p>Price: ${Number(item.itemPrice).toFixed(2)}</p>
            <p style={{ fontSize: '14px', maxHeight: '83px', overflowY: 'auto' }}>{item.itemDescription}</p>
          </div>
        ))}
      </div>
      </>
      )}

    </div>
  );

};

export default HomePage;