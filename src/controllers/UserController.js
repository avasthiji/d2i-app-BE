const { UserService } = require("../services/UserService");

module.exports = {
  //index
  index: async (req, res, next) => {
    try {
       const currentUserId = req.auth.userId;
      const data = await UserService.getAllUsers(currentUserId); //service method to get all users accept itself
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  //show
  show: async (req, res, next) => {
    try {
      const userId = req.params.users_id;
      const data = await UserService.getUserByID(userId);

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  //create
  create: async (req, res, next) => {
    try {
      const userData = req.body;
      const { is_admin } = req.auth;
      if (is_admin) {
        const newUser = await UserService.createUser(userData);
        res.status(201).json(newUser);
      } else {
        res.status(403).json({ message: "Access denied" });
      }
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

      const { is_admin } = req.auth;

      if (is_admin) {
        const updatedUser = await UserService.updateUser(userId, updateData);
        if (!updatedUser) {
          res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  //delete
  delete: async (req, res, next) => {
    try {
      const userId = req.params.users_id;

      const { is_admin } = req.auth;
      if (is_admin) {
        // const deletedUser = await UserService.deleteUser(userId);
        const deletedUser = await UserService.softDeleteUser(userId);
        if (!deletedUser) {
          res.status(404).josn({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
