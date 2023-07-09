/* eslint-disable camelcase */
const {PgLiteral} = require('node-pg-migrate');
exports.up = pgm => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      default: new PgLiteral('uuid_generate_v4()'),
    },
    username: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    fullname: {
      type: 'TEXT',
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

  pgm.addConstraint('users', 'unique_username', 'UNIQUE(username)');
  pgm.createIndex('users', 'username');
};

exports.down = pgm => {
  pgm.dropTable('users');
};
