const BaseService = require('../../base/BaseService');
module.exports = class extends BaseService {
  constructor() {
    super();
  }

  async getSongs({title, performer}) {
    let query = 'SELECT id, title, performer FROM songs';
    if (title) query += ` WHERE LOWER(title) LIKE '%${title.toLowerCase()}%'`;
    if (performer) {
      query += title ?
          ` AND LOWER(performer) LIKE '%${performer.toLowerCase()}%'` :
          ` WHERE LOWER(performer) LIKE '%${performer.toLowerCase()}%'`;
    }
    return await this._query({
      text: query,
      errWhenNoRows: false,
    });
  }

  async getSongById(id) {
    const results = await this._query({
      text: `SELECT 
                id, 
                title, 
                year, 
                performer, 
                genre, 
                duration, 
                album_id as albumId 
                FROM songs WHERE id = $1`,
      values: [id],
      notFoundMessage: 'Lagu tidak ditemukan',
    });
    return results[0];
  }

  async addSong({title, year, performer, genre, duration, albumId}) {
    const results = await this._query({
      text: `INSERT INTO 
                songs(title, year, performer, genre, duration, album_id) 
                VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
      values: [title, year, performer, genre, duration, albumId],
      notFoundMessage: 'Gagal menambahkan lagu',
    });
    return results[0].id;
  }

  async editSongById(id, {title, year, performer, genre, duration, albumId}) {
    await this._query({
      text: `UPDATE songs 
                SET title = $1, 
                year = $2, 
                performer = $3, 
                genre = $4, 
                duration = $5, 
                album_id = $6, 
                updated_at = current_timestamp 
                WHERE id = $7 RETURNING id`,
      values: [title, year, performer, genre, duration, albumId, id],
      notFoundMessage: 'Gagal memperbarui lagu. Lagu tidak ditemukan',
    });
  }

  async deleteSongById(id) {
    await this._query({
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
      notFoundMessage: 'Gagal menghapus lagu. Lagu tidak ditemukan',
    });
  }
};
