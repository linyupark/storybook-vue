<style lang="scss" scoped>
  @import "./themes/reset.scss";
</style>

<template>
  <button
    @click="onClick"
    :disabled="loading.value"
    :class="{ [theme]: true, [size]: true, [type]: true }"
  >
    <span v-show="loading.value">
      <!-- @slot 加载状态展示内容 -->
      <slot name="loading"></slot>
    </span>
    
    <span v-show="showText">
      <!-- @slot 按钮内容 -->
      <slot />
    </span>
  </button>
</template>

<script>
  import useBoolean from "@crh/Vue/Mixins/useBoolean";

  export default {
    name: "ButtonBase",
    props: {
      /** 皮肤名称 */
      theme: {
        type: String,
        default: "zyb"
      },
      /** 按钮尺寸 */
      size: {
        type: "l" | "m" | "s",
        default: "l"
      },
      /** 按钮类型 */
      type: {
        type: "" | "primary" | "warn" | "error",
        default: ""
      },
      /** 加载时候只显示加载状态 */
      hideText: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loading: useBoolean("loading", false)
      };
    },
    computed: {
      /** 是否能显示按钮内容 */
      showText() {
        return this.hideText === false || this.loading.value === false;
      }
    },
    methods: {
      onClick() {
        this.loading.set(true);
        /**
         * 转发点击事件
         * @type {Event} 处理点击
         */
        this.$emit("click", () => {
          this.loading.set(false);
        });
      }
    },
    async created() {
      await import(`./themes/${this.theme}.scss`);
    },
    mounted() {}
  };
</script>