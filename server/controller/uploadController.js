const fs = require("fs");
const path = require("path");

const { writeVideo, createDir, removeDir } = require("../utils/index");
const Upload = require("../model/upload");

const uploadDir = path.resolve(__dirname, "../upload");
const staticDir = path.resolve(__dirname, "../static");
const tempDir = path.resolve(__dirname, "../temp");

let cacheDir;

class UploadController {
  static checkUploadDir() {
    createDir(staticDir);
  }

  static async checkFile(ctx) {
    const { fileName, fileHash } = ctx.request.body;
    const ext = path.extname(`${uploadDir}/${fileName}`).replace(".", "");
    UploadController.checkUploadDir();
    cacheDir = `${uploadDir}/${fileHash}`;
    const fileStats = await new Promise((resolve) => {
      fs.stat(`${staticDir}/${ext}/${fileName}`, (err) => {
        if (err && err.code === "ENOENT") {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
    if (fileStats) {
      return (ctx.body = {
        msg: `${fileName}已存在`,
        fileIsExist: true,
      });
    }
    if (fs.existsSync(cacheDir) && fs.readdirSync(cacheDir).length > 0) {
      return (ctx.body = {
        cacheIsExist: true,
        list: fs.readdirSync(cacheDir),
      });
    }
    ctx.body = "请求成功";
  }

  static async upload(ctx) {
    const { index } = ctx.request.body;
    const filePath = ctx.request.files.chunk.filepath;
    createDir(cacheDir);
    fs.renameSync(filePath, `${cacheDir}/${index}`);
    ctx.body = "success";
  }

  static async merge(ctx) {
    const { fileHash, fileName } = ctx.request.body;
    const ext = path.extname(`${uploadDir}/${fileName}`).replace(".", "");
    try {
      const fileDir = `${uploadDir}/${fileHash}`;
      createDir(`${staticDir}/${ext}/`);
      fs.readdirSync(fileDir).map((dir) => {
        fs.appendFileSync(`${staticDir}/${ext}/${fileName}`, fs.readFileSync(`${fileDir}/${dir}`));
        fs.unlinkSync(`${fileDir}/${dir}`);
      });
      removeDir(fileDir);
      removeDir(tempDir);
      if (ext.includes("mp4")) {
        const flag = await writeVideo(`${staticDir}/${ext}/${fileName}`, fileHash, ext);
        if (flag) {
          new Upload({
            name: fileName,
            hash: fileHash,
            ext: ext,
            creatTime: +new Date(),
          }).save();
          return (ctx.body = `http://127.0.0.1:3000/${ext}/${fileHash}.m3u8`);
        }
      } else {
        new Upload({
          name: fileName,
          ext: ext,
          creatTime: +new Date(),
        }).save();
      }
      ctx.body = "success";
    } catch (error) {
      console.error("error", error);
      ctx.body = error;
    }
  }

  static async getUploadlist(ctx) {
    const upload = await Upload.find({});

    ctx.body = upload.map((item) => {
      return {
        name: item.name,
        ext: item.ext,
        hash: item.hash,
      };
    });
  }
}

module.exports = UploadController;
