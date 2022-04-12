const Joi = require("joi");
const Rover = require("./model");

/**
 * @description Check if rover name is taken
 * @param value
 * @param id
 * @returns {Promise<void>}
 */
async function checkIfNameIsTaken(value, id = null) {
  const rover = await Rover.findOne({
    name: value,
    ...(id ? { _id: { $ne: id } } : {}),
  });

  if (rover) {
    throw new Error("Already used: " + value);
  }
}

const roverCreateSchema = Joi.object({
  name: Joi.string()
    .required()
    .external(async (value) => {
      await checkIfNameIsTaken(value);
    }),
  launchDate: Joi.date().required(),
  constructionDate: Joi.date().required(),
  manufacturer: Joi.string().required(),
});

const roverUpdateSchema = Joi.object({
  name: Joi.string()
    .optional()
    .external(async (value, helpers) => {
      await checkIfNameIsTaken(value, helpers.prefs.context.req.params.id);
    }),
  launchDate: Joi.date().optional(),
  constructionDate: Joi.date().optional(),
  manufacturer: Joi.string().optional(),
});

module.exports = {
  roverCreateSchema,
  roverUpdateSchema,
};
