const CONSTANTS = require("../constants");
const { FileService } = require("../services/FileService");
const { ApiResponse } = require("../utils/ApiHelper");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { is_admin } = req.auth;
      const { name } = req.body;

      if (is_admin) {
        if (req.files) {
          const data = await FileService.lookForFile(name);

          if (data) {
            const file_id = data._id.toString();
            const uploadedFileName = req.files.uploadFile[0].originalname;
            const response = await FileService.updateFileUpload(
              file_id,
              uploadedFileName
            );
            return res.status(201).json(response);
          } else {
            const uploadedFileName = req.files.uploadFile[0].originalname;
            const fileData = {
              name: name,
              fileNames: [{ name: uploadedFileName }],
            };
            const data = await FileService.createFile(fileData);
            return res.status(201).json(ApiResponse("success", data));
          }
        } else {
          return res.status(400).json({ message: "No file uploaded." });
        }
      } else {
        res.status(403).json({ message: CONSTANTS.ERROR_MESSAGES.ACCESS_DENIED });
      }
    } catch (error) {
      next(error);
    }
  },
  index: async (req, res, next) => {
    try {
      const { name } = req.query;
      const userRole = req.auth.userRole;
      const records = await FileService.getAllFiles(userRole, name);

      res.status(200).json(ApiResponse("success", records));
    } catch (error) {
      next(error);
    }
  },
  show: async (req, res, next) => {
    try {
      const { file_id } = req.params;
      const { name } = req.query;

      let record;
      record = await FileService.getFileById(file_id);
      res.status(200).json(ApiResponse("success", record));
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { file_id } = req.params;
      const { is_active, names } = req.body;
      const { is_admin } = req.auth;

      if (is_admin) {
        const data = await FileService.updateFileStatus(
          file_id,
          is_active,
          names
        );
         res.status(200).json(data);
      } else {
        res
          .status(403)
          .json({ message: CONSTANTS.ERROR_MESSAGES.ACCESS_DENIED });
      }
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { file_id } = req.params;
      const { names } = req.body;
      const { is_admin } = req.auth;

      if (is_admin) {
        const deletedDocs = await FileService.softDeleteFile(file_id,names);
        return deletedDocs;
      } else {
        res
          .status(403)
          .json({ message: CONSTANTS.ERROR_MESSAGES.ACCESS_DENIED });
      }
    } catch (error) {
      next(error);
    }
  },
};
