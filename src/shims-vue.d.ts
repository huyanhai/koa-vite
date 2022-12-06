declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "spark-md5";
declare module "videojs-contrib-hls";
declare module "video.js";
