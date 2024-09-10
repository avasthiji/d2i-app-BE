const Joi = require('joi');

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
});

module.exports = {updateUserSchema};