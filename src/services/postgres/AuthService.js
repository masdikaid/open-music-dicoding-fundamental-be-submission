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
    const results = await this._query({
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
      errWhenNoRows: false,
    });

    if (!results.length) throw new InvariantError('Refresh token tidak valid');
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);

    await this._query({
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
      errWhenNoRows: false,
    });
  }
};
