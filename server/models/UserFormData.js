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
    required: false
  },
  cardNumberIv: {
    type: Buffer,
    required: false
  },
  expiryDate: {
    type: String,
    required: false
  },
  cvc: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: true
  },
  itemsCheckout: {
    type: [String], // Array of strings for item names and quantities
    required: true
  },
  PayPal_payer_ID: {
    type: String,
    required: false
  },
  PayPal_order_ID: {
    type: String,
    required: false
  }
});

const UserFormData = mongoose.model('UserFormData', userFormDataSchema);

module.exports = UserFormData;