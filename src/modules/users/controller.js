const User = require("./model");
const {returnData, returnError, returnSuccess} = require("../../helpers/responses");
const {userCreateSchema, userUpdateSchema} = require("./validation");

exports.index = async function (req, res) {
  const users = await User.find();
  return returnData(res, users);
};

exports.show = async function (req, res) {
  const user = await User.findById(req.params.id);

  if (!user) {
    return returnError(res, "User not found");
  }

  return returnData(res, user);
};

exports.store = async function (req, res) {
  try {
    const result = await userCreateSchema.validateAsync(req.body);
    await User.create(result);
  } catch (error) {
    return returnError(res, error.message);
  }

  return returnSuccess(res, "User created successfully");
};

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