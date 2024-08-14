const express = require("express");
const router = express.Router();
const { RouteHelper } = require("../utils/RouteHelper");

//controllers
const UserController = require("../controllers/UserController");
const SignupController = require("../controllers/SignupController");
const LoginController = require("../controllers/LoginController");
const MetricController = require("../controllers/MetricController");

//authMiddleware

//Routes using RouterHelper
RouteHelper.resource(router, "signup", SignupController);
RouteHelper.resource(router, "login", LoginController);
RouteHelper.resource(router, "users", UserController);
RouteHelper.resource(router,'metrics',MetricController);

module.exports.router = router;
