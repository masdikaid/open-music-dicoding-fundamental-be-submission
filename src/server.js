require('dotenv').config();
const path = require('path');
const ClientError = require('./exceptions/ClientError');

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const tokenManager = require('./tokenize/TokenManager');
const albumsPlugin = require('./api/albums');
const SongsPlugin = require('./api/songs');
const usersPlugin = require('./api/users');
const authPlugin = require('./api/authentications');
const playlistsPlugin = require('./api/playlists');
const collaborationsPlugin = require('./api/collaborations');
const uploadsPlugin = require('./api/uploads');
const exportsPlugin = require('./api/exports');
const albumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const usersValidator = require('./validator/users');
const authenticationsValidator = require('./validator/authentications');
const playlistsValidator = require('./validator/playlists');
const collaborationsValidator = require('./validator/collaborations');
const exportsValidator = require('./validator/exports');
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AuthenticationsService = require('./services/postgres/AuthService');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const ActivitiesService = require('./services/postgres/ActivitiesService');
const CacheService = require('./services/redis/CacheService');
const ExportsService = require('./services/rabbitmq/ProducerService');
const StorageService = require('./services/storage/StorageService');
const CollaborationsService = require(
  './services/postgres/CollaborationsService',
);
const SongsPlaylistService = require(
  './services/postgres/SongsPlaylistService',
);

const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumsService(cacheService);
  const playlistsService = new PlaylistsService(cacheService);
  const collaborationsService = new CollaborationsService(cacheService);
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const songsPlaylistService = new SongsPlaylistService();
  const activitiesService = new ActivitiesService();
  const exportsService = new ExportsService();
  const storageService = new StorageService(
    path.resolve(__dirname, '../uploads'),
  );

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
    {
      plugin: Inert,
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
        storageService: storageService,
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
        collaboratorService: collaborationsService,
        activitiesService: activitiesService,
        validator: playlistsValidator,
      },
    },
    {
      plugin: collaborationsPlugin,
      options: {
        service: collaborationsService,
        playlistsService: playlistsService,
        usersService: usersService,
        validator: collaborationsValidator,
      },
    },
    {
      plugin: exportsPlugin,
      options: {
        service: exportsService,
        playlistService: playlistsService,
        validator: exportsValidator,
      },
    },
    {
      plugin: uploadsPlugin,
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
