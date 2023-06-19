const Hapi = require("@hapi/hapi")
const albumsPlugin = require("./api/albums")

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
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
                service: {}
            }
        }
    ])

    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
}

init()
