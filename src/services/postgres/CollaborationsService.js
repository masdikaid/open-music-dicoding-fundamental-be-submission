const BaseService = require('../../base/BaseService');
const AuthorizationError = require('../../exceptions/AuthorizationError');

module.exports = class extends BaseService {
  constructor() {
    super();
  }

  async addCollaboration({playlistId, userId}) {
    const result = await this._query({
      text: `INSERT INTO 
            collaborations (playlist_id, user_id) 
            VALUES ($1, $2) RETURNING id`,
      values: [playlistId, userId],
      notFoundMessage: 'Gagal menambahkan kolaborasi',
    });

    return result[0].id;
  }

  async deleteCollaboration({playlistId, userId}) {
    await this._query({
      text: `DELETE FROM collaborations 
            WHERE playlist_id = $1 AND user_id = $2 
            RETURNING id`,
      values: [playlistId, userId],
      notFoundMessage: 'Gagal menghapus kolaborasi',
    });
  }

  async verifyCollaborator(playlistId, userId) {
    const results = await this._query({
      text: `SELECT * FROM collaborations 
            WHERE playlist_id = $1 AND user_id = $2`,
      values: [playlistId, userId],
      errWhenNoRows: false,
    });

    if (!results.length) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
};
