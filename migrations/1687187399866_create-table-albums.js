const {PgLiteral} = require('node-pg-migrate');

exports.up = pgm => {
    pgm.createTable('albums', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
            default: new PgLiteral('uuid_generate_v4()')
        },
        name: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        year: {
            type: 'INT',
            notNull: true
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
};

exports.down = pgm => {
    pgm.dropTable('albums')
};
