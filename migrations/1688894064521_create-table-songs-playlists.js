/* eslint-disable camelcase */

const {PgLiteral} = require('node-pg-migrate');
exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('songs_playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      default: new PgLiteral('uuid_generate_v4()'),
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('songs_playlists', 'fk_songs_playlists.song_id_songs.id',
    'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
  pgm.addConstraint('songs_playlists',
    'fk_songs_playlists.playlist_id_playlists.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropTable('songs_playlists');
};
