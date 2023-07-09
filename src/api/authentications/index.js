const AuthHandler = require('./AuthHandler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async function(
      server, {service, userService, tokenManager, validator}) {
    const handler = new AuthHandler(service, userService, tokenManager,
        validator);
    server.route(routes(handler));
  },
};
