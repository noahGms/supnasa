const {
  returnData,
  returnSuccess,
  returnError,
} = require("../../helpers/responses");
const Mission = require("./model");
const { missionCreateSchema, missionUpdateSchema } = require("./validation");

/**
 * @api {get} /api/missions Get all missions
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.index = async function (req, res) {
  let sort = {};

  if (req.query.startDate) {
    sort.startDate = req.query.startDate;
  }

  if (req.query.endDate) {
    sort.endDate = req.query.endDate;
  }

  if (req.query.country) {
    sort.country = req.query.country;
  }

  const missions = await Mission.find()
    .sort({ ...sort })
    .populate("author")
    .populate("rovers");

  return returnData(res, missions);
};

/**
 * @api {get} /api/missions/:id Get mission by id
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.show = async function (req, res) {
  const mission = await Mission.findById(req.params.id)
    .populate("author")
    .populate("rovers");

  if (!mission) {
    return returnError(res, "Mission not found");
  }

  return returnData(res, mission);
};

/**
 * @api {post} /api/missions Create new mission
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.store = async function (req, res) {
  try {
    const result = await missionCreateSchema.validateAsync(req.body);

    if (result.rovers) {
      const missions = await Mission.find({
        $and: [
          { startDate: { $lte: result.startDate } },
          { endDate: { $gte: result.endDate } },
        ],
      });

      for (let rover of result.rovers) {
        for (let mission of missions) {
          if (mission.rovers.includes(rover)) {
            return returnError(
              res,
              `Rover ${rover} already assigned to another mission`
            );
          }
        }
      }
    }

    await Mission.create({ ...result, author: req.user._id });
  } catch (err) {
    return returnError(res, err.message);
  }

  return returnSuccess(res, "Mission created successfully");
};

/**
 * @api {put} /api/missions/:id Update mission
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.update = async function (req, res) {
  const mission = await Mission.findById(req.params.id);

  if (!mission) {
    return returnError(res, "Mission not found");
  }

  try {
    const result = await missionUpdateSchema.validateAsync(req.body);

    const rovers = result.rovers;
    delete result.rovers;
    await Mission.findByIdAndUpdate(req.params.id, result);

    if (rovers) {
      const mission = await Mission.findById(req.params.id);

      const missions = await Mission.find({
        $and: [
          { startDate: { $lte: mission.startDate } },
          { endDate: { $gte: mission.endDate } },
          { _id: { $ne: mission._id } },
        ],
      });

      for (let rover of rovers) {
        for (let mission of missions) {
          if (mission.rovers.includes(rover)) {
            return returnError(
              res,
              `Rover ${rover} already assigned to another mission`
            );
          }
        }
      }

      await Mission.findByIdAndUpdate(req.params.id, { rovers });
    }
  } catch (err) {
    return returnError(res, err.message);
  }

  return returnSuccess(res, "Mission updated successfully");
};

/**
 * @api {delete} /api/missions/:id Delete mission
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.destroy = async function (req, res) {
  const mission = await Mission.findById(req.params.id);

  if (!mission) {
    return returnError(res, "Mission not found");
  }

  if (!mission.author._id.equals(req.user._id) && !req.user.isAdmin) {
    return returnError(res, "You can't delete this mission");
  }

  await Mission.findByIdAndDelete(req.params.id);

  return returnSuccess(res, "Mission deleted successfully");
};
