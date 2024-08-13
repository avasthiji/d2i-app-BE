const { UserService } = require("../services/UserService");

module.exports = {
  //index
  index: async (req, res, next) => {
    try {
      const data = await UserService.getAllUsers(); //service method to get all users
      res.status(200).json(data);
    } catch (error) {
      console.log(error); //needs a handleError utils
      next(error);
    }
  },

  //show
  show: async (req, res, next) => {
    try {
      const userId = req.params.users_id;
      const data = await UserService.getUserByID(userId);

      if (!data) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(data);
    } catch (error) {
      console.log(error); // Log the error
      next(error); // Pass the error to the error handling middleware
    }
  },

  //create
  create: async (req, res, next) => {
    try {
      const userData = req.body;
      const newUser = await UserService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  //update
  update: async (req, res, next) => {
    try {
      const userId = req.params.users_id;
      const updateData = req.body;
      const updatedUser = await UserService.updateUser(userId, updateData);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  //delete
  delete: async (req, res, next) => {
    try {
      const userId = req.params.users_id;
      const deletedUser = await UserService.deleteUser(userId);

      if (!deletedUser) {
        return res.status(404).josn({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
