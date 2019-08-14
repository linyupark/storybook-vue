<template>
  <!-- 轻提示 -->
  <div
    class="toast-wrapper"
    :class="{
      visible: stateVisible
    }"
    ref="wrapper"
  >
    <div
      class="toast"
      :style="{
      ...inlineStyles
    }"
    >
      <!-- @slot 提示信息内容 -->
      <slot />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .toast-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    opacity: 0;
    transition: all 0.3s;
    &.visible {
      z-index: 1;
      opacity: 1;
      .toast {
        opacity: 1;
      }
    }
    .toast {
      opacity: 0;
      text-align: center;
      min-width: px2vw(200);
      max-width: px2vw(600);
      background: rgba(#000, 0.75);
      box-shadow: 0px 0px px2vw(8) 0px rgba(0, 0, 0, 0.1);
      color: rgba(#fff, 0.75);
      font-size: px2vw(30);
      border-radius: px2vw(8);
      user-select: none;
      padding: px2vw(20) px2vw(30);
      line-height: px2vw(48);
      word-break: break-all;
      transition: all 0.3s;
      a {
        color: #fff;
        cursor: pointer;
      }
    }
  }
</style>
<script>
  import Vue from "vue";
  import useTypeof from '@crh/vue/functions/useTypeof';
  const RespToast = {
    name: "RespToast",
    components: {},
    props: {
      /** toast 信息自定义样式 */
      inlineStyles: {
        type: Object,
        default: () => ({})
      },
      /** 默认是否展示 */
      visible: {
        type: Boolean,
        default: false
      },
      /** 关闭时触发回调 */
      onClose: {
        type: Function,
        default: () => {}
      },
      /** 多少时间后自动关闭 */
      duration: {
        type: Number,
        default: 1500
      },
      /** 设置 toast 的 zIndex */
      zIndexOverride: {
        type: Number,
        default: () => 1
      }
    },
    data() {
      return {
        /** 是否展示的内部状态 */
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
            this.originStyles = document.body.getAttribute("style") || "";
            this.scrollTop = this.getScrollTop();
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
            document.body.style.top = -this.scrollTop + "px";
            document.body.style.bottom = "0px";
            this.$refs.wrapper.style.zIndex = this.zIndexOverride;
          } else {
            document.body.setAttribute("style", this.originStyles);
            document.body.scrollTop = document.documentElement.scrollTop =
              this.scrollTop || 0;
            this.$refs.wrapper.style.zIndex = -1;
          }
        },
        immediate: false
      }
    },
    methods: {
      /** 
       * 执行显示操作 
       */
      show() {
        this.stateVisible = true;
        if (this.duration === 0) {
          return this.close;
        }
        setTimeout(this.close, this.duration);
      },
      /** 
       * 执行关闭操作 
       */
      close() {
        this.stateVisible = false;

        // 确保消失动画结束后再执行
        setTimeout(() => {
          this.onClose();
          /**
           * 发送close事件
           * @type {Event}
           */
          this.$emit("close");
        }, 300);
      },
      getScrollTop() {
        return document.body.scrollTop || document.documentElement.scrollTop;
      }
    },
    computed: {},
    mounted() {
      console.log("toast mounted");
    }
  };

  /**
   * 函数方式打开提示信息
   */
  RespToast.show = (message, props = {}) => {
    // 还有展示中的toast则先执行close，确保只有一个有效的toast
    if (RespToast._existComp) {
      RespToast._existComp.close();
    }

    const ToastCompConstructor = Vue.extend(RespToast);
    const ToastComp = new ToastCompConstructor({
      // el: document.createElement('div'),
      propsData: {
        ...props
      }
    });

    // 当消息消失时候要销毁自动创建的dom节点避免页面冗余
    ToastComp.$once("close", function() {
      RespToast._existComp = null;
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    });

    // 将消息塞入默认 slot
    let messageNode = '';

    // 如果传入的 message为单纯文字
    if (useTypeof(message) === 'string') {
      messageNode = ToastComp.$createElement("div", {
        domProps: {
          innerHTML: message
        }
      });
    }

    // 传入的 message 为 数组（多个vue组件或元素）
    if (useTypeof(message) === 'array') {
      messageNode = ToastComp.$createElement("div", {}, message);
    }

    ToastComp.$slots.default = [messageNode];

    // 模拟执行挂载
    ToastComp.$mount();

    // 插入dom
    document.body.appendChild(ToastComp.$el);

    // 默认直接展示信息（加延迟确保动画效果能生效）
    setTimeout(() => {
      ToastComp.show();
    }, 100);

    // 保持展示中组件暂存
    RespToast._existComp = ToastComp;

    return ToastComp;
  };
  export default RespToast;
</script>