const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  employeeId: { type: String, unique: true, required: true },
  officialEmail: { type: String, required: true, unique: true },
  bloodGroup: { type: String, default: null },
  alternateEmail: { type: String, default: null },
  contactNumber: { type: String, default: null },
  alternateContactNumber: { type: String, default: null },
  birthday: { type: String, default: null },
  password: { type: String, default: null },
  anniversaryDate: { type: String, default: null },
  joiningDate: { type: String, default: null },
  userProfile: { type: String, default: null },
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
  passwordNeedsReset: { type: Boolean, default: true },
  userState: {
    type: String,
    enum: ["invited", "active", "deleted"],
    default: "invited",
  },
  inviteCode: { type: String, sparse: true },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(err);
  }
});

// Pre-update hook to hash the password
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
      update.passwordNeedsReset = false;
      update.userState = "active";
    } catch (error) {
      return next(error);
    }
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
