const {returnData, returnError, returnSuccess} = require("../../helpers/responses");
const Rover = require("./model");
const {roverCreateSchema, roverUpdateSchema} = require("./validation");
const {storeRoverImage, deleteRoverImage} = require("../image/service");
const {getUploadsPath} = require("../../helpers/folders");

/**
 * @api {get} /api/rovers Get all rovers
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
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

/**
 * @api {get} /api/rovers/:id Get rover by id
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.show = async function (req, res) {
  const rover = await Rover.findById(req.params.id);

  if (!rover) {
    return returnError(res,"Rover not found");
  }

  return returnData(res, rover);
};

/**
 * @api {post} /api/rovers Create new rover
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.store = async function (req, res) {
  try {
    const result = await roverCreateSchema.validateAsync(req.body);

    let image = null;
    if (req.files !== null) {
      image = await storeRoverImage(req.files.image);
    }

    await Rover.create({...result, ...(image ? {image} : {})});
  } catch (err) {
    return returnError(res, err.message);
  }

  return returnSuccess(res, "Rover created successfully");
};

/**
 * @api {put} /api/rovers/:id Update rover
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.update = async function (req, res) {
  const rover = await Rover.findById(req.params.id);

  if (!rover) {
    return returnError(res, "Rover not found");
  }

  try {
    const result = await roverUpdateSchema.validateAsync(req.body);

    let image = null;
    if (req.files !== null) {
      if (rover.image) {
        deleteRoverImage(rover.image);
      }
      image = await storeRoverImage(req.files.image);
    }

    await Rover.findByIdAndUpdate(req.params.id, {...result, ...(image ? {image} : {})});
  } catch (err) {
    return returnError(res, err.message);
  }

  return returnSuccess(res, "Rover updated successfully");
};

/**
 * @api {delete} /api/rovers/:id Delete rover
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.destroy = async function (req, res) {
  const rover = await Rover.findById(req.params.id);

  if (!rover) {
    return returnError(res, "Rover not found");
  }

  if (!req.user.isAdmin) {
    return returnError(res, "You can't delete this rover");
  }

  try {
    if (rover.image) {
      deleteRoverImage(rover.image);
    }

    await Rover.findByIdAndDelete(req.params.id);
  } catch (err) {
    return returnError(res, err.message);
  }

  return returnSuccess(res, "Rover deleted successfully");
};

/**
 * @api {get} /api/rovers/:id/image Get rover image
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.retrieveImage = async function (req, res) {
  const rover = await Rover.findById(req.params.id);

  if (!rover) {
    return returnError(res, "Rover not found");
  }

  if (!rover.image) {
    return returnError(res, "Rover has no image");
  }

  return res.sendFile(`${getUploadsPath()}/${rover.image}`);
};