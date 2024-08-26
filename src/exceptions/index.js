module.exports.ValidationError = function (errors = {}) {
  // errors ex. {"email": "email is not unique"}
  this.message = "validation errors occurred.";
  this.code = 422;
  this.errors = errors;
};

module.exports.UnauthorizedError = function () {
  this.message = "Unauthorized";
  this.code = 401;
};

module.exports.AccessDeniedError = function (message = "") {
  this.message = `Access Denied -> ${message || "Not allowed."}`;
  this.code = 403;
};

module.exports.NotFoundError = function (errors = {}) {
  this.message = "Not Found";
  this.code = 404;
  this.errors = errors;
};

module.exports.DuplicateEntry = function (errors = {}) {
  this.message =errors.message;
  this.code = 429;
  this.errors = errors;
};


module.exports.Exceptions = {
  throwGlobalValidationException: (message) => {
    throw new this.ValidationError({
      global: message || "Something is bad with the provided data.",
    });
  },
};