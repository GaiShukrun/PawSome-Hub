const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
      },
      itemId: {
        type: String,
        required: true
      },
      itemName: {
        type: String,
        required: true
      },
      itemPicture: {
        type: String,
        required: true
      },
      itemDescription: {
        type: String,
        required: true
      },
      itemPrice: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    });



const CartItem= mongoose.model('CartItem', cartItemSchema);
module.exports =CartItem;