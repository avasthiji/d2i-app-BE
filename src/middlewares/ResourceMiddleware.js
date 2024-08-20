const { NotFoundError, AccessDeniedError } = require("../exceptions");

// const { DB } = require("../utils/db");
const { UserService } = require("../services/UserService");
module.exports.ResourceMiddleware = {
  loadResource: (resources = []) => {
    return async (req, res, next) => {
      req.resources = [];
      const resource_mapping = [];
      if (resources.length > 1) {
        for (let i = 0; i < resources.length - 1; i = i + 2) {
          let id_param = resources[i + 1]
            ? `${resources[i + 1]}`.replace(":", "")
            : null;
          resource_mapping.push({
            name: resources
              .slice(0, i + 2)
              .filter((x) => x.indexOf(":") !== 0)
              .join("/"),
            id_param,
            id: id_param ? req.params[id_param] : 0,
          });
        }
      }
      try {
        for (let i = 0; i < resource_mapping.length; i++) {
          const resource = resource_mapping[i];
          const { id, name } = resource;

          if (name === "users") {
            const user = await UserService.getUserByID(resource.id);
            if (!user) {
              next(new NotFoundError());
              return;
            }
            req.resources.push(user);
          } else {
            req.resources.push(resource.id);
          }
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  },
};
