module.exports = (handler) => [
    {
        method: 'GET',
        path: '/users',
        handler: handler.getUsersHandler,
    },
    {
        method: 'POST',
        path: '/users',
        handler: handler.addUserHandler,
    },
    {
        method: 'GET',
        path: '/users/{id}',
        handler: handler.getUserByIdHandler,
    },
];
