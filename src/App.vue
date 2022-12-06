<template>
  <video class="video-js" controls preload="auto" width="640" height="268" data-setup="{}" id="example-video"></video>
  <input type="file" name="" id="file" />
  <button @click="submitFile">上传</button>
  <button @click="getList">获取列表</button>
</template>

<script lang="ts" setup>
import axios from "axios";
import videojs from "video.js";
import SparkMD5 from "spark-md5";
import { onMounted } from "vue";

import "video.js/dist/video-js.css";

axios.defaults.baseURL = "http://localhost:3000";

const chunkSize = 1024 * 1024 * 5; // 1M/片

const createFileHash = (file: File): Promise<string> => {
  const fileReader = new FileReader();
  const spark = new SparkMD5.ArrayBuffer();

  return new Promise((resolve) => {
    fileReader.onload = (e: any) => {
      spark.append(e.target.result);
      resolve(spark.end());
    };
    fileReader.readAsArrayBuffer(file.slice(0, file.size));
  });
};

const createFileChunks = (file: File, size: number = chunkSize) => {
  const [name, ext] = file.name.split(".");
  const chunkTotal = Math.ceil(file.size / chunkSize);

  let fileChunks = []; // 分片后的数组
  for (let currentChunk = 0; currentChunk < chunkTotal; currentChunk++) {
    const blob = file.slice(currentChunk * size, (currentChunk + 1) * size < file.size ? (currentChunk + 1) * size : file.size);

    fileChunks.push(blob);
  }
  return fileChunks;
};

const uploadChunks = async (fileChunks: Blob[], flieName: string, fileHash: string, cacheList: string[]) => {
  const uploadList = fileChunks.map(async (chunk, index) => {
    if (cacheList.includes(`${index}`)) return;
    let formData = new FormData();
    formData.append("flieName", flieName);
    formData.append("chunk", chunk);
    formData.append("index", index.toString());
    formData.append("fileHash", fileHash);
    return axios({
      method: "POST",
      url: "/public/upload",
      data: formData,
    });
  });

  return Promise.all(uploadList);
};

const checkFileExist = (fileName: string, fileHash: string) => {
  return axios({
    method: "POST",
    url: "/public/check-file",
    data: {
      fileName,
      fileHash,
    },
  });
};

const submitFile = async () => {
  const file = (document.querySelector("#file") as HTMLInputElement).files?.[0];
  if (!file) return;

  // 创建切片
  const fileChunks = await createFileChunks(file);
  const fileHash = await createFileHash(file);
  const {
    data: { data },
  } = await checkFileExist(file.name, fileHash);

  const cacheList = data.cacheIsExist ? data.list : [];

  if (data.fileIsExist) {
    return console.log("文件已存在");
  }

  // 上传切片
  await uploadChunks(fileChunks, file.name, fileHash, cacheList);

  merge({
    fileHash,
    fileName: file.name,
  });
};

const initFls = (url: string) => {
  var player = videojs("example-video");
  player.src({
    src: url,
    type: "application/x-mpegURL", //在重新添加视频源的时候需要给新的type的值
  });
  player.load();
  player.play();
};

const getList = () => {
  axios({
    method: "GET",
    url: "/public/list",
  });
};

const merge = (data: any) => {
  axios({
    method: "POST",
    url: "/public/merge",
    data,
  }).then(({ data }) => {
    console.log(data);
    if (data.code === 0 && data.data.includes("http")) {
      initFls(data.data);
    }
  });
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
