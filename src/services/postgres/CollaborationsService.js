const BaseService = require('../../base/BaseService');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const autoBind = require('auto-bind');

module.exports = class extends BaseService {
  constructor(cacheService) {
    super();
    this._cacheService = cacheService;
    autoBind(this);
  }

  async addCollaboration({playlistId, userId}) {
    const result = await this._query({
      text: `INSERT INTO 
            collaborations (playlist_id, user_id) 
            VALUES ($1, $2) RETURNING id`,
      values: [playlistId, userId],
      notFoundMessage: 'Gagal menambahkan kolaborasi',
    });

    this._cacheService.delete(`playlists:${userId}`);

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

    this._cacheService.delete(`playlists:${userId}`);
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
