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
      code,
    });
  }

  _response({h, status, message, data, code}) {
    return h.response({
      status,
      message,
      data,
    }).code(code);
  }
};
