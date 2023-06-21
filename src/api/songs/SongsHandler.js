const BaseHandler = require('../../base/BaseHandler');

module.exports = class extends BaseHandler {
  constructor(service, validator) {
    super(service, validator);
  }

  getSongsHandler = async (request, h) => {
    const {title, performer} = request.query;
    const songs = await this._service.getSongs({title, performer});
    return this._responseWithSuccess({
      h,
      message: 'Songs berhasil ditemukan',
      data: {songs},
    });
  };

  getSongByIdHandler = async (request, h) => {
    const {id} = request.params;
    const song = await this._service.getSongById(id);
    return this._responseWithSuccess({
      h,
      message: 'Song berhasil ditemukan',
      data: {song},
    });
  };

  postSongHandler = async (request, h) => {
    this._validator(request.payload);
    const {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    } = request.payload;
    const songId = await this._service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });
    return this._responseWithSuccess({
      h,
      message: 'Song berhasil ditambahkan',
      data: {songId},
      code: 201,
    });
  };

  putSongByIdHandler = async (request, h) => {
    this._validator(request.payload);
    const {id} = request.params;
    const {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    } = request.payload;
    await this._service.editSongById(id, {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });
    return this._responseWithSuccess({
      h,
      message: 'Song berhasil diperbarui',
    });
  };

  deleteSongByIdHandler = async (request, h) => {
    const {id} = request.params;
    await this._service.deleteSongById(id);
    return h.response({
      status: 'success',
      message: 'Song berhasil dihapus',
    }).code(200);
  };
};
