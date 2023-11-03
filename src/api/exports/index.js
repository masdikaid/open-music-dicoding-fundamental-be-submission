const ExportsHandler = require('./ExportsHandler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async function(server, {service, playlistService, validator}) {
    const handler = new ExportsHandler(service, playlistService, validator);
    server.route(routes(handler));
  },
};
