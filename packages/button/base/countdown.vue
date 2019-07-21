<style lang="scss" scoped>
  @import "./themes/reset.scss";
</style>

<template>
  <button
    @click="onClick"
    :disabled="loadingState.value || disabled"
    :class="{ [theme]: true, [size]: true, [type]: true }"
  >
    <span v-show="showText">
      <!-- @slot 左侧按钮内容 -->
      <slot v-show="showText" name="left" />
    </span>

    <span
      v-show="loadingState.value"
      ref="loading"
    >
      <!-- @slot 加载状态展示内容 -->
      <slot name="loading"></slot>
    </span>

    <span v-show="showText">
      <!-- @slot 右侧按钮内容 -->
      <slot name="right" />
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
      /** 页面刷新也要保持倒计时 false | sessionName */
      holdon: {
        type: Boolean | String,
        default: false
      },
      /** 自动开始倒计时 */
      autoStart: {
        type: Boolean,
        default: false
      },
      /** 后续点击可以循环倒计时 */
      loop: {
        type: Boolean,
        default: true,
      },
      /** 替换成倒计时数字的模板 */
      replacer: {
        type: String,
        default: "{[num]}"
      }
    },
    data() {
      return {
        countdown: useCountdown(this.startNumber, this.holdon)
      };
    },
    methods: {
      /** 更新数字 */
      updateNum() {
        this.$refs.loading.querySelector(
            `#num-${this._uid}`
          ).innerText = this.countdown.num;
      },

      /** 开始倒计时 */
      start() {
        this.updateNum();
        this.loadingState.set(true);
        if (this._timer) clearInterval(this._timer);
        if (this._finished) {
          this.loadingState.set(false);
          this.$refs.loading.innerHTML = '';
          return;
        }
        this._timer = setInterval(() => {
          this.countdown.down(0, 1);
          this.updateNum();
        }, 1000);

        this.countdown.onStop = this.onStop;
      },
      /** 完成倒计时后执行 */
      onStop(finished  = false) {
        clearInterval(this._timer);
        this.loadingState.set(false);
        this._stoped = true;
        if (finished) this._finished = true;
      },
      /** 点击处理 */
      onClick() {
        if (this._finished) return;
        //  不是自动开始的或者经历过一次倒计时要触发点击
        if (!this.autoStart || this._stoped) {
          /**
           * 转发点击事件
           * @type {Event} 处理点击
           */
          this.$emit("click", this.onStop);
        }
        if (this._stoped) {
          // 可循环则重新开始
          if (this.loop) {
            this.countdown.init();
            this.start();
          }
          else {
            this.$refs.loading.innerHTML = '';
          }
          return;
        }
        this.start();
      },
      /** 替换数字模板 */
      transformReplacer() {
        this.$refs.loading.innerHTML = this.$refs.loading.innerHTML.replace(
          this.replacer,
          `<span id="num-${this._uid}">${this.countdown.num}</span>`
        );
      }
    },
    mounted() {
      this.transformReplacer();

      this.countdown.onContinue = this.start;
      this.countdown.init();
      if (this.autoStart) {
        this.start();
      }
    },
    beforeDestroy () {
      clearInterval(this._timer);
    }
  };
</script>