const {
  PostCollaborationsPayloadSchema,
  DeleteCollaborationsPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

module.exports = {
  validatePostCollaborationsPayload: (payload) => {
    const validation = PostCollaborationsPayloadSchema.validate(payload);
    if (validation.error) throw new InvariantError(validation.error.message);
  },
  validateDeleteCollaborationsPayload: (payload) => {
    const validation = DeleteCollaborationsPayloadSchema.validate(payload);
    if (validation.error) throw new InvariantError(validation.error.message);
  },
};
