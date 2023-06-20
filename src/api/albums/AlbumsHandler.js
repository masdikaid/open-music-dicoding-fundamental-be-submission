const BaseHandler = require('../../base/BaseHandler')

module.exports = class extends BaseHandler {
    constructor(service, validator) {
        super(service, validator)
    }

    getAlbumByIdHandler = async (request, h) => {
        try {
            const {id} = request.params
            const album = await this._service.getAlbumById(id)
            return this._responseWithSuccess({
                h,
                message: 'Album berhasil ditemukan',
                data: {album}
            })
        } catch (error) {
            return this._responseWithFailed({h, error})
        }
    }

    postAlbumHandler = async (request, h) => {
        try {
            this._validator(request.payload)
            const {name, year} = request.payload
            const albumId = await this._service.addAlbum({name, year})
            return this._responseWithSuccess({
                h,
                message: 'Album berhasil ditambahkan',
                data: {albumId},
                code: 201
            })
        } catch (error) {
            return this._responseWithFailed({h, error})
        }
    }

    putAlbumByIdHandler = async (request, h) => {
        try {
            this._validator(request.payload)
            const {id} = request.params
            const {name, year} = request.payload
            await this._service.editAlbumById(id, {name, year})
            return this._responseWithSuccess({
                h,
                message: 'Album berhasil diperbarui'
            })
        } catch (error) {
            return this._responseWithFailed({h, error})
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
        } catch (error) {
            return this._responseWithFailed({h, error})
        }
    }
}
