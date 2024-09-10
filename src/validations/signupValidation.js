const Joi = require("joi");

const signupSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

module.exports = { signupSchema };
