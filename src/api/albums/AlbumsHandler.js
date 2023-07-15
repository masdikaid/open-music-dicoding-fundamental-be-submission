const BaseHandler = require('../../base/BaseHandler');
const autoBind = require('auto-bind');
const {number} = require('joi');
module.exports = class extends BaseHandler {
  constructor(service, songService, storageService, validator) {
    super(service, validator);
    this._songService = songService;
    this._storageService = storageService;
    autoBind(this);
  }

  getAlbumByIdHandler = async (request, h) => {
    const {id} = request.params;
    const album = await this._service.getAlbumById(id);
    const songs = await this._songService.getSongsByAlbumId(id);
    return this._responseWithSuccess({
      h,
      message: 'Album berhasil ditemukan',
      data: {
        album: {
          ...album,
          songs,
        },
      },
    });
  };

  postAlbumHandler = async (request, h) => {
    this._validator.validateAlbumsPayload(request.payload);
    const {name, year} = request.payload;
    const albumId = await this._service.addAlbum({name, year});
    return this._responseWithSuccess({
      h,
      message: 'Album berhasil ditambahkan',
      data: {albumId},
      code: 201,
    });
  };

  putAlbumByIdHandler = async (request, h) => {
    this._validator.validateAlbumsPayload(request.payload);
    const {id} = request.params;
    const {name, year} = request.payload;
    await this._service.editAlbumById(id, {name, year});
    return this._responseWithSuccess({
      h,
      message: 'Album berhasil diperbarui',
    });
  };

  deleteAlbumByIdHandler = async (request, h) => {
    const {id} = request.params;
    await this._service.deleteAlbumById(id);
    return h.response({
      status: 'success',
      message: 'Album berhasil dihapus',
    }).code(200);
  };

  postAlbumCoverHandler = async (request, h) => {
    const {cover} = request.payload;
    const {id} = request.params;
    this._validator.validateAlbumsCoverPayload(cover.hapi.headers);
    const filename = await this._storageService.writeFile('images/albums',
      cover,
      cover.hapi);

    const urlPath = `uploads/images/albums/${filename}`;
    await this._service.addAlbumCover(id, urlPath);

    return this._responseWithSuccess({
      h,
      message: 'Sampul album berhasil diunggah',
      code: 201,
      data: {
        coverUrl: `http://${process.env.HOST}:${process.env.PORT}/${urlPath}`,
      },
    });
  };

  likeAlbumByIdHandler = async (request, h) => {
    const {id} = request.params;
    const {id: credentialId} = request.auth.credentials;
    await this._service.likeAlbumById(credentialId, id);
    return this._responseWithSuccess({
      h,
      message: 'Album berhasil di like',
    }).code(201);
  };

  unlikeAlbumByIdHandler = async (request, h) => {
    const {id} = request.params;
    const {id: credentialId} = request.auth.credentials;
    await this._service.unlikeAlbumById(credentialId, id);
    return this._responseWithSuccess({
      h,
      message: 'Album berhasil di unlike',
    });
  };

  getAlbumLikesByIdHandler = async (request, h) => {
    const {id} = request.params;
    const likes = await this._service.getAlbumLikesById(id);

    return this._responseWithSuccess({
      h,
      message: 'Likes berhasil ditemukan',
      data: {
        likes: parseInt(likes),
      },
    });
  };
};
