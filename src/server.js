require("dotenv").config()

const Hapi = require("@hapi/hapi")
const albumsPlugin = require("./api/albums")
const SongsPlugin = require("./api/songs")
const albumsValidator = require("./validator/albums")
const SongsValidator = require("./validator/songs")
const AlbumsService = require("./services/postgres/AlbumsService")
const SongsService = require("./services/postgres/SongsService")

const init = async () => {
    const albumsService = new AlbumsService()
    const songsService = new SongsService()
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST || "localhost",
        routes: {
            cors: {
                origin: ["*"]
            }
        }
    })

    await server.register([
        {
            plugin: albumsPlugin,
            options: {
                service: albumsService,
                validator: albumsValidator
            }
        },
        {
            plugin: SongsPlugin,
            options: {
                service: songsService,
                validator: SongsValidator
            }
        }
    ])

    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
}

init()
