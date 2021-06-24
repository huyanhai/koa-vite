const Router = require("koa-router");
const verify = require("../middleware/verify");
const ApiError = require("../error/index");
const jwt = require("jsonwebtoken");

const { JWT_CONFIG } = require("../config");

const router = new Router();

router
  .get("/", async (ctx) => {
    ctx.body = "hellow koa";
  })
  .get("/api/login", async (ctx, next) => {
    let userToken = {
      name: "nicchan",
    };
    //token签名 有效期为1小时
    const token = jwt.sign(userToken, JWT_CONFIG.secret, { expiresIn: "1h" });
    ctx.body = {
      token,
    };
  })
  .get("/api/test/jwt", verify, async (ctx, next) => {
    next();
  })
  .post("/api/getToken", async (ctx) => {
    let token = ctx.header.authorization;
    ctx.body = token;
  });

module.exports = router;
