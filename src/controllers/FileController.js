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
            return res.status(400).json({
              message: "Record already exist please use update method",
            });
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
        res.status(403).json({ message: "access denied in file controller" });
      }
    } catch (error) {
      next(error);
    }
  },
  index: async (req, res, next) => {
    try {
      const records = await FileService.getAllFiles();
      res.status(200).json(records);
    } catch (error) {
      next(error);
    }
  },
  show: async (req, res, next) => {
    try {
      const { file_id } = req.params;
      const { q } = req.query;
      let record;
      if (q) {
        record = await FileService.getFileById(q);
      } else {
        record = await FileService.lookForFile(file_id);
      }
      res.status(200).json(ApiResponse("success", record));
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { file_id } = req.params;
      const uploadedFileName = req.files.uploadFile[0].originalname;

      const data = await FileService.updateFileUpload(
        file_id,
        uploadedFileName
      );
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  },
};
