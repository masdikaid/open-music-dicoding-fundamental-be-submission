const BaseService = require('../../base/BaseService');
module.exports = class extends BaseService {
  constructor() {
    super();
  }

  async addAlbum({name, year}) {
    const results = await this._query({
      text: 'INSERT INTO albums(name, year) VALUES($1, $2) RETURNING id',
      values: [name, year],
      notFoundMessage: 'Gagal menambahkan album',
    });

    return results[0].id;
  }

  async getAlbumById(id) {
    const results = await this._query({
      text: `SELECT id, 
						name, 
						year, 
						CASE WHEN cover_url IS NOT NULL 
						THEN CONCAT('http://${process.env.HOST}:${process.env.PORT}/', cover_url) 
						ELSE NULL END as "coverUrl"  
						FROM albums WHERE id = $1`,
      values: [id],
      notFoundMessage: 'Album tidak ditemukan',
    });

    return results[0];
  }

  async addAlbumCover(id, filename) {
    const results = await this._query({
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [filename, id],
      notFoundMessage: 'Gagal memperbarui cover. album tidak ditemukan',
    });

    return results[0].id;
  }

  async editAlbumById(id, {name, year}) {
    await this._query({
      text: `UPDATE albums 
                SET name = $1, year = $2, updated_at = current_timestamp 
                WHERE id = $3 
                RETURNING id`,
      values: [name, year, id],
      notFoundMessage: 'Gagal memperbarui album. album tidak ditemukan',
    });
  }

  async deleteAlbumById(id) {
    await this._query({
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
      notFoundMessage: 'Gagal menghapus album. album tidak ditemukan',
    });
  }
};
