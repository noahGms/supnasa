const { returnError, returnData } = require("../../helpers/responses");
const jwt = require("jsonwebtoken");
const User = require("../users/model");

/**
 * @api {post} /api/auth/login Login
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.login = async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return returnError(res, "Missing email or password");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return returnError(res, "Invalid email or password");
  }

  if (!(await user.comparePassword(password))) {
    return returnError(res, "Invalid email or password");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .json({ message: "Login successful" });
};

/**
 * @api {get} /api/auth/whoami Who am I?
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.whoami = function (req, res) {
  return returnData(res, req.user);
};
