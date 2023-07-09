module.exports = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.addPlaylistHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}',
    handler: handler.getPlaylistByIdHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}',
    handler: handler.deletePlaylistHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: handler.addSongToPlaylistHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/songs',
    handler: handler.getSongsFromPlaylistHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/songs',
    handler: handler.deleteSongFromPlaylistHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/activities',
    handler: handler.getActivitiesByPlaylistIdHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];
