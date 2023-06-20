const {Pool} = require('pg');
const NotFoundError = require('../exceptions/NotFoundError');

module.exports = class {
    constructor() {
        this._pool = new Pool()
    }

    async _query({text, values, errWhenNoRows = true, notFoundMessage}) {
        const results = await this._pool.query({text, values})
        if (!results.rows.length && errWhenNoRows) throw new NotFoundError(notFoundMessage)
        return results.rows
    }
}
