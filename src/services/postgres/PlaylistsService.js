const BaseService = require('../../base/BaseService');
const AuthorizationError = require('../../exceptions/AuthorizationError');

module.exports = class extends BaseService {
  constructor() {
    super();
  }

  async addPlaylist(name, owner) {
    const result = await this._query({
      text: 'INSERT INTO playlists(name, owner) VALUES($1, $2) RETURNING id',
      values: [name, owner],
      notFoundMessage: 'Gagal menambahkan playlist',
    });

    return result[0].id;
  }

  async verifyPlaylistAccess(
      playlistId, credentialId, errWhenUnverified = true) {
    const playlist = await this._query({
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
      notFoundMessage: 'Playlist tidak ditemukan',
    });

    if (playlist[0].owner !== credentialId) {
      if (errWhenUnverified) {
        throw new AuthorizationError(
            'Anda tidak berhak mengakses resource ini');
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  async getPlaylists(owner) {
    return await this._query({
      text: `SELECT playlists.id, playlists.name, users.username
            FROM playlists
            LEFT JOIN users ON users.id = playlists.owner
            LEFT JOIN collaborations 
            ON collaborations.playlist_id = playlists.id
            WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
      errWhenNoRows: false,
    });
  }

  async getPlaylistById(id) {
    const result = await this._query({
      text: `SELECT playlists.id, playlists.name, users.username 
            FROM playlists 
            LEFT JOIN users ON users.id = playlists.owner 
            WHERE playlists.id = $1`,
      values: [id],
      notFoundMessage: 'Playlist tidak ditemukan',
    });

    return result[0];
  }

  async deletePlaylist(id) {
    await this._query({
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
      notFoundMessage: 'Gagal menghapus playlist. Id tidak ditemukan',
    });
  }
};
