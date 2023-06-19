const AlbumsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
    name: 'albums',
    version: '1.0.0',
    register: async function (server, {service, validator}) {
        const handler = new AlbumsHandler(service, validator)
        server.route(routes(handler))
    }
}
