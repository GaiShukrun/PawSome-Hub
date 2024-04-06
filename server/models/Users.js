const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { Schema } = mongoose; 
const UsersSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  notificationList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});


// Pre-save hook to hash the password before saving
UsersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const UsersModel = mongoose.model("Users", UsersSchema);

module.exports = UsersModel;


