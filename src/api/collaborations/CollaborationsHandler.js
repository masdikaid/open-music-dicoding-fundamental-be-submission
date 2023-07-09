const BaseHandler = require('../../base/BaseHandler');
const autoBind = require('auto-bind');

module.exports = class extends BaseHandler {
  constructor(service, playlistService, userService, validator) {
    super(service, validator);
    this._playlistService = playlistService;
    this._userService = userService;
    autoBind(this);
  }

  async addCollaborationHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {playlistId, userId} = request.payload;

    await this._userService.getUserById(userId);
    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    const collaborationId = await this._service.addCollaboration(
        {playlistId, userId});

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    }).code(201);
  }

  async deleteCollaborationHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {playlistId, userId} = request.payload;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deleteCollaboration({playlistId, userId});

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    });
  }
};
