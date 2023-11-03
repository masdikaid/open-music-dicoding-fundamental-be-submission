const path = require('path');

module.exports = [
  {
    method: 'GET',
    path: '/uploads/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../../../uploads'),
      },
    },
  },
];
