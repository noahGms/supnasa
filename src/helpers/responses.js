exports.returnError = async function (res, message) {
  return res.status(400).json({
    error: message
  });
};

exports.returnSuccess = async function (res, message) {
  return res.status(200).json({
    message
  });
};

exports.returnSuccessWithData = async function (res, message, data) {
  return res.status(200).json({
    message,
    data
  });
};

exports.returnData = async function (res, data) {
  return res.status(200).json({
    data
  });
};

exports.returnUnAuthorized = function (res, message) {
  return res.status(401).json({
    error: message
  });
};