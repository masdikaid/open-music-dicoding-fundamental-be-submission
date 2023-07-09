const PlaylistsHandler = require('./CollaborationsHandler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async function(
      server, {service, playlistsService, usersService, validator}) {
    const handler = new PlaylistsHandler(service, playlistsService,
        usersService, validator);
    server.route(routes(handler));
  },
};
