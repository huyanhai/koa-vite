const ApiError = require("../error/index");

const getToken = async (ctx, next) => {
  let params = Object.assign({}, ctx.request.query, ctx.request.body);
  let token =
    ctx.request.header && ctx.request.header.authorization
      ? ctx.request.header.authorization
      : params.token
      ? params.token
      : null;
  if (!token) {
    token = ctx.cookies.get("token") || null;
  }
  // 设置头部
  if (token) ctx.request.header = { authorization: "Bearer " + token };
  await next(ctx);
};

const authError = async (ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      throw new ApiError(ApiError.errorType.SignError);
    } else {
      throw err;
    }
  });
};

module.exports = { getToken, authError };
