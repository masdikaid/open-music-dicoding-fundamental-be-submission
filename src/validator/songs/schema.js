const Joi = require('joi');

module.exports = Joi.object({
    title: Joi.string().required(),
    performer: Joi.string().required(),
    genre: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(2021).required(),
    duration: Joi.number().integer().min(0).max(1000).optional(),
    albumId: Joi.string().optional(),
})
