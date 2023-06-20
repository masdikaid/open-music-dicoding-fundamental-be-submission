const ClientError = require("../exceptions/ClientError");

module.exports = class {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
    }

    _responseWithSuccess({h, message, data = null, code = 200}) {
        return this._response({
            h,
            status: 'success',
            message,
            data,
            code
        })
    }

    _responseWithFailed({h, error}) {
        const isClientErr = error instanceof ClientError
        const isDbErr = error.code === '23502' || error.code === '22P02'
        return this._response({
            h,
            status: 'fail',
            message: isClientErr ? error.message : isDbErr ? 'Data tidak sesuai' : 'Maaf, terjadi kegagalan pada server kami',
            code: isClientErr ? error.statusCode : isDbErr ? 400 : 500
        })
    }

    _response({h, status, message, data, code}) {
        return h.response({
            status,
            message,
            data
        }).code(code)
    }
}
