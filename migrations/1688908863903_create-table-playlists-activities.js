/* eslint-disable camelcase */

const {PgLiteral} = require('node-pg-migrate');
exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('playlists_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      default: new PgLiteral('uuid_generate_v4()'),
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action_type: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: new PgLiteral('NOW()'),
    },
  });

  pgm.addConstraint(
    'playlists_activities',
    'fk_playlists_activities.playlist_id_playlists.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');

  pgm.addConstraint(
    'playlists_activities',
    'fk_playlists_activities.song_id_songs.id',
    'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');

  pgm.addConstraint(
    'playlists_activities',
    'fk_playlists_activities.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');

};

exports.down = pgm => {
  pgm.dropTable('playlists_activities');
};
