const Joi = require('joi');

module.exports = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2021).required(),
});
