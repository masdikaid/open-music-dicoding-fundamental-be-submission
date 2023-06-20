const {Pool} = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
module.exports = class {
    constructor() {
        this._pool = new Pool()
    }

    async addAlbum({name, year}) {
        const results = await this._pool.query({
            text: 'INSERT INTO albums(name, year) VALUES($1, $2) RETURNING id',
            values: [name, year]
        })

        if (!results.rows.length) throw new InvariantError('Album gagal ditambahkan')
        return results.rows[0].id
    }

    async getAlbumById(id) {
        /*get album id, name, year, and song list with id, title and performer*/
        const results = await this._pool.query({
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
            values: [id]
        })


        if (!results.rows.length) throw new InvariantError('Album tidak ditemukan')
        return results.rows[0]
    }

    async editAlbumById(id, {name, year}) {
        const results = await this._pool.query({
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = current_timestamp WHERE id = $3 RETURNING id',
            values: [name, year, id]
        })

        if (!results.rows.length) throw new InvariantError('Gagal memperbarui album. Id tidak ditemukan')
    }

    async deleteAlbumById(id) {
        const results = await this._pool.query({
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id]
        })

        if (!results.rows.length) throw new InvariantError('Gagal menghapus album. Id tidak ditemukan')
    }
}
