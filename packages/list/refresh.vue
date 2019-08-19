<style lang="scss" scoped>
  .refresh {
    text-align: center;
    .rotate-mark {
      width: px2vw(60);
      height: px2vw(60);
      border-radius: 50%;
      border: $hairline solid #ccc;
      position: absolute;
      z-index: 9999;
      background: #fff;
      opacity: 0;
      left: px2vw(375 - 30);
      font-size: px2vw(36);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #999;
      font-weight: bold;
      box-shadow: 0 0 5px #ccc;
      &.loading {
        animation: rotate 1s linear infinite;
      }
    }
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>


<template>
  <!-- 下拉刷新 -->
  <div class="refresh">
    <!-- svg 图标 -->
    <svg style="display: none"><symbol id="icon-shuaxin" viewBox="0 0 1024 1024"><path d="M972.8 102.4c-30.72 0-51.2 20.48-51.2 51.2v51.2c-51.2-71.68-122.88-128-204.8-158.72C460.8-66.56 158.72 51.2 46.08 307.2S51.2 865.28 307.2 977.92s558.08-5.12 670.72-261.12h-5.12c0-30.72-20.48-51.2-51.2-51.2s-51.2 20.48-51.2 51.2h-5.12C819.2 793.6 752.64 855.04 665.6 890.88c-209.92 87.04-445.44-15.36-532.48-225.28s15.36-450.56 225.28-532.48c189.44-81.92 404.48 0 506.88 174.08H768c-30.72 0-51.2 20.48-51.2 51.2s20.48 51.2 51.2 51.2h204.8c30.72 0 51.2-20.48 51.2-51.2V153.6c0-30.72-20.48-51.2-51.2-51.2z"  ></path></symbol></svg>
    <!-- 刷新标识圈 -->
    <div
      class="rotate-mark"
      :class="{
        loading: stateLoading.value
      }"
      :style="{
        top: `${markY + markYOffset}px`,
        opacity: `${markY / distance}`,
        transition: useTransition.value ? 'all .3s' : 'none',
        transform: `rotate(${markY / distance * 360}deg)`,
        ...inlineStyles
      }"
    >
      <IconSvg icon="icon-shuaxin" color="#3e86f7" />
    </div>
  </div>
</template>

<script>
  import useBoolean from "@crh/vue/functions/useBoolean";
  import IconSvg from "@crh/vue/icon/svg";
  export default {
    name: "ListRefresh",
    components: {
      IconSvg
    },
    props: {
      /** 滚动容器dom selector 指定 */
      container: {
        type: String,
        required: true
      },
      /** 是否可以下拉刷新 */
      disabled: {
        type: Boolean,
        default: false
      },
      /** 下拉多少触发刷新 */
      distance: {
        type: Number,
        default: 80
      },
      /** 进入后立马执行一次刷新 */
      refreshOnLoad: {
        type: Boolean,
        default: false,
      },
      /** 标志样式微调 */
      inlineStyles: {
        type: Object,
        default: () => ({})
      },
      /** 标志垂直偏移 */
      markYOffset: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        // 加载标志Y轴坐标
        markY: 0,
        refreshReady: useBoolean(true),
        useTransition: useBoolean(false),
        stateLoading: useBoolean(this.$props.refreshOnLoad),
      };
    },
    watch: {
      "refreshReady.value": {
        handler(refreshReady) {
          if (refreshReady) {
            this.bindTouch();
          } else {
            this.unbindTouch();
          }
        }
      }
    },
    methods: {
      /** 阻尼 */
      damping(distance) {
        return (distance >> 1) - distance * 0.02;
      },
      bindTouch() {
        this.$root.$el.addEventListener(
          "touchstart",
          this.touchstartHandler,
          false
        );
        this.$root.$el.addEventListener(
          "touchmove",
          this.touchmoveHandler,
          false
        );
        this.$root.$el.addEventListener("touchend", this.touchendHandler, false);
      },
      unbindTouch() {
        this.$root.$el.removeEventListener(
          "touchstart",
          this.touchstartHandler,
          false
        );
        this.$root.$el.removeEventListener(
          "touchmove",
          this.touchmoveHandler,
          false
        );
        this.$root.$el.removeEventListener(
          "touchend",
          this.touchendHandler,
          false
        );
      },
      scrollHandler() {
        if (this.$delayTimer) clearTimeout(this.$delayTimer);
        this.refreshReady.set(false);
        if (this.disabled) {
          return;
        }
        // 避免实时处理优化处理速度
        this.$delayTimer = setTimeout(() => {
          const containerRect = this.$containerEl.getBoundingClientRect();
          const elRect = this.$el.getBoundingClientRect();
          this.refreshReady.set(
            (containerRect.y || containerRect.top).toFixed(0) ==
              (elRect.y || elRect.top).toFixed(0)
          );
        }, 100);
      },
      touchstartHandler(event) {
        this.$startPageY = event.touches[0].pageY;
      },
      touchmoveHandler(event) {
        const offsetY = event.touches[0].pageY - this.$startPageY;
        if (offsetY > 0) {
          // 在下拉
          const moveY = this.damping(offsetY);
          this.markY = moveY < this.distance ? moveY : this.distance;
        }
      },
      touchendHandler() {
        if (this.markY == this.distance) {
          // 刷新
          this.stateLoading.set(true);
          this.$emit('refresh', this.markReset);
        } else {
          this.markReset();
        }
      },
      markReset() {
        this.stateLoading.set(false);
        this.useTransition.set(true);
        this.markY = 0;
        setTimeout(() => {
          this.useTransition.set(false);
        }, 300);
      }
    },
    computed: {},
    mounted() {
      this.$nextTick(() => {
        this.$containerEl = this.$root.$el.querySelector(this.container);
        if (!this.$containerEl) {
          throw new Error(
            "没有找到容器，请查看 container 中设置的 selector 是否正确"
          );
        }
        this.$containerEl.addEventListener("scroll", this.scrollHandler, false);
        this.bindTouch();

        // 进入就执行一次刷新
        if (this.stateLoading.value) {
          this.markY = this.distance;
          this.$emit('refresh', this.markReset);
        }
      });
    },
    beforeDestroy() {
      if (this.$containerEl) {
        this.$containerEl.removeEventListener("scroll", this.scrollHandler, false);
        this.unbindTouch();
      }
    }
  };
</script>
