const ApiError = require("../error");

const responseFormatter = async (ctx) => {
  if (ctx.body) {
    ctx.body = {
      code: 0,
      message: "请求成功",
      data: ctx.body,
    };
  }
};

const responseFilter = () => {
  return async (ctx, next) => {
    try {
      await next();
      responseFormatter(ctx, next);
    } catch (error) {
      if (error instanceof ApiError) {
        ctx.status = 200;
        ctx.body = {
          code: error.code,
          message: error.message,
        };
      } else {
        throw error;
      }
    }
  };
};

module.exports = responseFilter;
