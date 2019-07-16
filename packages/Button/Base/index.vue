<style lang="scss" scoped>
  @import "./themes/reset.scss";
</style>

<template>
  <button
    @click="onClick"
    :disabled="loading.value"
    :class="{ [theme]: true, [size]: true, [type]: true }"
  >
    <i v-show="loading.value">loading</i>
    <!-- @slot 按钮内容 -->
    <slot /></button>
</template>

<script>
  import useBoolean from "@/Mixins/useBoolean";
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
      }
    },
    data() {
      return {
        loading: {},
      };
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
      this.loading = useBoolean("loading", false);
    },
    mounted() {}
  };
</script>