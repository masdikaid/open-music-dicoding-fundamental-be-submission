const schema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

module.exports = {
  validateAlbumsPayload: (payload) => {
    const validation = schema.albums.validate(payload);
    if (validation.error) throw new InvariantError(validation.error.message);
  },
  validateAlbumsCoverPayload: (payload) => {
    const validation = schema.cover.validate(payload);
    if (validation.error) throw new InvariantError(validation.error.message);
  },
};
