const ClientError = require('./ClientError');
module.exports = class extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
};
