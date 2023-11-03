const BaseHandler = require('../../base/BaseHandler');
const autoBind = require('auto-bind');

module.exports = class extends BaseHandler {
  constructor(service, playlistService, validator) {
    super(service, validator);
    this._playlistService = playlistService;
    autoBind(this);
  }

  async postExportSongsHandler(request, h) {
    this._validator(request.payload);
    const {targetEmail} = request.payload;
    const {playlistId} = request.params;
    const {id: credentialId} = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);

    await this._service.sendMessage('export:playlists',
        JSON.stringify({targetEmail, playlistId}));

    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    }).code(201);
  }
};
