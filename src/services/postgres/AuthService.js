const BaseService = require('../../base/BaseService');
const InvariantError = require('../../exceptions/InvariantError');

module.exports = class extends BaseService {
  constructor() {
    super();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
      errWhenNoRows: false,
    };
    await this._query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
      errWhenNoRows: false,
    };
    const results = await this._query(query);
    if (!results.length) throw new InvariantError('Refresh token tidak valid');
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
      errWhenNoRows: false,
    };
    await this._query(query);
  }
};
