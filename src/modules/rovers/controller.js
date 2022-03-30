const {returnData, returnError, returnSuccess} = require("../../helpers/responses");
const Rover = require("./model");
const {roverCreateSchema, roverUpdateSchema} = require("./validation");

exports.index = async function (req, res) {
  let limit = 10;
  let sort = {};

  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }

  if (req.query.name) {
    sort.name = req.query.name;
  }

  if (req.query.date) {
    sort.launchDate = req.query.date;
    sort.constructionDate = req.query.date;
  }

  const rovers = await Rover.find().sort({...sort}).limit(limit);
  return returnData(res, rovers);
};

exports.show = async function (req, res) {
  const rover = await Rover.findById(req.params.id);

  if (!rover) {
    return returnError(res,"Rover not found");
  }

  return returnData(res, rover);
};

exports.store = async function (req, res) {
  try {
    const result = await roverCreateSchema.validateAsync(req.body);
    await Rover.create(result);
  } catch (err) {
    return returnError(res, err.message);
  }

  return returnSuccess(res, "Rover created successfully");
};

exports.update = async function (req, res) {
  const rover = await Rover.findById(req.params.id);

  if (!rover) {
    return returnError(res, "Rover not found");
  }

  try {
    const result = await roverUpdateSchema.validateAsync(req.body);
    await Rover.findByIdAndUpdate(req.params.id, result);
  } catch (err) {
    return returnError(res, err.message);
  }

  return returnSuccess(res, "Rover updated successfully");
};

exports.destroy = async function (req, res) {
  const rover = await Rover.findById(req.params.id);

  if (!rover) {
    return returnError(res, "Rover not found");
  }

  if (!req.user.isAdmin) {
    return returnError(res, "You can't delete this rover");
  }

  await Rover.findByIdAndDelete(req.params.id);

  return returnSuccess(res, "Rover deleted successfully");
};