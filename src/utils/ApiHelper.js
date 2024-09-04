function ApiResponse(status, data) {
  let responseData = {
    status: status,
    data:null
  };
  if (data) responseData.data = data;
  return responseData;
}

module.exports = {
  ApiResponse,
};
