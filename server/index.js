const { resolve } = require("path");
const fs = require("fs");
const Koa = require("koa");
const koaBody = require("koa-body");
const cors = require("koa2-cors");
const koaJwt = require("koa-jwt");
const logger = require("koa-logger");
const static = require("koa-static");
const views = require("koa-views");

const responseFilter = require("./middleware/responseFilter");
const { getToken, authError } = require("./middleware/auth");
const index = require("./router/index");
const user = require("./router/user");
const upload = require("./router/upload");

const { JWT_CONFIG } = require("./config");

require("./db/index");
const app = new Koa();

app.use(logger());
// app.use(cors());

app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: resolve(__dirname, "temp"), // 文件存放地址
      keepExtensions: true,
      maxFieldsSize: 2 * 1024 * 1024,
      onFileBegin: (name, file) => {
        const filePath = resolve(__dirname, "temp");
        if (!fs.existsSync(filePath)) {
          return fs.mkdirSync(filePath);
        }
      },
    },
  })
);

app.use(static(resolve(__dirname, "static")));
app.use(
  views(resolve(__dirname, "static"), {
    extension: "html",
  })
);
app.use(responseFilter());

app.use(getToken);
app.use(authError);

app.use(
  koaJwt({ secret: JWT_CONFIG.secret }).unless({
    path: [/^\/public/, /^\/test/],
  })
);
// app.use(async (ctx, next) => {
//   ctx.set("Access-Control-Allow-Origin", "*");
//   ctx.set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild");
//   ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
//   if (ctx.method == "OPTIONS") {
//     ctx.body = 200;
//   } else {
//     await next();
//   }
// });
app.use(index.routes()).use(index.allowedMethods());
app.use(user.routes()).use(user.allowedMethods());
app.use(upload.routes()).use(upload.allowedMethods());

app.listen("3001", (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("listen port 3001");
  }
});
