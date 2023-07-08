const UsersHandler = require('./UsersHandler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async function(server, {service, validator}) {
    const handler = new UsersHandler(service, validator);
    server.route(routes(handler));
  },
};
