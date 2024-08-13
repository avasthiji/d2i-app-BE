// src/config/jwtconfig.js
require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "ourSecretString",
  JWT_ALGO: process.env.JWT_ALGO || "HS256",
  JWT_AUDIENCE: "your-audience",
  JWT_ISSUER: "your-issuer",
};
