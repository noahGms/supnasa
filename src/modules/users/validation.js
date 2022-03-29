const Joi = require('joi');

const userCreateSchema = Joi.object({
  email: Joi.string().email().required(),
  pseudo: Joi.string().required(),
  password: Joi.string().required(),
});

const userUpdateSchema = Joi.object({
  email: Joi.string().email().optional(),
  pseudo: Joi.string().optional(),
  password: Joi.string().optional(),
});

module.exports = {
  userCreateSchema,
  userUpdateSchema,
};