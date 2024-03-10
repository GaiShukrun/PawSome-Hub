const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt");
const UsersModel = require('./models/users')
const ItemModel = require('./models/Items')
const CartItem = require('./models/CartItem');
const UserFormData = require('./models/UserFormData');
const bodyParser = require('body-parser');
const app = express()
app.use(express.json())
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '100mb' }));
mongoose.connect("mongodb+srv://vladik753:G8JOVgSLas5m48yp@myshop.uhaqamv.mongodb.net/Shop")


app.post('/api/saveFormData', async (req, res) => {
  try {
    const formData = req.body;
    const newUserFormData = new UserFormData(formData);
    await newUserFormData.save();
    res.status(201).json({ message: 'User form data saved successfully' });
  } catch (error) {
    console.error('Error saving user form data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/get-featured-items', async (req, res) => {
    try {
        
      const featuredItems = await ItemModel.find({ featured: true });
      res.json(featuredItems);
      
      
    } catch (error) {
      console.error('Error fetching featured items:', error);
      res.status(500).json({ error: 'Failed to fetch featured items' });
    }
});

app.get('/api/get-featured-items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;

    // Fetch item by itemId
    const item = await ItemModel.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/carts/:username', async (req, res) => {
  try {
    
    const { username } = req.params;
    const cartItems = await CartItem.find({ username });
    
    
    // Iterate through each cart item
    for (const cartItem of cartItems) {
      // Find the corresponding item
      const item = await ItemModel.findById(cartItem.itemId);

      // Decrement itemAmount if greater than 0
      console.log(cartItem.quantity);
      if (item.itemAmount > 0) {
        item.itemAmount -= cartItem.quantity;
        await item.save();
      }
      await CartItem.deleteOne({ _id: cartItem._id });
    }

    // Send the cart items in the response
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/getFormData/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const formData = await UserFormData.find({ username: username });
    res.status(200).json(formData);
  } catch (error) {
    console.error('Error fetching user form data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/checkout/:username', async (req, res) => {
  try {
    
    const { username } = req.params;
    const cartItems = await CartItem.find({ username });
    // Iterate through each cart item
    for (const cartItem of cartItems) {
      // Find the corresponding item
      const item = await ItemModel.findById(cartItem.itemId);

      if (cartItem.quantity > item.itemAmount ) {
        await CartItem.deleteOne({ _id: cartItem._id });
        res.status(201).json({ message: 'Some items in your cart are out of stock. The item is removed from your cart.'});
      }
    }
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/cart/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const cartItems = await CartItem.find({ username });
      res.json(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
//
app.put('/api/updateCartItem/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
  
      // Find the cart item by ID and update its quantity
      const updatedCartItem = await CartItem.findByIdAndUpdate(id, { quantity }, { new: true });
  
      res.status(200).json(updatedCartItem);
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/Buynow/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;

      const item = await ItemModel.findById(itemId);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      if (item.itemAmount > 0) {
        item.itemAmount -= 1;
        await item.save(); // Save the updated item back to the database
    } else {
        return res.status(400).json({ error: 'Item out of stock' });
    }
      
      res.json(item);
    } catch (error) {
      console.error('Error fetching item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to handle adding items to the cart
  app.post('/api/addToCart', async (req, res) => {
    try {
      const { username, itemId, itemName, itemPicture, itemDescription, itemPrice, quantity } = req.body;
      // Check if the item is already in the cart
      let cartItem = await CartItem.findOne({ username, itemId });
      let item = await ItemModel.findById(itemId);
  
      if (cartItem) {
        if (cartItem.quantity < item.itemAmount){
          cartItem.quantity += 1;
          await cartItem.save();
          res.status(200).json(cartItem);
        }
        else {
          res.status(203).json( {error: 'You added the maximum amount' });
        }// If the item already exists in the cart, update the quantity
        
      } else {
        // If the item doesn't exist in the cart, create a new cart item
        
        // cartItem = new CartItem({ username, itemId, quantity ,itemPrice});
        cartItem = new CartItem({ 
            username, 
            itemId, 
            itemName, 
            itemPicture, 
            itemDescription, 
            itemPrice, 
            quantity 
          });
        await cartItem.save();
        res.status(201).json(cartItem);
      }
      
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
 

app.post('/api/signup', async (req, res) => {
    try {
        // Check if the username already exists
        const existingUser = await UsersModel.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists.' });
        }
        
        // If the username doesn't exist, create the new user
        const newUser = await UsersModel.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});
app.get('/api/users', async (req, res) => {
  try {
    // Fetch all users
   
    const users = await UsersModel.find();
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/search/:username', async (req, res) => {
          const { username } = req.params; 
          
  try {
      // Search for the user by username
      const user = await UsersModel.findOne({ username });

      if (!user) {
        
          return res.status(404).json({ message: 'User not found' });
      }
     
      // Return the user data
      res.status(200).json({ user });
  } catch (error) {
      console.error('Error searching for user:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}); 
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        const user = await UsersModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        // Compare password
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = password == user.password;
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        // Login successful
        res.status(200).json({ message: 'Login successful'});
    
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
 });


app.listen(3001, ()=>{
    console.log("Server is running")
})



app.put('/api/cart/increaseQuantity/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      const cartItem = await CartItem.findById(itemId);
      const Item = await ItemModel.findById(cartItem.itemId);
      if (!Item ) {
        return res.status(404).json({ error: 'Item not found' });
      }
      if (!cartItem ) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      
      if(cartItem.quantity < Item.itemAmount){
      cartItem.quantity++;
      await cartItem.save();
      res.status(200).json({ message: 'Item quantity increased successfully', cartItem });
      }
      else{
        res.status(202).json({ error: 'You added the maximum amount' });
      }
    } catch (error) {
      console.error('Error increasing item quantity:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




  // Decrease item quantity in the cart
  app.put('/api/cart/decreaseQuantity/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      const cartItem = await CartItem.findById(itemId);
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      if (cartItem.quantity === 1) {
        // If quantity is already 1, remove the item from the cart
        // await CartItem.findByIdAndDelete(itemId);
        return res.status(201).json({ message: 'Item removed from cart' });
      }
      cartItem.quantity--;
      await cartItem.save();
      res.status(200).json({ message: 'Item quantity decreased successfully', cartItem });
    } catch (error) {
      console.error('Error decreasing item quantity:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.put('/api/cart/removeItem/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      const removedItem = await CartItem.findByIdAndDelete(itemId); // Use findByIdAndDelete to remove the item
      if (!removedItem) {
        return res.status(404).json({ error: 'Item not found in the cart' });
      }
      res.status(200).json({ message: 'Item removed from the cart successfully' });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
