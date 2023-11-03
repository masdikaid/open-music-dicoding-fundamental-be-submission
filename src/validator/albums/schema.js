const Joi = require('joi');

const albums = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2021).required(),
});

const cover = Joi.object({
  'content-type': Joi.string().
      valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png',
          'image/webp').
      required(),
}).unknown();

module.exports = {albums, cover};
