require("dotenv").config()

const Hapi = require("@hapi/hapi")
const albumsPlugin = require("./api/albums")
const albumsValidator = require("./validator/albums")
const AlbumsService = require("./services/postgres/AlbumsService")

const init = async () => {
    const albumsService = new AlbumsService()
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
        }
    ])

    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
}

init()
