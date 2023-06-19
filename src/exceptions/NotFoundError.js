const ClientError = require('./ClientError')
module.exports = class extends ClientError {
    constructor(message) {
        super(message, 404)
        this.name = 'NotFoundError'
    }
}
