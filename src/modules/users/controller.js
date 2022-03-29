const User = require("./model");
const {returnData, returnError, returnSuccess} = require("../../helpers/responses");
const {userCreateSchema} = require("./validation");

exports.index = async (req, res) => {
  const users = await User.find();
  return returnData(res, users);
};

exports.show = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return returnError(res, "User not found");
  }

  return returnData(res, user);
};

exports.store = async (req, res) => {
  try {
    const result = await userCreateSchema.validateAsync(req.body);
    await User.create(result);
  } catch (error) {
    return returnError(res, error.message);
  }

  return returnSuccess(res, "User created successfully");
};
