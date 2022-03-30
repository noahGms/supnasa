const Joi = require('joi');

const missionCreateSchema = Joi.object({
  country: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  rovers: Joi.array().items(Joi.string()).required(),
});

const missionUpdateSchema = Joi.object({
  country: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  rovers: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
  missionCreateSchema,
  missionUpdateSchema,
};