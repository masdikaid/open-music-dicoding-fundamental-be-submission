const {Pool} = require('pg');
const InvariantError = require('../exceptions/InvariantError');

module.exports = class {
    constructor() {
        this._pool = new Pool()
    }

    async _query({text, values, notFoundMessage}) {
        const results = await this._pool.query({text, values})
        if (!results.rows.length) throw new InvariantError(notFoundMessage)
        return results.rows
    }
}
