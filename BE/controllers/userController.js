const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Controller to register a new user
exports.createUser = async (req, res) => {
  console.log("register Route");

  try {
    const user = new User(req.body);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({
      token,
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      officialEmail: user.officialEmail,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller to login a user
exports.loginUser = async (req, res) => {
  try {
    const { officialEmail, password } = req.body;
    const user = await User.findOne({ officialEmail });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send user info along with the token
    res.status(200).json({
      token,
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      officialEmail: user.officialEmail,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the URL params
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user information back to the client
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      officialEmail: user.officialEmail,
      alternateEmail: user.alternateEmail,
      contactNumber: user.contactNumber,
      alternateContactNumber: user.alternateContactNumber,
      birthday: user.birthday,
      bloodGroup: user.bloodGroup,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
