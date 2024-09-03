const path = require("path");
const fs = require("fs");

const { UserService } = require("../services/UserService");

module.exports = {
  //index
  index: async (req, res, next) => {
    try {
      const currentUserId = req.auth.userId;
      const query = req.query.query;
      let data;
      if (query) {
        data = await UserService.searchUsers(query, currentUserId);
      } else {
        data = await UserService.getAllUsers(currentUserId); //service method to get all users accept itself
      }
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

      if (req.file) {
        userData.userProfile = req.file.path;
      }
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
      const {file} =req;
      const userId = req.params.users_id;
      const updateData = req.body;

      const existingUser = await UserService.getUserByID(userId);

      if(!existingUser){
        return res.status(404).json({message:'User not found'});
      }

      //if file was uploaded, add it to file path of updated data
      if (file) {
        //file path for old image
        const oldImagePath = path.join(existingUser.userProfile);
        
        //check if an old image exists and delete it
        if(fs.existsSync(oldImagePath)){
          fs.unlinkSync(oldImagePath);
        }

        //saving new file path
        updateData.userProfile = req.file.path;
      }

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
