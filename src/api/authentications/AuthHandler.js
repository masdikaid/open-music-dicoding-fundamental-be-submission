const BaseHandler = require('../../base/BaseHandler');
const autoBind = require('auto-bind');

module.exports = class extends BaseHandler {
  constructor(service, userService, tokenManager, validator) {
    super(service, validator);
    this._userService = userService;
    this._tokenManager = tokenManager;
    autoBind(this);
  }

  async loginHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);
    const {username, password} = request.payload;
    const user = await this._userService.verifyUserCredential(username,
        password);
    const accessToken = this._tokenManager.generateAccessToken(user);
    const refreshToken = this._tokenManager.generateRefreshToken(user);
    await this._service.addRefreshToken(refreshToken);
    return h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    }).code(201);
  }

  async refreshTokenHandler(request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload);
    const {refreshToken} = request.payload;
    await this._service.verifyRefreshToken(refreshToken);
    const {id, username, fullname} = this._tokenManager.verifyRefreshToken(
        refreshToken);
    const accessToken = this._tokenManager.generateAccessToken(
        {id, username, fullname});
    return h.response({
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    });
  }

  async logoutHandler(request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);
    const {refreshToken} = request.payload;
    await this._service.verifyRefreshToken(refreshToken);
    await this._service.deleteRefreshToken(refreshToken);
    return h.response({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  }
};
