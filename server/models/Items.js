const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  itemId: { type: Number, required: true, unique: true },
  itemName: { type: String, required: true },
  itemPicture: { type: String, required: true },
  itemAmount: { type: Number, required: true },
  itemDescription:{type: String,required:true},
  itemPrice:{type:Number,required:true},
  itemPet:{type: String,required:true}
  });

  const ItemModel = mongoose.model("Items",ItemSchema);
  
  module.exports = ItemModel;