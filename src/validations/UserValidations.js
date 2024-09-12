const Joi = require("joi");

const createUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  officialEmail: Joi.string().email().required(),
  parent_id: Joi.string().required(),
  joiningDate: Joi.date().optional(),
});

const createAdminSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  officialEmail: Joi.string().email().required(),
  adminSignupKey: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().optional(),
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
  birthday: Joi.date().optional(),
  password: Joi.string().min(8).optional(),
  anniversaryDate: Joi.date().optional(),
});

module.exports = { createUserSchema, createAdminSchema, updateUserSchema };
