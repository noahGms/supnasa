const Joi = require("joi");
const User = require("./model");

/**
 * @description Check if email is taken
 * @param value
 * @param id
 * @returns {Promise<void>}
 */
async function checkIfEmailIsTaken(value, id = null) {
  const user = await User.findOne({
    email: value,
    ...(id ? { _id: { $ne: id } } : {}),
  });

  if (user) {
    throw new Error("Email is already taken " + value);
  }
}

/**
 * @description Check if pseudo is taken
 * @param value
 * @param id
 * @returns {Promise<void>}
 */
async function checkIfPseudoIsTaken(value, id = null) {
  const user = await User.findOne({
    pseudo: value,
    ...(id ? { _id: { $ne: id } } : {}),
  });

  if (user) {
    throw new Error("Pseudo is already taken " + value);
  }
}

const userCreateSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .external(async (value) => {
      await checkIfEmailIsTaken(value);
    }),
  pseudo: Joi.string()
    .required()
    .external(async (value) => {
      await checkIfPseudoIsTaken(value);
    }),
  password: Joi.string().required(),
});

const userUpdateSchema = Joi.object({
  email: Joi.string()
    .email()
    .optional()
    .external(async (value, helpers) => {
      await checkIfEmailIsTaken(value, helpers.prefs.context.req.params.id);
    }),
  pseudo: Joi.string()
    .optional()
    .external(async (value, helpers) => {
      await checkIfPseudoIsTaken(value, helpers.prefs.context.req.params.id);
    }),
  password: Joi.string().optional(),
});

module.exports = {
  userCreateSchema,
  userUpdateSchema,
};
