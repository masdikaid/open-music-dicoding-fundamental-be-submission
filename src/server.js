require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albumsPlugin = require('./api/albums');
const SongsPlugin = require('./api/songs');
const usersPlugin = require('./api/users');
const albumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const usersValidator = require('./validator/users');
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
    const albumsService = new AlbumsService();
    const songsService = new SongsService();
    const usersService = new UsersService();

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
            plugin: albumsPlugin,
            options: {
                service: albumsService,
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

            let statusCode, message;
            switch (response.code) {
                case '23505':
                    statusCode = 400;
                    message = 'Username sudah digunakan';
                    break;
                default:
                    statusCode = 500;
                    message = 'Maaf, terjadi kegagalan pada server kami.';
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
