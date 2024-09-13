const { UnauthorizedError } = require("../exceptions");
const { AdminService } = require("../services/AdminService");
const { createAdminSchema } = require("../validations/UserValidations");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { adminSignupKey, ...userData } = req.body;
      const { error } = createAdminSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      } else {
        if (adminSignupKey !== process.env.ADMIN_SIGNUP_KEY) {
          throw new UnauthorizedError("Invalid Admin Signup Key");
        }
        const newAdmin = await AdminService.createAdmin(userData);

        res.status(201).json(newAdmin);
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
};