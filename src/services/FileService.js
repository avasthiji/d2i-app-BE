const { BadRequestError } = require("../exceptions");
const { ApiResponse } = require("../utils/ApiHelper");
const { TABLE_NAMES } = require("../utils/db");
const {
  insertRecord,
  getRecordsByKey,
  getRecordByKey,
  updateRecordsByKey,
} = require("../utils/QueryBuilder");

module.exports.FileService = {
  createFile: async (fileData) => {
    try {
      const file = await insertRecord(TABLE_NAMES.FILE, {
        ...fileData,
      });

      return file;
    } catch (error) {
      console.log(error);
      throw new BadRequestError(error.message);
    }
  },
  getAllFiles: async () => {
    try {
      const records = await getRecordsByKey(TABLE_NAMES.FILE, {});
      return ApiResponse("success", records);
    } catch (error) {
      console.log(error);
      throw new BadRequestError(error.message);
    }
  },
  lookForFile: async (name) => {
    try {
      const records = await getRecordsByKey(TABLE_NAMES.FILE, { name });
      return records;
    } catch (error) {
      console.log(error);
      throw new BadRequestError(error.message);
    }
  },
  getFileById: async (file_id) => {
    try {
      const record = await getRecordByKey(TABLE_NAMES.FILE, { _id: file_id });
      return ApiResponse("success", record);
    } catch (error) {
      console.log(error);
      throw new BadRequestError(error.message);
    }
  },
  updateFileUpload: async (file_id, uploadedFileName) => {
    try {
      const record = await getRecordByKey(TABLE_NAMES.FILE, { _id: file_id });
      record.fileNames.push(uploadedFileName);

      const data = await updateRecordsByKey(
        TABLE_NAMES.FILE,
        { _id: file_id },
        {
          fileNames: record.fileNames,
        }
      );
      if (data) {
        return { message: "File uploaded Successfully" };
      } else {
        return { message: "Something went wrong" };
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestError(error.message);
    }
  },
};
