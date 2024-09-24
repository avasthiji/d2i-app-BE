const path = require("path");
const fs = require("fs");
const { UserService } = require("../services/UserService");
const transporter = require("../utils/Mailer");
const CONSTANTS = require("../constants");
const { ApiResponse } = require("../utils/ApiHelper");
const { createUserSchema } = require("../validations/UserValidations");

module.exports = {
  //index
  index: async (req, res, next) => {
    try {
      const currentUserId = req.auth.userId;
      const query = req.query.q;
      const includeSelf = req.query.includeSelf === "true";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      let data;
      if (query && !query.includeSelf) {
        data = await UserService.searchUsers(query, currentUserId, {
          page,
          limit,
        });
      } else {
        data = await UserService.getAllUsers(currentUserId, includeSelf, {
          page,
          limit,
        });
      }
      res.status(200).json(ApiResponse("success", data));
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

      res.status(200).json(ApiResponse("success", data));
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
        const { error } = createUserSchema.validate(userData);
        if (error) {
          res.status(400).json({ message: error.details[0].message });
        } else {
          const newUser = await UserService.createUser(userData);

          const inviteLink = `${CONSTANTS.INVITE_URL}${newUser.inviteCode}`;

          const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: newUser.officialEmail,
            subject: "Your Account Has Been Created",
            html: `<p>Hello ${newUser.firstName},</p>
            <p>Your account has been created by the admin. You can set your password using the following link:</p>
            <p><strong>Email:</strong> ${newUser.officialEmail}</p>
            <p>Please click the link below to set your password and activate your account:</p>
            <a href="${inviteLink}">Set Password</a>`,
          };
          await transporter.sendMail(mailOptions);

          res.status(201).json(newUser);
        }
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "A user with this email already exists." });
      }
      console.log(error);
      next(error);
    }
  },

  //update
  update: async (req, res, next) => {
    try {
      const { file } = req;
      const userId = req.params.users_id;
      const updateData = req.body;

      const existingUser = await UserService.getUserByID(userId);

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
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
        updateData.userProfile = req.file.filename;
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
