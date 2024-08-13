function ApiResponse(status, data) {
  let responseData = {
    status: status,
  };
  if (data) responseData.data = data;
  return responseData;
}

module.exports = {
  ApiResponse,
};
