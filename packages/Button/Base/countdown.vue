<style lang="scss" scoped>
  @import "./themes/reset.scss";
</style>

<template>
  <button
    @click="onClick"
    :disabled="loadingState.value || disabled"
    :class="{ [theme]: true, [size]: true, [type]: true }"
  >
    <span
      v-show="loadingState.value"
      ref="loading"
    >
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
  import ButtonBase from "@crh/vue/button/base";
  import useCountdown from "@crh/vue/mixins/useCountdown";

  export default {
    name: "ButtonCountdown",
    extends: ButtonBase,
    props: {
      /** 起始数字 */
      startNumber: {
        type: Number,
        required: true
      },
      /** 每次改变数字幅度 */
      step: {
        type: Number,
        default: 1
      },
      /** 替换成倒计时数字的模板 */
      replacer: {
        type: String,
        default: "{[num]}"
      }
    },
    data() {
      return {
        countdown: useCountdown(this.startNumber)
      };
    },
    mounted() {
      this.$refs.loading.innerHTML = this.$refs.loading.innerHTML.replace(
        this.replacer,
        `<i id="num-${this._uid}">${this.countdown.num}</i>`
      );
      this.loadingState.set(true);
      const timer = setInterval(() => {
        this.countdown.down(0, 1);
        this.$refs.loading.querySelector(
          `#num-${this._uid}`
        ).innerText = this.countdown.num;
      }, 1000);
      this.countdown.onStop = () => {
        clearInterval(timer);
        this.loadingState.set(false);
        this.$refs.loading.innerHTML = '';
      };
    }
  };
</script>