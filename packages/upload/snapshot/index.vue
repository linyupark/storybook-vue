<template>
  <!-- 简单的快照上传 -->
  <div class="upload-snapshot">
    <!-- 移除icon -->
    <svg style="display: none">
      <symbol
        id="icon-qingchu"
        viewBox="0 0 1024 1024"
      >
        <path d="M512 896C299.936 896 128 724.064 128 512S299.936 128 512 128s384 171.936 384 384-171.936 384-384 384z m45.248-384l90.528-90.496a32 32 0 0 0-45.28-45.28L512 466.752l-90.496-90.528a32 32 0 0 0-45.28 45.28L466.752 512l-90.528 90.496a32 32 0 0 0 45.28 45.28L512 557.248l90.496 90.528a32 32 0 0 0 45.28-45.28L557.248 512z"></path>
      </symbol>
      <symbol
        id="icon-zengjiaguanju"
        viewBox="0 0 1024 1024"
      >
        <path d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 0 1 0 64H544v352a32 32 0 0 1-64 0V544H128a32 32 0 0 1 0-64h352z"></path>
      </symbol>
    </svg>
    <!-- 预览 -->
    <div
      v-for="(img, i) in previewImages"
      :key="i"
      class="preview"
      :style="{
        ...previewInlineStyles,
        background: `url(${img}) no-repeat center / cover`
      }"
    >
      <span
        class="remove"
        @click="onRemove(img)"
      >
        <IconSvg icon="icon-qingchu" />
      </span>
    </div>
    <!-- 上传区块 -->
    <div
      v-show="previewImages.length < maxNum"
      class="up-btn"
      :style="{
        ...previewInlineStyles
      }"
      @click="onSelect"
    >
      <div
        v-show="loading"
        class="lds-ring"
      >
        <div />
        <div />
        <div />
        <div />
      </div>
      <div v-show="!loading">
        <span class="add">
          <IconSvg icon="icon-zengjiaguanju" />
        </span>
        <span class="text">
          <slot name="uploadText" />
        </span>
      </div>
    </div>
    <!-- 隐藏的上传input -->
    <input
      ref="uploader"
      @change="onChange"
      :style="{
        display: 'none'
      }"
      type="file"
      :accept="accept"
      :multiple="multiple"
    />
  </div>
</template>

<style lang="scss" scoped>
  @import "./style";
</style>

