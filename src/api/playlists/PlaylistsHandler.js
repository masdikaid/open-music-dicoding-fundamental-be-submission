const BaseHandler = require('../../base/BaseHandler');
const autoBind = require('auto-bind');

module.exports = class extends BaseHandler {
  constructor(
      service, songsPlaylistService, songsService, collaboratorService,
      validator) {
    super(service, validator);
    this._songsPlaylistService = songsPlaylistService;
    this._songsService = songsService;
    this._collaboratorService = collaboratorService;
    autoBind(this);
  }

  async addPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const {id: credentialId} = request.auth.credentials;
    const {name} = request.payload;

    const playlistId = await this._service.addPlaylist(name, credentialId);
    return h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    }).code(201);
  }

  async getPlaylistsHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    return h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
  }

  async getPlaylistByIdHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {playlistId} = request.params;

    if (!await this._service.verifyPlaylistAccess(playlistId, credentialId,
        false)) {
      await this._collaboratorService.verifyCollaborator(playlistId,
          credentialId);
    }

    const playlist = await this._service.getPlaylistById(playlistId);
    return h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
  }

  async deletePlaylistHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {playlistId} = request.params;
    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deletePlaylist(playlistId);
    return h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });
  }

  async addSongToPlaylistHandler(request, h) {
    this._validator.validatePostSongPlaylistPayload(request.payload);
    const {id: credentialId} = request.auth.credentials;
    const {playlistId} = request.params;
    const {songId} = request.payload;

    await this._songsService.getSongById(songId);

    if (!await this._service.verifyPlaylistAccess(playlistId, credentialId,
        false)) {
      await this._collaboratorService.verifyCollaborator(playlistId,
          credentialId);
    }

    await this._songsPlaylistService.addSongPlaylist(playlistId, songId);
    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    }).code(201);
  }

  async getSongsFromPlaylistHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {playlistId} = request.params;

    if (!await this._service.verifyPlaylistAccess(playlistId, credentialId,
        false)) {
      await this._collaboratorService.verifyCollaborator(playlistId,
          credentialId);
    }

    const playlist = await this._service.getPlaylistById(playlistId);
    const songs = await this._songsPlaylistService.getSongsPlaylist(playlistId);
    return h.response({
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    });
  }

  async deleteSongFromPlaylistHandler(request, h) {
    this._validator.validateDeleteSongPlaylistPayload(request.payload);
    const {id: credentialId} = request.auth.credentials;
    const {playlistId} = request.params;
    const {songId} = request.payload;

    if (!await this._service.verifyPlaylistAccess(playlistId, credentialId,
        false)) {
      await this._collaboratorService.verifyCollaborator(playlistId,
          credentialId);
    }

    await this._songsPlaylistService.deleteSongPlaylist(playlistId, songId);
    return h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
  }
};
