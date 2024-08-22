const Joi = require("joi");

const signupSchema = Joi.object({
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
  officialEmail: Joi.string().email().required(),
  alternateEmail: Joi.string().email().optional(),
  contactNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  alternateContactNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),
  birthday: Joi.date().iso().required(),
  password: Joi.string().min(6).required(),
  bloodGroup: Joi.string()
    .valid("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-")
    .required(),
});

module.exports = { signupSchema };
