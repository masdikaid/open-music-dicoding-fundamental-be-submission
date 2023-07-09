const PlaylistsHandler = require('./PlaylistsHandler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async function(
      server, {
        service,
        songsPlaylistService,
        songsService,
        collaboratorService,
        validator,
      }) {
    const handler = new PlaylistsHandler(
        service,
        songsPlaylistService,
        songsService,
        collaboratorService,
        validator);
    server.route(routes(handler));
  },
};
