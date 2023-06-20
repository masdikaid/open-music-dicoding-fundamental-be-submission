const {Pool} = require('pg');

module.exports = class {
    constructor() {
        this._pool = new Pool();
    }


}
