const {PgLiteral} = require('node-pg-migrate');

exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
            default: new PgLiteral('uuid_generate_v4()')
        },
        title: {
            type: 'varchar(50)',
            notNull: true
        },
        year: {
            type: 'int',
            notNull: true
        },
        performer: {
            type: 'varchar(50)',
            notNull: true
        },
        genre: {
            type: 'varchar(50)',
            notNull: true
        },
        duration: {
            type: 'int',
            notNull: false,
            default: null
        },
        album_id: {
            type: 'VARCHAR(50)',
            notNull: false,
            references: '"albums"',
            onDelete: 'cascade',
            default: null
        },
        created_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: new PgLiteral('NOW()')
        },
        updated_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: new PgLiteral('current_timestamp')
        }
    })
    pgm.createIndex('songs', 'album_id')
};

exports.down = pgm => {
    pgm.dropIndex('songs', 'album_id')
    pgm.dropTable('songs')
};