<script>
  import IconSvg from "@crh/vue/icon/svg";
  import useTypeOf from "@crh/vue/functions/useTypeof";
  export default {
    name: "UploadSnapshot",
    components: {
      IconSvg
    },
    props: {
      /** 已经上传过的图片 base64或地址 */
      images: {
        type: Array,
        default: () => []
      },
      /** 文件选择筛选 */
      accept: {
        type: String,
        default: "image/jpeg, image/jpg, image/png, image/bmp, image/gif"
      },
      /** 可多选 */
      multiple: {
        type: Boolean,
        default: false
      },
      /** 预览样式微调 */
      previewInlineStyles: {
        type: Object,
        default: () => ({})
      },
      /** 最多上传几张 */
      maxNum: {
        type: Number,
        default: 1
      },
      /** 触发选择时候处理函数（默认打开h5文件选择) */
      selectHandler: {
        type: Function
      },
      /** 最大上传文件大小（KB） */
      maxUploadSize: {
        type: Number,
        default: 1024 * 4
      },
      /** 将原图等比修改尺寸到屏幕宽度比率（默认：2倍屏幕宽） */
      resizeToScreenRatio: {
        type: Number,
        default: 2
      }
    },
    data() {
      return {
        /** 进入预览区的图片集合 */
        previewImages: [],
        loading: false
      };
    },
    watch: {
      images: {
        handler(newImages) {
          this.previewImages = [...newImages];
        },
        immediate: true
      }
    },
    methods: {
      /** 移出 */
      onRemove(image) {
        this.previewImages.splice(this.previewImages.indexOf(image), 1);
        // 触发图片改动
        this.$emit('remove', {
          fileList: this.previewImages,
          changed: image
        });
      },
      /** 文件转 base64 */
      async fileToBase64(file) {
        const EXIF = await import("./exif");
        let canvas = document.createElement("canvas");
        let rCanvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let rctx = rCanvas.getContext("2d");
        let reader = new FileReader();
        let image = new Image();

        return new Promise((resolve, reject) => {
          reader.onload = () => {
            let url = reader.result;
            image.src = String(url);
          };

          image.onload = () => {
            let w = image.naturalWidth;
            let h = image.naturalHeight;
            let rW = 0;
            let rH = 0;

            // 过大裁切
            if (w > 750 * this.resizeToScreenRatio) {
              rW = 750 * this.resizeToScreenRatio;
              rH = h * ((750 * this.resizeToScreenRatio) / w);
            } else {
              rW = w;
              rH = h;
            }

            // 正常宽高
            canvas.width = w;
            canvas.height = h;
            rCanvas.width = rW;
            rCanvas.height = rH;

            //旋转图片操作
            EXIF.default.getData(image, function() {
              let orientation = EXIF.default.getTag(this, "Orientation") || 1;
              switch (orientation) {
                //正常状态
                case 1:
                  // console.log("旋转0°");
                  ctx.rotate((0 * Math.PI) / 180);
                  ctx.drawImage(image, 0, 0);
                  rctx.drawImage(
                    canvas,
                    0,
                    0,
                    w,
                    h,
                    0,
                    0,
                    rCanvas.width,
                    rCanvas.height
                  );
                  break;
                //旋转90度
                case 6:
                  // console.log("旋转90°");
                  canvas.width = h;
                  canvas.height = w;
                  ctx.rotate((90 * Math.PI) / 180);
                  ctx.translate(0, -h);
                  ctx.drawImage(image, 0, 0);
                  rCanvas.width = rH;
                  rCanvas.height = rW;
                  rctx.drawImage(
                    canvas,
                    0,
                    0,
                    h,
                    w,
                    0,
                    0,
                    rCanvas.width,
                    rCanvas.height
                  );
                  break;
                //旋转180°
                case 3:
                  // console.log("旋转180°");
                  ctx.rotate((180 * Math.PI) / 180);
                  ctx.translate(-w, -h);
                  ctx.drawImage(image, 0, 0);
                  rctx.drawImage(
                    canvas,
                    0,
                    0,
                    w,
                    h,
                    0,
                    0,
                    rCanvas.width,
                    rCanvas.height
                  );
                  break;
                //旋转270°
                case 8:
                  // console.log("旋转270°");
                  canvas.width = h;
                  canvas.height = w;
                  ctx.rotate((270 * Math.PI) / 180);
                  ctx.translate(-w, 0);
                  ctx.drawImage(image, 0, 0);
                  rCanvas.width = rH;
                  rCanvas.height = rW;
                  rctx.drawImage(
                    canvas,
                    0,
                    0,
                    h,
                    w,
                    0,
                    0,
                    rCanvas.width,
                    rCanvas.height
                  );
                  break;
              }
            });
            const base64 = rCanvas.toDataURL(file.type);
            if (this.countImageBase64Szie(base64) > this.imageSize) {
              const info = `上传的图片尺寸过大(压缩后依然大于${this.imageSize}KB)`;
              reject(info);
            }
            resolve(base64);
          };
          reader.readAsDataURL(file);
        });
      },
      /** 触发 input file 点击 */
      onSelect(ev) {
        if (this.selectHandler) {
          // 使用自定义选择处理（比如原生去选择）
          return this.selectHandler(ev);
        }
        this.$refs.uploader.click();
      },
      /** 当选择文件发生变化 */
      async onChange(ev) {
        // 选中的文件
        let files = ev.target.files;
        // 总文件数
        let fileLen = files.length;
        // 没有文件忽略
        if (fileLen === 0) return;
        // 超过最大数，提示
        if (fileLen + this.previewImages.length > this.maxNum) {
          const errMsg = `不能上传超过${this.maxNum}张`;
          console.error(errMsg);
          this.$refs.uploader.value = "";
          /**
           * 发送错误信息
           * @type {event}
           */
          return this.$emit("error", {
            reason: "MORE_THAN_MAX_NUM",
            message: errMsg
          });
        }
        if (useTypeOf(files) === "filelist") {
          // 转换成 base64
          for (let i = 0; i < fileLen; i++) {
            let file = files[i];
            this.loading = true;
            const base64 = await this.fileToBase64(file).catch(info => {
              console.error(info);
              this.$emit("error", {
                reason: "FILE_TO_BASE64_FAILED",
                message: info
              });
            });
            this.loading = false;
            if (base64) {
              // 插入本地预览
              this.previewImages.push(base64);
              /**
               * 触发图片改动
               * @type {Event}
               */
              this.$emit("upload", {
                fileList: this.previewImages,
                changed: base64
              });
            }
          }
        }
        this.$refs.uploader.value = "";
      },
      /**
       * 获取 base64尺寸
       * @param base64
       */
      countImageBase64Szie(base64) {
        var strLength = base64.length - 23; // 这里的23是针对 data:image/xxxx 这类信息大概的尺寸
        var fileLength = parseInt(String(strLength - (strLength / 8) * 2));
        // 由字节转换为KB
        var size = "";
        size = (fileLength / 1024).toFixed(2);
        return parseInt(size);
      }
    },
    computed: {},
    mounted() {}
  };
</script>
