const { ResourceMiddleware } = require("../middlewares/ResourceMiddleware");

module.exports.RouteHelper = {
  resource: async (router, resourcePath, controller = {}, ...middlewares) => {
    resourcePath = `${resourcePath}`.trim("/");
    if (!resourcePath) {
      throw new Error("Please provide a valid resource name");
    }
    const segments = resourcePath.split("/");
    // normalize segments
    let resources = segments.map((segment) =>
      `${segment}`.startsWith(":")
        ? segment
        : `${segment}`.replace(/[^A-Za-z0-9]/g, "_")
    );
    const resource = resources[resources.length - 1];
    const route_param = `${resource}_id`.toLowerCase();

    // check if route param has conflicting param
    if (resources.includes(`:${route_param}`)) {
      throw new Error("provided respource has conflicting route params");
    }

    const resource_base = `/${resources.join("/")}`;

    // load resources
    controller.index &&
      router.get(
        resource_base,
        ...middlewares,
        ResourceMiddleware.loadResource([...resources]),
        async (req, res, next) => {
          // getting rid of manual exception handling
          try {
            const response = await controller.index(
              req,
              res,
              next,
              ...req.resources
            );
            if (response) {
              return res.json(response);
            } else if (typeof response !== "undefined") {
              res.json(null);
              return;
            }
          } catch (e) {
            next(e);
          }
        }
      );
    controller.show &&
      router.get(
        `${resource_base}/:${route_param}`,
        ...middlewares,
        ResourceMiddleware.loadResource([...resources, `:${route_param}`]),
        async (req, res, next) => {
          // getting rid of manual exception handling
          try {
            const response = await controller.show(
              req,
              res,
              next,
              ...req.resources
            );
            if (response) {
              return res.json(response);
            } else if (typeof response !== "undefined") {
              res.json(null);
              return;
            }
          } catch (e) {
            next(e);
          }
        }
      );
    controller.create &&
      router.post(
        resource_base,
        ...middlewares,
        ResourceMiddleware.loadResource([...resources]),
        async (req, res, next) => {
          // getting rid of manual exception handling
          try {
            const response = await controller.create(
              req,
              res,
              next,
              ...req.resources
            );
            if (response) {
              return response;
            } else if (typeof response !== "undefined") {
              res.json(null);
              return;
            }
          } catch (e) {
            next(e);
          }
        }
      );
    controller.update &&
      router.put(
        `${resource_base}/:${route_param}`,
        ...middlewares,
        ResourceMiddleware.loadResource([...resources, `:${route_param}`]),
        async (req, res, next) => {
          // getting rid of manual exception handling
          try {
            const response = await controller.update(
              req,
              res,
              next,
              ...req.resources
            );
            if (response) {
              return res.json(response);
            } else if (typeof response !== "undefined") {
              res.json(null);
              return;
            }
          } catch (e) {
            next(e);
          }
        }
      );
    controller.update &&
      router.patch(
        `${resource_base}/:${route_param}`,
        ...middlewares,
        ResourceMiddleware.loadResource([...resources, `:${route_param}`]),
        async (req, res, next) => {
          // getting rid of manual exception handling
          try {
            const response = await controller.update(
              req,
              res,
              next,
              ...req.resources
            );
            if (response) {
              return res.json(response);
            } else if (typeof response !== "undefined") {
              res.json(null);
              return;
            }
          } catch (e) {
            next(e);
          }
        }
      );
    controller.delete &&
      router.delete(
        `${resource_base}/:${route_param}`,
        ...middlewares,
        ResourceMiddleware.loadResource([...resources, `:${route_param}`]),
        async (req, res, next) => {
          // getting rid of manual exception handling
          try {
            const response = await controller.delete(
              req,
              res,
              next,
              ...req.resources
            );
            if (response) {
              return res.json(response);
            } else if (typeof response !== "undefined") {
              res.json(null);
              return;
            }
          } catch (e) {
            next(e);
          }
        }
      );
  },
};
