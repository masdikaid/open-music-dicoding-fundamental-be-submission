const {
  PostPlaylistPayloadSchema,
  PostSongPlaylistPayloadSchema,
  DeleteSongPlaylistPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

module.exports = {
  validatePostPlaylistPayload: (payload) => {
    const validation = PostPlaylistPayloadSchema.validate(payload);
    if (validation.error) throw new InvariantError(validation.error.message);
  },
  validatePostSongPlaylistPayload: (payload) => {
    const validation = PostSongPlaylistPayloadSchema.validate(payload);
    if (validation.error) throw new InvariantError(validation.error.message);
  },
  validateDeleteSongPlaylistPayload: (payload) => {
    const validation = DeleteSongPlaylistPayloadSchema.validate(payload);
    if (validation.error) throw new InvariantError(validation.error.message);
  },
};
