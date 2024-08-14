const users = require('../models/User');
const updateRecordsByKey = async function (TABLENAME, filter, update) {
  try {
    return await TABLENAME.findOneAndUpdate(filter, update, {new: true});
  } catch (error) {
    return error.message;
  }
};

const deleteRecordsById = async function (TABLENAME, id) {
  try {
    return await TABLENAME.findByIdAndDelete(id);
  } catch (error) {
    return error.message;
  }
};
const getRecordByKey = async function (TABLENAME, filter) {
  try {
    return await TABLENAME.findOne(filter);
  } catch (error) {
    return error.message;
  }
};
const getRecordsByKey = async function (TABLENAME, filter) {
  try {
    return await TABLENAME.find(filter);
  } catch (error) {
    return error.message;
  }
};
const insertRecord = async function (TABLENAME, insertObj) {
  try {
    const record = await TABLENAME.create(insertObj);
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
};
