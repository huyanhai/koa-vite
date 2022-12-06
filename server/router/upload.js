const Router = require("koa-router");
const uploadController = require("../controller/uploadController");

const router = new Router();

router
  .post("/public/check-file", uploadController.checkFile)
  .post("/public/upload", uploadController.upload)
  .post("/public/merge", uploadController.merge)
  .get("/public/list", uploadController.getUploadlist);

module.exports = router;
