const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  itemId: { type: Number, required: true, unique: true },
  itemName: { type: String, required: true },
  itemPicture: { type: String, required: true },
  itemAmount: { type: Number, required: true },
  itemDescription:{type: String,required:true},
  itemPrice:{type:Number,required:true},
  itemFullPrice: { type: Number, required: false, default:null},
  itemPet:{type: String,required:true},
  soldCounter:{type: Number,required:true,default:0}
});

  const ItemModel = mongoose.model("Items",ItemSchema);
  
  module.exports = ItemModel;