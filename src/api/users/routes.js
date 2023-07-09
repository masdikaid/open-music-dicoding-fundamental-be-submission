module.exports = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.addUserHandler,
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsersHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];
