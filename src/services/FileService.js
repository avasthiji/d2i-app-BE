const mongoose = require("mongoose");
const { BadRequestError } = require("../exceptions");
const { TABLE_NAMES } = require("../utils/db");
const {
  insertRecord,
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
      throw new BadRequestError(error.message);
    }
  },
  getAllFiles: async (userRole, name) => {
    try {
      let records;
      if (userRole === "ADMIN") {
        records = await getRecordByKey(TABLE_NAMES.FILE, { name });
      } else {
        records = await getRecordByKey(TABLE_NAMES.FILE, { name });
        if (records) {
          const filteredFileNames = records.fileNames.filter(
            (file) => file.is_active === true
          );
          return {
            ...records._doc, // Return all other fields in the document
            fileNames: filteredFileNames, // Return the filtered fileNames array
          };
        } else {
          return null;
        }
      }
      return  records;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },
  lookForFile: async (name) => {
    try {
      const record = await getRecordByKey(TABLE_NAMES.FILE, { name });

      return record;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },
  getFileById: async (file_id) => {
    try {
      const record = await getRecordByKey(TABLE_NAMES.FILE, {
        "fileNames._id": file_id,
      });
      const value = record.fileNames.filter((data) => {
        if (data._id.toString() === file_id) {
          return data;
        }
      });
      return value;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },
  updateFileStatus: async (file_id, is_active, names) => {
    try {
      const response = await TABLE_NAMES.FILE.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(file_id) }, // Match the document by _id
        [
          {
            $set: {
              fileNames: {
                $map: {
                  input: "$fileNames", // Iterate over each element in the fileNames array
                  as: "elem", // Alias for each array element
                  in: {
                    $cond: {
                      if: {
                        $in: [
                          "$$elem._id",
                          names.map(
                            (name) => new mongoose.Types.ObjectId(name)
                          ),
                        ],
                      }, // Check if elem._id is in the names array
                      then: {
                        $mergeObjects: ["$$elem", { is_active: is_active }], // Update is_active field
                      },
                      else: "$$elem", // Leave the element unchanged if not in names array
                    },
                  },
                },
              },
            },
          },
        ],
        { new: true } // Option to return the updated document
      );

      return response;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },
  updateFileUpload: async (file_id, uploadedFileName) => {
    try {
      const record = await getRecordByKey(TABLE_NAMES.FILE, { _id: file_id });
      record.fileNames.push({ name: uploadedFileName });

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
      throw new BadRequestError(error.message);
    }
  },
  softDeleteFile: async (file_id, names) => {
    try {
      const response = await TABLE_NAMES.FILE.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(file_id) }, // Match the document by _id
        [
          {
            $set: {
              fileNames: {
                $map: {
                  input: "$fileNames", 
                  as: "elem", // Alias for each array element
                  in: {
                    $cond: {
                      if: {
                        $in: [
                          "$$elem._id",
                          names.map(
                            (name) => new mongoose.Types.ObjectId(name)
                          ),
                        ],
                      }, // Check if elem._id is in the names array
                      then: {
                        $mergeObjects: ["$$elem", { is_active: false }], // Update is_active field
                      },
                      else: "$$elem", // Leave the element unchanged if not in names array
                    },
                  },
                },
              },
            },
          },
        ],
        { new: true } // Option to return the updated document
      );

      return response;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  },
};
