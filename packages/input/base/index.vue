<template>
  <!-- 基础输入框 -->
  <div
    class="input-wrapper"
    :style="{
      ...wrapperInlineStyles
    }"
  >
    <!-- 清除图标 -->
    <svg style="display: none">
      <symbol
        id="icon-qingchu"
        viewBox="0 0 1024 1024"
      >
        <path d="M512 896C299.936 896 128 724.064 128 512S299.936 128 512 128s384 171.936 384 384-171.936 384-384 384z m45.248-384l90.528-90.496a32 32 0 0 0-45.28-45.28L512 466.752l-90.496-90.528a32 32 0 0 0-45.28 45.28L466.752 512l-90.528 90.496a32 32 0 0 0 45.28 45.28L512 557.248l90.496 90.528a32 32 0 0 0 45.28-45.28L557.248 512z"></path>
      </symbol>
    </svg>
    <input
      ref="input"
      :type="type"
      :value="stateValue"
      :maxlength="max"
      :placeholder="placeholder"
      :style="{
        ...inputInlineStyles
      }"
      @input="updateValue($event, 'input')"
      @keyup="updateValue($event, 'keyup')"
      @change="updateValue($event, 'change')"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
    >
    <!-- 清除内容按钮 -->
    <div
      v-show="useClear && clearAble"
      class="clear-wrapper"
      @click="onClear"
    >
      <SvgIcon
        :size="`${36/750*100}vw`"
        icon="icon-qingchu"
        color="#999"
        :inlineStyles="{
          ...clearInlineStyles
        }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      border: none;
      outline: none;
      height: px2vw(64);
      width: px2vw(630);
      border-radius: px2vw(64);
      font-size: px2vw(26);
      color: #272727;
      padding: 0 px2vw(30);
      background: #f5f5f5;
      &::placeholder {
        color: #bfbfbf;
      }
    }
    .clear-wrapper {
      position: absolute;
      right: px2vw(45);
    }
  }
</style>

<script>
  import SvgIcon from "@crh/vue/icon/svg";
  export default {
    name: "InputBase",
    components: {
      SvgIcon
    },
    props: {
      /** 输入框类型 */
      type: {
        type: String,
        default: "text"
      },
      /** 一键清除按钮 */
      useClear: {
        type: Boolean,
        default: true
      },
      /** 设置默认显示数据 */
      value: {
        type: String,
        default: ""
      },
      /** 帮助提示信息 */
      placeholder: {
        type: String,
        default: ""
      },
      /** 最大输入长度 */
      max: {
        type: Number,
        default: 25
      },
      /** 自动聚焦 */
      autoFocus: {
        type: Boolean,
        default: false
      },
      /** 外框样式调试 */
      wrapperInlineStyles: {
        type: Object,
        default: () => ({})
      },
      /** 输入框内联样式 */
      inputInlineStyles: {
        type: Object,
        default: () => ({})
      },
      /** 清除按钮样式调整 */
      clearInlineStyles: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        // 输入框内容实时状态
        stateValue: this.$props.value,
      };
    },
    watch: {
      value: {
        handler(newValue) {
          this.stateValue = newValue;
          this.$emit('input', newValue);
        }
      }
    },
    methods: {
      async updateValue(event, eventName) {
        if (eventName === 'change') {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        this.stateValue = event.target.value;
        console.log(`${eventName}: ${this.stateValue}`);
        /**
         * 这里触发 input 常规的响应事件
         * @type {Event}
         */
        this.$emit(eventName, this.stateValue);
      },
      onClear() {
        this.stateValue = "";
        // 清除操作模拟输入空内容
        this.$emit('input', "");
        this.doFocus();
      },
      doFocus() {
        this.$refs.input.focus();
      }
    },
    computed: {
      clearAble() {
        return this.stateValue && String(this.stateValue).length > 0;
      }
    },
    mounted() {
      if (this.autoFocus) {
        this.doFocus();
      }
    }
  };
</script>
