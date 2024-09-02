const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  officialEmail: { type: String, required: true, unique: true },
  alternateEmail: { type: String, default: null },
  contactNumber: { type: String, required: true },
  alternateContactNumber: { type: String, default: null },
  birthday: { type: Date, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  userProfile: {type: String, default:null},
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  department: { type: String, default: null },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
});

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Pre-update hook to hash the password
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
    } catch (error) {
      return next(error);
    }
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
