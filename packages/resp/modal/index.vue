<template>
  <!-- 弹出层 -->
  <div class="modal">
    <div
      class="modal-wrapper"
      :class="{ visible: stateVisible }"
      ref="wrapper"
    >
      <div
        class="box"
        :style="{ ...containerInlineStyles }"
      >
        <div
          class="title"
          v-html="title"
        ></div>
        <div
          class="content"
          :style="{ ...contentInlineStyles }"
        >
          <!-- @slot 弹窗主体信息 -->
          <slot />
        </div>
        <div
          v-show="!$slots.buttons"
          class="buttons"
        >
          <button
            v-show="type === 'confirm'"
            class="no"
            @click="stateOnNo"
          >
            {{noText}}
          </button>
          <button
            class="ok"
            @click="stateOnOk"
          >
            {{this.okText}}
          </button>
        </div>
        <div
          v-show="$slots.buttons"
          class="buttons"
        >
          <!-- @slot 自定义按钮处理 -->
          <slot name="buttons" />
        </div>
      </div>

    </div>
    <div
      class="mask"
      ref="mask"
      :class="{ visible: stateVisible }"
    ></div>
  </div>
</template>
<style lang="scss" scoped>
  .modal-wrapper {
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
      z-index: 2;
      opacity: 1;
      .box {
        opacity: 1;
      }
    }
    .box {
      width: px2vw(600);
      background: #fff;
      border-radius: px2vw(20);
      overflow: hidden;
      opacity: 0;
      transition: all 0.3s;

      .title {
        text-align: center;
        font-size: px2vw(32);
        color: #272727;
        font-weight: 600;
        padding: px2vw(40);
      }

      .content {
        padding: 0 px2vw(40) px2vw(40) px2vw(40);
        color: #595959;
        font-size: px2vw(28);
        line-height: px2vw(40);
      }
      .buttons {
        display: flex;
        width: 100%;
        height: px2vw(90);
        border-top: 1px solid #f5f5f5;

        .ok,
        .no {
          width: 100%;
          text-align: center;
          color: #3e86f7;
          font-size: px2vw(36);
          border: none;
          background: #fff;
          outline: none;
        }

        button:not(:first-child) {
          border-left: 1px solid #f5f5f5;
        }
      }
    }
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: -1;
    opacity: 0;
    background: rgba(#000, 0.1);
    transition: all 0.3s;
    &.visible {
      z-index: 1;
      opacity: 1;
    }
  }
</style>
<script>
  import Vue from "vue";
  import useTypeof from "@crh/vue/functions/useTypeof";
  const RespModal = {
    name: "RespModal",
    components: {},
    props: {
      /** 弹窗类型 alert | confirm */
      type: {
        type: String,
        default: "alert"
      },
      /** 弹窗标题 */
      title: {
        type: String,
        default: "提示"
      },
      /** 取消文案 */
      noText: {
        type: String,
        default: "取消"
      },
      /** 触发取消按钮对应处理 */
      onNo: {
        type: Function,
        default: () => {}
      },
      /** 确定文案 */
      okText: {
        type: String,
        default: "确定"
      },
      /** 触发确定按钮对应处理 */
      onOk: {
        type: Function,
        default: () => {}
      },
      /** modal 信息自定义样式 */
      contentInlineStyles: {
        type: Object,
        default: () => ({
          textAlign: "center"
        })
      },
      /** modal容器自定义样式 */
      containerInlineStyles: {
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
      /** 设置 [modal, mask] 的 zIndex */
      zIndexOverride: {
        type: Array,
        default: () => [2, 1]
      }
    },
    data() {
      return {
        /** 是否展示的内部状态 */
        stateVisible: this.$props.visible,
        stateOnNo: this.$props.onNo,
        stateOnOk: this.$props.onOk
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
            this.$refs.wrapper.style.zIndex = this.zIndexOverride[0];
            this.$refs.mask.style.zIndex = this.zIndexOverride[1];
          } else {
            document.body.setAttribute("style", this.originStyles);
            document.body.scrollTop = document.documentElement.scrollTop =
              this.scrollTop || 0;
            this.$refs.wrapper.style.zIndex = -1;
            this.$refs.mask.style.zIndex = -1;
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

        // onOk onNo 函数则自动加入关闭操作
        this.stateOnOk = async () => {
          await this.onOk();
          this.close();
        };
        this.stateOnNo = async () => {
          await this.onNo();
          this.close();
        };
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
      // console.log("modal mounted");
    }
  };

  /**
   * 函数方式打开提示信息
   */
  RespModal.show = (props = {}) => {
    // 还有展示中的 modal 则先执行close，确保只有一个有效的modal
    if (RespModal._existComp) {
      RespModal._existComp.close();
    }

    const ModalCompConstructor = Vue.extend(RespModal);

    const ModalComp = new ModalCompConstructor({
      // el: document.createElement('div'),
      propsData: {
        ...props
      }
    });

    // 将消息塞入默认 slot
    let contentNode = "";

    // 如果传入的 content 为单纯文字
    if (useTypeof(props.content) === "string") {
      contentNode = ModalComp.$createElement("div", {
        domProps: {
          innerHTML: props.content
        }
      });
    }

    // 传入的 content 为 数组（多个vue组件或元素）
    if (useTypeof(props.content) === "array") {
      contentNode = ModalComp.$createElement("div", {}, props.content);
    }

    ModalComp.$slots.default = [contentNode];

    // 当消息消失时候要销毁自动创建的dom节点避免页面冗余
    ModalComp.$once("close", function() {
      RespModal._existComp = null;
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    });

    // 模拟执行挂载
    ModalComp.$mount();

    // 插入dom
    document.body.appendChild(ModalComp.$el);

    // 默认直接展示信息（加延迟确保动画效果能生效）
    setTimeout(() => {
      ModalComp.show();
    }, 100);

    // 保持展示中组件暂存
    RespModal._existComp = ModalComp;

    return ModalComp;
  };
  export default RespModal;
</script>