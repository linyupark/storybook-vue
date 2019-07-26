<style lang="scss" scoped>
  @import "~@crh/vue/sass/animation.scss";
  .icon-wrapper {
    width: 1em;
    height: 1em;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    overflow: hidden;
    font-style: normal;
    .icon {
      display: block;
      width: 100%;
      height: 100%;
      fill: currentColor;
      &.rotate {
        animation: rotate 1s linear infinite;
      }
    }
  }
</style>


<template>
  <i
    class="icon-wrapper"
    :style="{
      width: `${size}em`,
      height: `${size}em`,
    }"
  >
    <svg
      class="icon"
      aria-hidden="true"
      :class="{ rotate: rotate > 0 }"
      :style="{
        fill: color,
        animationDuration: `${1/rotate}s`,
        ...inlineStyles
      }"
    >
      <use :xlink:href="`#${icon}`"></use>
    </svg>
  </i>
</template>

<script>
  import useScriptLoader from "@crh/vue/functions/useScriptLoader";
  export default {
    name: "IconSvg",
    components: {},
    props: {
      /** 如果直接引入 cdn 图标可以填入 */
      cdn: {
        type: String
      },
      /** 图标名称 */
      icon: {
        type: String,
        required: true
      },
      /** 图标颜色 */
      color: {
        type: String,
        default: "currentColor"
      },
      /** 图标大小 单位: em */
      size: {
        type: Number,
        default: 1
      },
      /** 是否需要旋转, 0: 不旋转, 数字越大速度越快 */
      rotate: {
        type: Number,
        default: 0
      },
      /** 额外样式 */
      inlineStyles: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {};
    },
    methods: {
      /** 加载外部 CDN 资源 */
      loadCDN(url) {
        return useScriptLoader(this.cdn);
      }
    },
    computed: {},
    created() {
      if (this.cdn) {
        this.loadCDN(this.cdn);
      }
    },
    mounted() {}
  };
</script>
