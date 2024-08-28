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

const validate = require("../middlewares/ValidateMiddleware");
const { signupSchema } = require("../validations/signupValidation");
const { loginSchema } = require("../validations/loginValidation");
const MeController = require("../controllers/MeController");

//authMiddleware

//Routes using RouterHelper
RouteHelper.resource(router, "health", HealthController);
RouteHelper.resource(router, "lookups", LookupController);
RouteHelper.resource(
  router,
  "signup",
  SignupController,
  validate(signupSchema)
);
RouteHelper.resource(router, "login", LoginController, validate(loginSchema));
RouteHelper.resource(
  router,
  "users",
  UserController,
  AuthMiddleware.verify(["ADMIN", "USER"])
);
RouteHelper.resource(router, "subordinates", SubordinateControllers);
RouteHelper.resource(router, "metrics", MetricController);

RouteHelper.resource(
  router,
  "rewards",
  RewardController,
  AuthMiddleware.verify()
);

RouteHelper.resource(router, "me", MeController, AuthMiddleware.verify());


module.exports.router = router;
