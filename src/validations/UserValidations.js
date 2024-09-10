const Joi = require("joi");

const createUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  officialEmail: Joi.string().email().required(),
});

const updateUserSchema = Joi.object({
  firsName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  bloodGroup: Joi.string()
    .valid("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-")
    .optional(),
  alternateEmail: Joi.string().email().optional(),
  contactNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),
  alternateContactNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),
  birthday: Joi.date().iso().optional(),
  password: Joi.string().min(6).optional(),
});

module.exports = { createUserSchema, updateUserSchema };
