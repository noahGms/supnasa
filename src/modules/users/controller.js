const User = require("./model");
const {returnData, returnError, returnSuccess} = require("../../helpers/responses");
const {userCreateSchema, userUpdateSchema} = require("./validation");

/**
 * @api {get} /api/users Get all users
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.index = async function (req, res) {
  const users = await User.find();
  return returnData(res, users);
};

/**
 * @api {get} /api/users/:id Get user by id
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.show = async function (req, res) {
  const user = await User.findById(req.params.id);

  if (!user) {
    return returnError(res, "User not found");
  }

  return returnData(res, user);
};

/**
 * @api {post} /api/users Create new user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.store = async function (req, res) {
  try {
    const result = await userCreateSchema.validateAsync(req.body);
    await User.create(result);
  } catch (error) {
    return returnError(res, error.message);
  }

  return returnSuccess(res, "User created successfully");
};

/**
 * @api {put} /api/users/:id Update user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.update = async function (req, res) {
  const user = await User.findById(req.params.id);

  if (!user) {
    return returnError(res, "User not found");
  }

  if (!user._id.equals(req.user._id) && !req.user.isAdmin) {
    return returnError(res, "You can't update this user");
  }

  try {
    const result = await userUpdateSchema.validateAsync(req.body);
    await User.findByIdAndUpdate(req.params.id, result);
  } catch (error) {
    return returnError(res, error.message);
  }

  return returnSuccess(res, "User updated successfully");
};

/**
 * @api {delete} /api/users/:id Delete user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.destroy = async function (req, res) {
  const user = await User.findById(req.params.id);

  if (!user) {
    return returnError(res, "User not found");
  }

  if (!user._id.equals(req.user._id)) {
    return returnError(res, "You can't delete this user");
  }

  await User.findByIdAndDelete(req.params.id);

  return returnSuccess(res, "User deleted successfully");
};