const {returnUnAuthorized, returnError} = require("../helpers/responses");
const User = require("../modules/users/model");
const jwt = require("jsonwebtoken");

/**
 * @description Middleware to check if the user is authenticated
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
exports.isAuth = async function (req, res, next) {
  const token = req.cookies.access_token;

  if (!token) {
    return returnUnAuthorized(res, 'No token provided');
  }

  try {
    const {id} = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    return next();
  } catch (err) {
    return returnUnAuthorized(res, 'Invalid token');
  }

  return returnError(res, 'Unauthorized');
};