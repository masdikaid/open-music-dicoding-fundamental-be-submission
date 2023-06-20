const ClientError = require('../../exceptions/ClientError')

module.exports = class {
    constructor(service, validator) {
        this._service = service
        this._validator = validator
    }

    getAlbumByIdHandler = async (request, h) => {
        try {
            const {id} = request.params
            const album = await this._service.getAlbumById(id)
            return h.response({
                status: 'success',
                message: 'detail album berhasil ditemukan',
                data: {
                    album
                }
            }).code(200)
        } catch (e) {
            console.log(e)
            const isClientErr = e instanceof ClientError
            return h.response({
                status: 'failed',
                message: isClientErr ? e.message : 'Maaf, terjadi kegagalan pada server kami'
            }).code(isClientErr ? e.statusCode : 500)
        }
    }

    postAlbumHandler = async (request, h) => {
        try {
            this._validator(request.payload)
            const {name, year} = request.payload
            const albumId = await this._service.addAlbum({name, year})
            return h.response({
                status: 'success',
                message: 'Album berhasil ditambahkan',
                data: {
                    albumId
                }
            }).code(201)
        } catch (e) {
            const isClientErr = e instanceof ClientError
            return h.response({
                status: 'failed',
                message: isClientErr ? e.message : 'Maaf, terjadi kegagalan pada server kami'
            }).code(isClientErr ? e.statusCode : 500)
        }
    }

    putAlbumByIdHandler = async (request, h) => {
        try {
            const {id} = request.params
            const {name, year} = request.payload
            await this._service.editAlbumById(id, {name, year})
            return h.response({
                status: 'success',
                message: 'Album berhasil diperbarui'
            }).code(200)
        } catch (e) {
            const isClientErr = e instanceof ClientError
            return h.response({
                status: 'failed',
                message: isClientErr ? e.message : 'Maaf, terjadi kegagalan pada server kami'
            }).code(isClientErr ? e.statusCode : 500)
        }
    }

    deleteAlbumByIdHandler = async (request, h) => {
        try {
            const {id} = request.params
            await this._service.deleteAlbumById(id)
            return h.response({
                status: 'success',
                message: 'Album berhasil dihapus'
            }).code(200)
        } catch (e) {
            const isClientErr = e instanceof ClientError
            return h.response({
                status: 'failed',
                message: isClientErr ? e.message : 'Maaf, terjadi kegagalan pada server kami'
            }).code(isClientErr ? e.statusCode : 500)
        }
    }
}
