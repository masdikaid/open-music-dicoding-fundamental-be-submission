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
      text: `SELECT
                        a.id,
                        a.name,
                        a.year,
                        (
                            SELECT
                                COALESCE(
                                    JSON_AGG(
                                        JSON_BUILD_OBJECT(
                                            'id', s.id,
                                            'title', s.title,
                                            'performer', s.performer
                                        )
                                ),
                            '[]'
                        )
                    FROM
                        songs s
                    WHERE
                        s.album_id = a.id
                        ) AS songs
                    FROM
                        albums a
                    LEFT JOIN songs s ON s.album_id = a.id
                    WHERE
                        a.id = $1
                    GROUP BY
                        a.id, a.name, a.year`,
      values: [id],
      notFoundMessage: 'Album tidak ditemukan',
    });
    return results[0];
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
