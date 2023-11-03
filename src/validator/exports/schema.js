const Joi = require('joi');

module.exports = Joi.object({
  targetEmail: Joi.string().email({tlds: true}).required(),
});
