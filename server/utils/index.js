const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const { readdirSync, unlinkSync, rmdirSync, mkdirSync, existsSync } = require("fs");

const writeVideo = (filePath, fileHash, ext) => {
  readdirSync(path.resolve(__dirname, `../static/${ext}`)).map((dir) => {
    if (dir.includes(fileHash)) {
      unlinkSync(path.resolve(__dirname, `../static/${ext}/${dir}`));
    }
  });
  return new Promise((resolve) => {
    ffmpeg(filePath)
      .videoCodec("libx264")
      .format("hls")
      .outputOptions("-hls_list_size 0")
      .outputOption("-hls_time 1")
      .output(path.resolve(__dirname, `../static/${ext}/${fileHash}.m3u8`))
      .on("progress", (progress) => {
        console.log("progress:", progress);
      })
      .on("end", () => {
        resolve(true);
      })
      .run();
  });
};

const createDir = (dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
};

const removeDir = (dir) => {
  if (existsSync(dir)) {
    if (readdirSync(dir).length > 0) {
      readdirSync(dir).map((item) => unlinkSync(`${dir}/${item}`));
    }
    rmdirSync(dir);
  }
};

module.exports = {
  writeVideo,
  createDir,
  removeDir,
};
