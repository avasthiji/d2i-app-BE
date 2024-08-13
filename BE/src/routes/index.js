const express = require("express");
const router = express.Router();
const { RouteHelper } = require("../utils/RouteHelper");

//controllers
const UserController = require("../controllers/UserController");
const SignupController = require("../controllers/SignupController");
const LoginController = require("../controllers/LoginController");

//authMiddleware

//Routes using RouterHelper
RouteHelper.resource(router, "signup", SignupController);
RouteHelper.resource(router, "login", LoginController);
RouteHelper.resource(router, "users", UserController);

module.exports.router = router;
