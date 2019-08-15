<template>
  <!-- 长文本输入长度限制 -->
  <div
    class="textarea"
    :style="{
      ...wrapperInlineStyles
    }"
  >
    <textarea
      ref="textarea"
      @input="onInput"
      :style="{
        ...textareaInlineStyles
      }"
      :placeholder="placeholder"
      v-model="stateValue"
    ></textarea>
    <span class="counter">
      {{countLength}}/{{max}}
    </span>
  </div>
</template>

<style lang="scss" scoped>
  .textarea {
    width: px2vw(750);
    padding-bottom: px2vw(40);
    position: relative;
    background: #fff;

    textarea {
      border: none;
      resize: none;
      padding: px2vw(24) px2vw(30);
      width: px2vw(750 - 60);
      font-size: px2vw(32);
      outline: none;
      position: absolute;
      top: 0;
      left: 0;
      bottom: px2vw(50);
      line-height: 1.4;

      &::placeholder {
        color: #bfbfbf;
      }
    }

    .counter {
      position: absolute;
      right: px2vw(30);
      bottom: px2vw(24);
      font-size: px2vw(24);
      color: #8c8c8c;
    }
  }
</style>

<script>
  export default {
    name: "InputLimitText",
    components: {},
    props: {
      /** 默认内容 */
      value: {
        type: String,
        default: ""
      },
      /** 内容过滤正则 */
      filterReg: {
        type: String
      },
      /** 最大长度 */
      max: {
        type: Number,
        default: 120
      },
      /** placeholder 提示信息 */
      placeholder: {
        type: String,
        default: "请输入内容"
      },
      /** 容器样式微调 */
      wrapperInlineStyles: {
        type: Object,
        default: () => ({})
      },
      /** 文本框样式微调 */
      textareaInlineStyles: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        stateValue: ""
      };
    },
    watch: {
      value: {
        handler(newValue) {
          this.filter(newValue || "");
        },
        immediate: true
      },
      stateValue: {
        handler(newValue) {
          this.$emit("input", newValue);
        }
      }
    },
    methods: {
      /** 输入操作 */
      onInput(ev) {
        this.stateValue = this.filter(ev.target.value, false);
      },
      /** 对外开放的得到最后过滤后的数据 */
      getContent() {
        return this.filter(this.stateValue);
      },
      /** 对内容过滤 */
      filter(inputText = "", useTrim = true) {
        // 先去掉前后的空格
        let text = useTrim ? inputText.trim() : inputText;
        // 如果有过滤规则
        if (this.filterReg && this.filterReg !== "") {
          const reg = new RegExp(this.filterReg, "ig");
          text = text.replace(reg, "");
        }
        // 超过限制长度的切断
        if (text.length > this.max) {
          this.stateValue = text.slice(0, this.max);
        } else {
          this.stateValue = text;
        }
        return this.stateValue;
      }
    },
    computed: {
      countLength() {
        return this.stateValue.length;
      }
    },
    mounted() {}
  };
</script>