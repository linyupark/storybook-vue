<template>
  <!-- 搜索框 -->
  <div class="search">
    <!-- 放大镜图标 -->
    <svg style="display: none">
      <symbol
        id="icon-sousuo"
        viewBox="0 0 1024 1024"
      >
        <path d="M718.496 673.28l190.816 190.784a32 32 0 1 1-45.248 45.248l-190.816-190.816A350.56 350.56 0 0 1 448 800C253.6 800 96 642.4 96 448S253.6 96 448 96s352 157.6 352 352c0 85.664-30.624 164.224-81.504 225.28zM448 736a288 288 0 1 0 0-576 288 288 0 0 0 0 576z"></path>
      </symbol>
    </svg>
    <InputBase
      :placeholder="(empty && !isFocus) ? '' : placeholder"
      :max="max"
      :value="stateValue"
      :autoFocus="autoFocus"
      @focus="onFocus"
      @blur="onBlur"
      :inputInlineStyles="{
        padding: `0 ${30/750*100}vw 0 ${62/750*100}vw`,
        width: `${598/750*100}vw`
      }"
      @input="onInput"
    />
    <!-- 提示信息居中覆盖 -->
    <div v-show="empty && !isFocus" class="placeholder">
      <SvgIcon
        :size="`${36/750*100}vw`"
        color="#bfbfbf"
        icon="icon-sousuo"
      />
      <span>{{placeholder}}</span>
    </div>
    <!-- 聚焦显示搜索图标 -->
    <div v-show="isFocus || !empty" class="search-icon-input">
      <SvgIcon
        :size="`${36/750*100}vw`"
        color="#bfbfbf"
        icon="icon-sousuo"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .search {
    position: relative;
    .placeholder {
      position: absolute;
      width: 100vw;
      // height: px2vw(88);
      text-align: center;
      top: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #bfbfbf;
      font-size: px2vw(26);
      pointer-events: none;

      span {
        margin-left: px2vw(10);
      }
    }
    .search-icon-input {
      position: absolute;
      left: px2vw(45);
      top: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>


<script>
  import SvgIcon from "@crh/vue/icon/svg";
  import InputBase from "@crh/vue/input/base/";
  export default {
    name: "InputSearch",
    components: {
      SvgIcon,
      InputBase
    },
    props: {
      /** 设置默认显示数据 */
      value: {
        type: String,
        default: ""
      },
      /** 帮助提示信息 */
      placeholder: {
        type: String,
        default: "请搜索"
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
      /** 多少时间停顿才发送搜索词 */
      searchDelay: {
        type: Number,
        default: 500
      }
    },
    data() {
      return {
        stateValue: this.$props.value,
        stateFocus: false,
      };
    },
    watch: {
      value: {
        handler(newValue) {
          this.stateValue = newValue;
          this.$emit('search', newValue);
        }
      }
    },
    methods: {
      onFocus() {
        this.stateFocus = true;
        this.$emit('focus');
      },
      onBlur() {
        this.stateFocus = false;
        this.$emit('blur');
      },
      onInput(newValue) {
        if (~newValue.search("'")) return;
        if (this.searchDelayTimer) clearTimeout(this.searchDelayTimer);
        this.searchDelayTimer = setTimeout(() => {
          this.$emit('search', newValue);
          console.log(`search: ${newValue}`);
        }, this.searchDelay);
      }
    },
    computed: {
      empty() {
        return !this.stateValue || String(this.stateValue).length === 0;
      },
      isFocus() {
        return this.stateFocus;
      },
    },
    mounted() {
      // 默认有值的直接发起搜索
      if (this.stateValue && this.stateValue.length > 0) {
        this.onInput(this.stateValue);
      }
    }
  };
</script>
