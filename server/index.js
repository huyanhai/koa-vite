const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
const koaJwt = require("koa-jwt");
const logger = require("koa-logger");
const responseFilter = require("./middleware/responseFilter");
const { getToken, authError } = require("./middleware/auth");
const index = require("./router/index");
const user = require("./router/user");
const { JWT_CONFIG } = require("./config");

require("./db/index");
const app = new Koa();

app.use(logger());
app.use(cors());
app.use(bodyParser());
app.use(responseFilter());

app.use(getToken);
app.use(authError);

app.use(
  koaJwt({ secret: JWT_CONFIG.secret }).unless({
    path: ["/", "/test", "/api/login"],
  })
);

app.use(index.routes()).use(index.allowedMethods());
app.use(user.routes()).use(user.allowedMethods());

app.listen("3000", (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("listen port 3000");
  }
});
