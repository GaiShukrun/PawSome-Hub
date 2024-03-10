// UserFormData.js

const mongoose = require('mongoose');

const userFormDataSchema = new mongoose.Schema({
  OrderDate:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  cvc: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  itemsCheckout: {
    type: [String], // Array of strings for item names and quantities
    required: true
  }
});

const UserFormData = mongoose.model('UserFormData', userFormDataSchema);

module.exports = UserFormData;