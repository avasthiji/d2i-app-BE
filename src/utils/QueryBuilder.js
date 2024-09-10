const users = require("../models/User");
const updateRecordsByKey = async function (TABLENAME, filter, update) {
  try {
    const updatedData = await TABLENAME.findOneAndUpdate(filter, update, {
      new: true,
    });
    return updatedData;
  } catch (error) {
    return error.message;
  }
};

const deleteRecordsById = async function (TABLENAME, id) {
  try {
    const response = await TABLENAME.findByIdAndDelete(id);
    return response;
  } catch (error) {
    return error.message;
  }
};
const getRecordByKey = async function (TABLENAME, filter) {
  try {
    const record = await TABLENAME.findOne(filter);
    return record;
  } catch (error) {
    return error.message;
  }
};
const getRecordsByKey = async function (TABLENAME, filter) {
  try {
    const records = await TABLENAME.find(filter);
    return records;
  } catch (error) {
    return error.message;
  }
};
const insertRecord = async function (TABLENAME, insertObj) {
  try {
    const record = await TABLENAME.create(insertObj);
    return record;
  } catch (error) {
    throw error;
  }
};

const getLatestRecordByKey = async function (
  TABLENAME,
  filter,
  sortField,
  sortOrder = "desc"
) {
  try {
    const record = await TABLENAME.findOne(filter).sort({
      [sortField]: sortOrder === "desc" ? -1 : 1,
    });
    return record;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  updateRecordsByKey,
  getRecordsByKey,
  getRecordByKey,
  deleteRecordsById,
  insertRecord,
  getLatestRecordByKey,
};
