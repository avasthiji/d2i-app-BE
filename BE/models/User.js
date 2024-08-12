const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  officialEmail: { type: String, required: true, unique: true },
  alternateEmail: { type: String },
  contactNumber: { type: String, required: true },
  alternateContactNumber: { type: String },
  birthday: { type: Date, required: true },
  password: { type: String, required: true },
});

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
