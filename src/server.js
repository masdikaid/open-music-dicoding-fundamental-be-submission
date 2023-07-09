require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const tokenManager = require('./tokenize/TokenManager');
const albumsPlugin = require('./api/albums');
const SongsPlugin = require('./api/songs');
const usersPlugin = require('./api/users');
const authPlugin = require('./api/authentications');
const playlistsPlugin = require('./api/playlists');
const albumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const usersValidator = require('./validator/users');
const authenticationsValidator = require('./validator/authentications');
const playlistsValidator = require('./validator/playlists');
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AuthenticationsService = require('./services/postgres/AuthService');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const SongsPlaylistService = require(
  './services/postgres/SongsPlaylistService');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const songsPlaylistService = new SongsPlaylistService();

  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('musicsapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        username: artifacts.decoded.payload.username,
        fullname: artifacts.decoded.payload.fullname,
      },
    }),
  });

  await server.register([
    {
      plugin: albumsPlugin,
      options: {
        service: albumsService,
        songsService: songsService,
        validator: albumsValidator,
      },
    },
    {
      plugin: SongsPlugin,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: usersPlugin,
      options: {
        service: usersService,
        validator: usersValidator,
      },
    },
    {
      plugin: authPlugin,
      options: {
        service: authenticationsService,
        userService: usersService,
        validator: authenticationsValidator,
        tokenManager: tokenManager,
      },
    },
    {
      plugin: playlistsPlugin,
      options: {
        service: playlistsService,
        songsPlaylistService: songsPlaylistService,
        songsService: songsService,
        validator: playlistsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const {response} = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: response.message,
        }).code(response.statusCode);
      }

      if (response.isServer) h.continue;

      let statusCode;
      let message;
      switch (response.code) {
        case '23505':
          statusCode = 400;
          message = 'Username sudah digunakan';
          break;
        default:
          statusCode = response.output.statusCode || 500;
          message = response.message ||
            'Maaf, terjadi kegagalan pada server kami';
          break;
      }

      return h.response({
        status: 'fail',
        message: message,
      }).code(statusCode);
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
