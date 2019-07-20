<style lang="scss" scoped>
  @import "./themes/reset.scss";
</style>

<template>
  <button
    @click="onClick"
    :disabled="loadingState.value || disabled"
    :class="{ [theme]: true, [size]: true, [type]: true }"
    :style="{...inlineStyles}"
  >
    <span v-show="loadingState.value">
      <!-- @slot 加载状态展示内容 -->
      <slot name="loading"></slot>
    </span>

    <span v-show="showText">
      <slot />
    </span>
  </button>
</template>

<script>
  import useBoolean from "@crh/vue/mixins/useBoolean";

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
      },
      /** 按钮失效状态 */
      disabled: {
        type: Boolean,
        default: false
      },
      /** 设置按钮载入状态 */
      loading: {
        type: Boolean,
        default: false
      },
      /** 微调样式 */
      inlineStyles: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        loadingState: useBoolean(false)
      };
    },
    computed: {
      /** 是否能显示按钮内容 */
      showText() {
        return this.hideText === false || this.loadingState.value === false;
      }
    },
    methods: {
      onClick() {
        this.loadingState.set(true);
        /**
         * 转发点击事件
         * @type {Event} 处理点击
         */
        this.$emit("click", () => {
          this.loadingState.set(false);
        });
      },
    },
    created() {
      import(`./themes/${this.theme}.scss`);
      this.loadingState.set(this.loading);
    },
    mounted() {}
  };
</script>