const express = require("express");
const router = express.Router();
const { RouteHelper } = require("../utils/RouteHelper");

//controllers
const UserController = require("../controllers/UserController");
const SignupController = require("../controllers/SignupController");
const LoginController = require("../controllers/LoginController");
const MetricController = require("../controllers/MetricController");
const { HealthController } = require("../controllers/HealthController");
const LookupController = require("../controllers/LookupController");
const SubordinateControllers = require("../controllers/SubordinateControllers");
const RewardController = require("../controllers/RewardController");
const AuthMiddleware = require("../middlewares/AuthMiddlewares");

//authMiddleware

//Routes using RouterHelper
RouteHelper.resource(router, "health", HealthController);
RouteHelper.resource(router, "lookups", LookupController);
RouteHelper.resource(router, "signup", SignupController);
RouteHelper.resource(router, "login", LoginController);
RouteHelper.resource(router, "users", UserController);
RouteHelper.resource(router, "subordinates", SubordinateControllers);
RouteHelper.resource(router, "metrics", MetricController);

RouteHelper.resource(
  router,
  "rewards",
  RewardController,
  AuthMiddleware.verify
);

module.exports.router = router;
