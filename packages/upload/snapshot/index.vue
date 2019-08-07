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
    </svg>
    <!-- 预览 -->
    <div
      v-for="(img, i) in previewImages"
      :key="i"
      class="preview"
      :style="{
        ...previewInlineStyles,
        background: `url(${img.url ||
          img.base64}) no-repeat center / cover`
      }"
    >
      <IconSvg icon="icon-qingchu" />
    </div>
  </div>
</template>

<script>
  import IconSvg from "@crh/vue/icon/svg";
  export default {
    name: "UploadSnapshot",
    components: {
      IconSvg
    },
    props: {
      /** 预览样式微调 */
      previewInlineStyles: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        /** 进入预览区的图片集合 */
        previewImages: []
      };
    },
    methods: {},
    computed: {},
    mounted() {}
    // name: '', watch: {}, mixins: [], filters: {}, directives: {},
    // beforeCreate() {}, created() {}, beforeMount() {}, beforeUpdate() {}, updated() {}, activated() {}, deactivated() {}, beforeDestroy() {}, destroyed() {},
  };
</script>
