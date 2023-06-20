const schema = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

module.exports = payload => {
    const validation = schema.validate(payload)
    if (validation.error) throw new InvariantError(validation.error.message)
}
