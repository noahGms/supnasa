const {returnError, returnData} = require("../../helpers/responses");
const jwt = require('jsonwebtoken');
const User = require("../users/model");

exports.login = async function(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return returnError(res, 400, "Missing email or password");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return returnError(res, "Invalid email or password");
  }

  if (!await user.comparePassword(password)) {
    return returnError(res,"Invalid email or password");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  return res
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .json({message: "Login successful"});
};

exports.whoami = function(req, res) {
  return returnData(res, req.user);
};