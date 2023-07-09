const BaseService = require('../../base/BaseService');

module.exports = class extends BaseService {
  constructor() {
    super();
  }

  async addActivity(playlistId, songId, userId, actionType) {
    const results = await this._pool.query({
      text: `INSERT INTO 
            playlists_activities(playlist_id, song_id, user_id, action_type)
            VALUES($1, $2, $3, $4)
            RETURNING id`,
      values: [playlistId, songId, userId, actionType],
    });

    return results.rows[0].id;
  }

  getActivitiesByPlaylistId(playlistId) {
    return this._query({
      text: `SELECT users.username, 
              songs.title, 
              playlists_activities.action_type as action,
              songs.created_at as time
            FROM playlists_activities
            LEFT JOIN users ON users.id = playlists_activities.user_id
            LEFT JOIN songs ON songs.id = playlists_activities.song_id
            WHERE playlists_activities.playlist_id = $1`,
      values: [playlistId],
      errWhenNoRows: false,
    });
  }
};
