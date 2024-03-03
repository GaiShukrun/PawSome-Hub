const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt");
const UsersModel = require('./models/users')
const ItemModel = require('./models/Items')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://vladik753:G8JOVgSLas5m48yp@myshop.uhaqamv.mongodb.net/Shop")


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
// app.post('/api/signup', async (req, res) => {
//     try {
//         // Check if the username already exists
//         const existingUser = await UsersModel.findOne({ username: req.body.username });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Username already exists.' });
//         }
        
//         const newUser = await UsersModel.create({
//             username: req.body.username,
//             email: req.body.email,
//             password: req.body.password,
//             cart: [] // Initialize the cart as an empty array
//         });
        
//         // Generate token
//         const token = jwt.sign({ username: newUser.username }, 'secret_key', { expiresIn: '1h' });
        
//         // Send token and user data in response
//         res.status(201).json({ token, user: newUser });
//     } catch (error) {
//         console.error('Error during signup:', error);
//         res.status(500).json({ error: 'Internal server error. Please try again later.' });
//     }
// });


app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        const user = await UsersModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password USERNAME' });
        }
        // Compare password
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = password == user.password;
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password PASSWORD' });
        }
        // Login successful
        res.status(200).json({ message: 'Login successful' });
    
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
 });
// app.post('/api/login', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//       // Find user by username
//       const user = await UsersModel.findOne({ username });
//       if (!user) {
//         return res.status(401).json({ error: 'Invalid username or password' });
//       }
//       // Compare password
//       const isPasswordValid = password == user.password;
//       if (!isPasswordValid) {
//         return res.status(401).json({ error: 'Invalid username or password' });
//       }
//       // Generate token
//       const token = jwt.sign({ username: user.username }, 'secret_key', { expiresIn: '1h' });
//       // Login successful, send token in response
//       res.status(200).json({ token });
//     } catch (error) {
//       console.error('Login error:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });


app.listen(3001, ()=>{
    console.log("Server is running")
})


app.get('/api/get-featured-items', async (req, res) => {
    try {
      const featuredItems = await ItemModel.find({ featured: true });
      res.json(featuredItems);
    } catch (error) {
      console.error('Error fetching featured items:', error);
      res.status(500).json({ error: 'Failed to fetch featured items' });
    }
});
// const authenticateMiddleware = async (req, res, next) => {
//     // Extract the token from the request headers
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
    
//     // Verify the token and retrieve the user's session
//     try {
//       const session = await SessionModel.findOne({ token });
//       if (!session) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }
//       // Attach user data to the request object
//       req.user = session.user;
//       next();
//     } catch (error) {
//       console.error('Error verifying session:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };
// app.post('/api/add-to-cart', authenticateMiddleware, async (req, res) => {
//     try {
//       const { itemId } = req.body;
//       const user = req.user; // Access user object from request
//       // Add item to user's cart
//       user.cart.push(itemId);
//       await user.save();
//       res.status(200).json({ message: 'Item added to cart successfully' });
//     } catch (error) {
//       console.error('Error adding item to cart:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
  


  
 
  