const path = require("path");
const fs = require("fs");
const { UserService } = require("../services/UserService");

module.exports = {
  index: async (req, res, next) => {
    try {
      const userId = req.auth.userId;
      const data = await UserService.getUserByID(userId);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { file } = req;
      const userId = req.params.me_id;
      const updatedData = req.body;

      const existingUser = await UserService.getUserByID(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      //if file was uploaded, add it to file path of updated data
      if (file) {
        //file path for old image
        const oldImagePath = path.join(existingUser.userProfile);

        //check if an old image exists and delete it
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        //saving new file path
        updatedData.userProfile = req.file.path;
      }

      if (updatedData.role) {
        res.status(403).json({ message: "Access denied can't modify ROLE" });
      } else {
        if (userId === req.auth.userId) {
          const updatedUser = await UserService.updateUser(userId, updatedData);
          if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
          }
          res.status(200).json(updatedUser);
        } else {
          res.status(403).json({ message: "Access denied" });
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
