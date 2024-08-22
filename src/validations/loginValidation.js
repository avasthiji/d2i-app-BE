const Joi = require("joi");

const loginSchema = Joi.object({
  officialEmail: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { loginSchema };
