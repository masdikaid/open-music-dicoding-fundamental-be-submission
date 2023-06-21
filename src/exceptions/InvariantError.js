const ClientError = require('./ClientError');
module.exports = class extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
};
