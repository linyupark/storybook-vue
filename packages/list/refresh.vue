<style lang="scss" scoped>
  .refresh {
    display: flex;
    justify-content: center;
  }
  .rotate-mark {
    width: px2vw(60);
    height: px2vw(60);
    border-radius: 50%;
    border: $hairline solid #ccc;
    position: fixed;
    z-index: 999;
    background: #fff;
    top: 0;
    opacity: 0;
    font-size: px2vw(40);
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
    <svg style="display: none">
      <symbol
        id="icon-shuaxin"
        viewBox="0 0 1024 1024"
      >
        <path d="M826.88 262.656a32 32 0 1 1-45.504 43.904c-2.592-2.4-5.568-5.632-9.28-9.568a334.4 334.4 0 0 0-157.12-93.536c-179.264-48.032-363.52 58.336-411.52 237.568-48.032 179.264 58.336 363.52 237.568 411.52 169.28 45.376 344.64-47.104 403.232-211.04 1.248-3.424 2.4-6.88 3.52-10.368a5.312 5.312 0 0 1 0.896-1.6 32 32 0 1 1 59.36 23.328c-1.12 3.424-2.304 6.816-3.52 10.176-69.376 194.144-277.376 305.632-480.032 251.328-213.408-57.184-340.032-276.48-282.88-489.92 57.216-213.376 276.544-340 489.92-282.816a398.144 398.144 0 0 1 193.12 117.984c0.96 1.056 1.696 2.08 2.24 3.04z"></path>
      </symbol>
    </svg>
    <!-- 刷新标识圈 -->
    <div
      class="rotate-mark"
      :class="{
        loading: stateLoading.value
      }"
      :style="{
        top: `${markY}px`,
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
        if (this.disabled) {
          this.refreshReady.set(false);
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
    }
    // name: '', watch: {}, mixins: [], filters: {}, directives: {},
    // beforeCreate() {}, created() {}, beforeMount() {}, beforeUpdate() {}, updated() {}, activated() {}, deactivated() {}, beforeDestroy() {}, destroyed() {},
  };
</script>
