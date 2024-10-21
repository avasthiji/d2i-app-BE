const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const path = require("path");
require("./utils/CronJobber");
const {
  UnauthorizedError,
  ValidationError,
  AccessDeniedError,
  NotFoundError,
  DuplicateEntry,
  BadRequestError,
} = require("./exceptions");
const { router } = require("./routes");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/uploads", express.static(process.env.UPLOAD_DIR));
app.use("/api/v1", router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(new NotFoundError());
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      message: err?.message || "Unauthorized",
    });
  } else if (err instanceof ValidationError) {
    return res.status(422).json({
      message: err?.message || "Validation Error message",
      code: err?.code,
    });
  } else if (err instanceof AccessDeniedError) {
    return res.status(403).json({
      message: err?.message || "Access denied message",
      code: err?.code,
    });
  } else if (err instanceof NotFoundError) {
    return res
      .status(404)
      .json({ message: err?.message || "Not found message", code: err?.code });
  } else if (err instanceof DuplicateEntry) {
    return res.status(429).json(err);
  } else if (err instanceof BadRequestError) {
    return res.status(400).json({
      message: err?.message || "Bad Request",
      code: err?.code,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err,
    });
  }
  next();
});

module.exports = app;
