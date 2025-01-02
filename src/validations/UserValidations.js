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
  password: Joi.string().min(8).required(),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  bloodGroup: Joi.string()
    .valid("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-")
    .optional()
    .messages({
      "any.only": "Please select a valid blood group from the list.",
    }),
  alternateEmail: Joi.string().email().allow(null, "").optional().messages({
    "string.email": "Please provide a valid alternate email address.",
  }),
  contactNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Contact number must be exactly 10 digits.",
    }),
  alternateContactNumber: Joi.string()
    .allow(null, "")
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Alternate contact number must be exactly 10 digits.",
    }),
  birthday: Joi.date().optional().messages({
    "date.base": "Please provide a valid date for the birthday.",
  }),
  password: Joi.string().min(8).optional().messages({
    "string.min": "Password must be at least 8 characters long.",
  }),
  anniversaryDate: Joi.date().optional().messages({
    "date.base": "Please provide a valid date for the anniversary.",
  }),
});

module.exports = { createUserSchema, createAdminSchema, updateUserSchema };
