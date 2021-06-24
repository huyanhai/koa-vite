class ApiError extends Error {
  static errorType = {
    UnknownError: { code: -1, message: '未知错误' },
    UserNotExist: { code: 1001, message: '用户不存在' },
    UserNameNotNull: { code: 1002, message: '用户名不能为空' },
    SignError: {code:401,message:'签名错误'}
  };
  constructor(errorType) {
    super();
    const { code, message } = errorType;
    this.code = code;
    this.message = message;
  }
}

module.exports = ApiError;
