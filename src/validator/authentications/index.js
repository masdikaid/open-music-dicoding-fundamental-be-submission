const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

module.exports = {
  validatePostAuthenticationPayload: (payload) => {
    const validation = PostAuthenticationPayloadSchema.validate(payload);
    if (validation.error) {
      throw new InvariantError(
          validation.error.message);
    }
  },
  validatePutAuthenticationPayload: (payload) => {
    const validation = PutAuthenticationPayloadSchema.validate(payload);
    if (validation.error) {
      throw new InvariantError(
          validation.error.message);
    }
  },
  validateDeleteAuthenticationPayload: (payload) => {
    const validation = DeleteAuthenticationPayloadSchema.validate(payload);
    if (validation.error) {
      throw new InvariantError(
          validation.error.message);
    }
  },
};
