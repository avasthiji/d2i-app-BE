const express = require("express");
const router = express.Router();
const { RouteHelper } = require("../utils/RouteHelper");

//controllers
const UserController = require("../controllers/UserController");
const LoginController = require("../controllers/LoginController");
const MetricController = require("../controllers/MetricController");
const { HealthController } = require("../controllers/HealthController");
const LookupController = require("../controllers/LookupController");
const SubordinateControllers = require("../controllers/SubordinateControllers");
const RewardController = require("../controllers/RewardController");
const AuthMiddleware = require("../middlewares/AuthMiddlewares");

const validate = require("../middlewares/ValidateMiddleware");
const {
  resetPasswordSchema,
} = require("../validations/resetPasswordValidation");
const { loginSchema } = require("../validations/loginValidation");
const MeController = require("../controllers/MeController");
const AttendanceController = require("../controllers/AttendanceController");
const upload = require("../middlewares/MulterMiddleware");
const ResetPasswordController = require("../controllers/ResetPasswordController");
const AdminController = require("../controllers/AdminController");
const LeaveController = require("../controllers/LeaveController");
const NotificationsController = require("../controllers/NotificationsController");
const HolidayController = require("../controllers/HolidayController");

//authMiddleware

//Routes using RouterHelper
RouteHelper.resource(router, "health", HealthController);
RouteHelper.resource(router, "lookups", LookupController);
RouteHelper.resource(
  router,
  "resetpassword",
  ResetPasswordController,
  validate(resetPasswordSchema)
);
RouteHelper.resource(router, "admin", AdminController, AuthMiddleware.verify());
RouteHelper.resource(router, "login", LoginController, validate(loginSchema));
RouteHelper.resource(
  router,
  "users",
  UserController,
  AuthMiddleware.verify(["ADMIN", "USER"]),
  upload
);
RouteHelper.resource(
  router,
  "subordinates",
  SubordinateControllers,
  AuthMiddleware.verify()
);
RouteHelper.resource(
  router,
  "metrics",
  MetricController,
  AuthMiddleware.verify()
);

RouteHelper.resource(
  router,
  "rewards",
  RewardController,
  AuthMiddleware.verify(["ADMIN", "USER"])
);

RouteHelper.resource(
  router,
  "me",
  MeController,
  AuthMiddleware.verify(),
  upload
);

RouteHelper.resource(
  router,
  "attendance",
  AttendanceController,
  AuthMiddleware.verify()
);

RouteHelper.resource(router, "leave", LeaveController, AuthMiddleware.verify());

RouteHelper.resource(
  router,
  "sendNotification",
  NotificationsController,
  AuthMiddleware.verify()
);

RouteHelper.resource(
  router,
  "holiday",
  HolidayController,
  AuthMiddleware.verify()
);
module.exports.router = router;
