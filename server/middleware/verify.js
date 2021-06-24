const jwt = require("jsonwebtoken");
const { JWT_CONFIG } = require("../config");
const ApiError = require("../error/index");

module.exports = async (ctx, next) => {
  const token = ctx.request.header["authorization"];
  if (token === "") {
    throw new ApiError(ApiError.errorType.SignError);
  }

  try {
    ctx.body = await jwt.verify(token.replace("Bearer ", ""), JWT_CONFIG.secret)
      .name;
  } catch (err) {
    ctx.throw(401, "invalid token");
  }
  await next();
};
