<template>
  <!-- 基础上滑抽屉 -->
  <div
    class="actionsheet"
    :class="{
        visible: stateVisible
      }"
  >
    <div class="container" ref="container" :style="{
      ...containerInlineStyles
    }">
      <slot />
    </div>
    <div class="mask" ref="mask" @click="onMaskClick" :style="{
      ...maskInlineStyles
    }"></div>
  </div>
</template>

<style lang="scss" scoped>
@import './index';
</style>

<script>
  export default {
    name: "ActionsheetBase",
    components: {},
    props: {
      /** 是否可见 */
      visible: {
        type: Boolean,
        default: false
      },
      /** 设置 [container, mask] 的 zIndex */
      zIndexOverride: {
        type: Array,
        default: () => [2, 1]
      },
      /** 容器自定义样式 */
      containerInlineStyles: {
        type: Object,
        default: () => ({
          textAlign: "center"
        })
      },
      /** 遮罩层容器自定义样式 */
      maskInlineStyles: {
        type: Object,
        default: () => ({})
      },
    },
    data() {
      return {
        stateVisible: this.$props.visible
      };
    },
    watch: {
      visible: {
        handler(newState) {
          this.stateVisible = newState;
        },
        immediate: true
      },
      stateVisible: {
        handler(newState) {
          if (newState) {
            if (this.originStyles === undefined) {
              this.originStyles = document.body.getAttribute("style") || "";
            }
            this.scrollTop = this.getScrollTop();
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
            document.body.style.top = -this.scrollTop + "px";
            this.$refs.container.style.zIndex = this.zIndexOverride[0];
            this.$refs.mask.style.zIndex = this.zIndexOverride[1];
            this.$refs.mask.style.display = 'block';
          } else {
            document.body.setAttribute("style", this.originStyles);
            document.body.scrollTop = document.documentElement.scrollTop =
              this.scrollTop || 0;
            this.$refs.container.style.zIndex = -1;
            this.$refs.mask.style.zIndex = -1;
            this.$refs.mask.style.display = 'none';
          }
        },
        immediate: false
      }
    },
    methods: {
      onMaskClick() {
        this.close();
      },
      close() {
        this.stateVisible = false;
        // 确保消失动画结束后再执行
        setTimeout(() => {
          /**
           * 发送close事件
           * @type {Event}
           */
          this.$emit("close");
        }, 300);
      },
      show() {
        this.stateVisible = true;
      },
      getScrollTop() {
        return document.body.scrollTop || document.documentElement.scrollTop;
      }
    },
    computed: {},
    mounted() {}
  };
</script>