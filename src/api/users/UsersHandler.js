const BaseHandler = require('../../base/BaseHandler');

module.exports = class extends BaseHandler {
    constructor(service, validator) {
        super(service, validator);
    }

    getUsersHandler = async (request, h) => {
        const users = await this._service.getUsers();
        return this._responseWithSuccess({
            h,
            message: 'Users berhasil ditemukan',
            data: {users},
        });
    };

    addUserHandler = async (request, h) => {
        this._validator(request.payload);
        const {username, password, fullname} = request.payload;
        const userId = await this._service.addUser(
            {username, password, fullname});
        return this._responseWithSuccess({
            h,
            code: 201,
            message: 'User berhasil ditambahkan',
            data: {userId},
        });
    };

    getUserByIdHandler = async (request, h) => {
        const {id} = request.params;
        const user = await this._service.getUserById(id);
        return this._responseWithSuccess({
            h,
            message: 'User berhasil ditemukan',
            data: {user},
        });
    };
};
