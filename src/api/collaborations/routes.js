module.exports = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.addCollaborationHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];
