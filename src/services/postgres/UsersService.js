const BaseService = require('../../base/BaseService');
const Bycrypt = require('bcrypt');

module.exports = class extends BaseService {

    constructor() {
        super();
    }

    async getUsers() {
        return await this._query({
            text: 'SELECT id, username, fullname FROM users',
            errWhenNoRows: false,
        });
    }

    async addUser({username, password, fullname}) {
        const hashedPassword = await Bycrypt.hash(password, 10);
        const results = await this._query({
            text: `INSERT INTO users(username, password, fullname) VALUES($1, $2, $3) RETURNING id`,
            values: [username, hashedPassword, fullname],
            notFoundMessage: 'Gagal menambahkan user',
        });
        return results[0].id;
    }
    
    async getUserById(id) {
        const results = await this._query({
            text: `SELECT id, username, fullname FROM users WHERE id = $1`,
            values: [id],
            notFoundMessage: 'User tidak ditemukan',
        });
        return results[0];
    }

    async getUserByUsername(username) {
        const results = await this._query({
            text: `SELECT id, username, fullname FROM users WHERE username = $1`,
            values: [username],
            notFoundMessage: 'User tidak ditemukan',
        });
        return results[0];
    }
};
