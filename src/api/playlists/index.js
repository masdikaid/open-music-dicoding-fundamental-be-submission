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
        activitiesService,
        validator,
      }) {
    const handler = new PlaylistsHandler(
        service,
        songsPlaylistService,
        songsService,
        collaboratorService,
        activitiesService,
        validator);
    server.route(routes(handler));
  },
};
