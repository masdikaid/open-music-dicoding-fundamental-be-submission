const BaseHandler = require('../../base/BaseHandler');
const autoBind = require('auto-bind');

module.exports = class extends BaseHandler {
  constructor(
    service,
    songsPlaylistService,
    songsService,
    collaboratorService,
    activitiesService,
    validator) {
    super(service, validator);
    this._songsPlaylistService = songsPlaylistService;
    this._songsService = songsService;
    this._collaboratorService = collaboratorService;
    this._activitiesService = activitiesService;
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

    const {cache, data: playlists} = await this._service.getPlaylists(
      credentialId);

    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });

    if (cache) response.header('X-Data-Source', 'cache');

    return response;
  }

  async getPlaylistByIdHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {playlistId} = request.params;

    if (!await this._service.verifyPlaylistAccess(playlistId, credentialId,
      false)) {
      await this._collaboratorService.verifyCollaborator(
        playlistId,
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
      await this._collaboratorService.verifyCollaborator(
        playlistId,
        credentialId);
    }

    await this._songsPlaylistService.addSongPlaylist(playlistId, songId);

    await this._activitiesService.addActivity(
      playlistId,
      songId,
      credentialId,
      'add');

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
      await this._collaboratorService.verifyCollaborator(
        playlistId,
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
      await this._collaboratorService.verifyCollaborator(
        playlistId,
        credentialId);
    }

    await this._songsPlaylistService.deleteSongPlaylist(playlistId, songId);

    await this._activitiesService.addActivity(
      playlistId,
      songId,
      credentialId,
      'delete');

    return h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
  }

  async getActivitiesByPlaylistIdHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {playlistId} = request.params;

    if (!await this._service.verifyPlaylistAccess(playlistId, credentialId,
      false)) {
      await this._collaboratorService.verifyCollaborator(
        playlistId,
        credentialId);
    }

    const activities = await this._activitiesService.getActivitiesByPlaylistId(
      playlistId);

    return h.response({
      status: 'success',
      message: 'Berhasil mendapatkan aktivitas',
      data: {
        playlistId,
        activities,
      },
    });
  }
};
