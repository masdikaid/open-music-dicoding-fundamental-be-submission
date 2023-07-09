/* eslint-disable camelcase */

const {PgLiteral} = require('node-pg-migrate');
exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      default: new PgLiteral('uuid_generate_v4()'),
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: new PgLiteral('NOW()'),
    },
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: new PgLiteral('current_timestamp'),
    },
  });

  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropTable('playlists');
};
