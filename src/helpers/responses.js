/**
 * @description Return an 400 error
 * @param res
 * @param message
 * @returns {*}
 */
exports.returnError = function (res, message) {
  return res.status(400).json({
    error: message,
  });
};

/**
 * @description Return an 200 success with message
 * @param res
 * @param message
 * @returns {*}
 */
exports.returnSuccess = function (res, message) {
  return res.status(200).json({
    message,
  });
};

/**
 * @description Return an 200 success with message and data
 * @param res
 * @param message
 * @param data
 * @returns {*}
 */
exports.returnSuccessWithData = function (res, message, data) {
  return res.status(200).json({
    message,
    data,
  });
};

/**
 * @description Return an 200 success with data
 * @param res
 * @param data
 * @returns {*}
 */
exports.returnData = function (res, data) {
  return res.status(200).json({
    data,
  });
};

/**
 * @description Return an 401 unauthorized error
 * @param res
 * @param message
 * @returns {*}
 */
exports.returnUnAuthorized = function (res, message) {
  return res.status(401).json({
    error: message,
  });
};
