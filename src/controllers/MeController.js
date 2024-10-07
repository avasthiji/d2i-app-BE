const path = require("path");
const fs = require("fs");
const { UserService } = require("../services/UserService");
const { ApiResponse } = require("../utils/ApiHelper");
const { updateUserSchema } = require("../validations/UserValidations");
const CONSTANTS = require("../constants");

module.exports = {
  index: async (req, res, next) => {
    try {
      const userId = req.auth.userId;
      const data = await UserService.getUserByID(userId);
      res.status(200).json(ApiResponse("success", data));
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

      //validate the updateData
      const { error } = updateUserSchema.validate(updatedData);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      } else {
        const existingUser = await UserService.getUserByID(userId);
        if (!existingUser) {
          return res
            .status(404)
            .json({ message: CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND });
        }
        //if file was uploaded, add it to file path of updated data
        if (file) {
          //file path for old image
          const oldImagePath = existingUser.userProfile;
          //check if an old image exists and delete it
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
          //saving new file path
          updatedData.userProfile = req.file.filename;
        }

        if (
          updatedData.role ||
          updatedData.employeeId ||
          updatedData.officialEmail
        ) {
          res.status(403).json({
            message: CONSTANTS.ERROR_MESSAGES.NOT_MODIFIABLE,
          });
        }
        if (userId === req.auth.userId) {
          const updatedUser = await UserService.updateUser(userId, updatedData);
          if (!updatedUser) {
            res
              .status(404)
              .json({ message: CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND });
          }
          res.status(200).json(ApiResponse("success", updatedUser));
        } else {
          res
            .status(403)
            .json({ message: CONSTANTS.ERROR_MESSAGES.ACCESS_DENIED });
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
