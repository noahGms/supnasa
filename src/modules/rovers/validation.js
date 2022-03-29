const Joi = require('joi');

const roverCreateSchema = Joi.object({
  name: Joi.string().required(),
  launchDate: Joi.date().required(),
  constructionDate: Joi.date().required(),
  manufacturer: Joi.string().required(),
});

const roverUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  launchDate: Joi.date().optional(),
  constructionDate: Joi.date().optional(),
  manufacturer: Joi.string().optional(),
});

module.exports = {
  roverCreateSchema,
  roverUpdateSchema,
};