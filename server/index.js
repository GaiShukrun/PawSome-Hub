const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt");
const UsersModel = require('./models/users')


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


app.listen(3001, ()=>{
    console.log("Server is running")
})

