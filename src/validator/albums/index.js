const schema = require('./schema')

module.exports = payload => {
    const validation = schema.validate(payload)
    if (validation.error) throw new Error(validation.error.message)
}
