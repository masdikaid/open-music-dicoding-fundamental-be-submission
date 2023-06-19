module.exports = class {
    constructor(service) {
        this._service = service
    }

    getAlbumByIdHandler = async (request, h) => {
        const {id} = request.params
        const album = await this._service.getAlbumById(id)
        return h.response({
            status: 'success',
            message: 'detail album berhasil ditemukan',
            data: {
                album
            }
        }).code(200)
    }

    postAlbumHandler = async (request, h) => {
        const {name, year} = request.payload
        const albumId = await this._service.addAlbum({name, year})
        return h.response({
            status: 'success',
            message: 'Album berhasil ditambahkan',
            data: {
                albumId
            }
        }).code(201)
    }

    putAlbumByIdHandler = async (request, h) => {
        const {id} = request.params
        const {name, year} = request.payload
        await this._service.editAlbumById(id, {name, year})
        return h.response({
            status: 'success',
            message: 'Album berhasil diperbarui'
        }).code(200)
    }

    deleteAlbumByIdHandler = async (request, h) => {
        const {id} = request.params
        await this._service.deleteAlbumById(id)
        return h.response({
            status: 'success',
            message: 'Album berhasil dihapus'
        }).code(200)
    }
}
