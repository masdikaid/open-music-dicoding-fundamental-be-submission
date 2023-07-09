const BaseService = require('../../base/BaseService');

module.exports = class extends BaseService {
  constructor() {
    super();
  }

  async addSongPlaylist(playlistId, songId) {
    const result = await this._query({
      text: `INSERT INTO 
            songs_playlists(playlist_id, song_id) 
            VALUES($1, $2) RETURNING id`,
      values: [playlistId, songId],
      notFoundMessage: 'Gagal menambahkan lagu ke playlist',
    });
    return result[0].id;
  }

  async getSongsPlaylist(playlistId) {
    return await this._query({
      text: `SELECT songs.id, songs.title, songs.performer 
            FROM songs 
            LEFT JOIN songs_playlists ON songs_playlists.song_id = songs.id 
            WHERE songs_playlists.playlist_id = $1`,
      values: [playlistId],
      errWhenNoRows: false,
    });
  }

  async deleteSongPlaylist(playlistId, songId) {
    await this._query({
      text: `DELETE FROM songs_playlists 
            WHERE playlist_id = $1 AND song_id = $2 
            RETURNING id`,
      values: [playlistId, songId],
      notFoundMessage: 'Gagal menghapus lagu dari playlist. Id tidak ditemukan',
    });
  }
};
