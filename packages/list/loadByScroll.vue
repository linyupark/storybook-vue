<template>
  <!-- 列表滑动到底部进行加载操作 -->
  <div class="load-by-scroll">
    <!-- 加载中时候显示 -->
    <div class="loading-wrapper" v-show="!noMore && stateLoading.value">
      <slot name="loading" />
    </div>
    <!-- 没有更多数据的时候显示 -->
    <div class="noMore-wrapper" v-show="noMore">
      <slot name="noMore" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.load-by-scroll {
  .loading-wrapper, .noMore-wrapper {
    min-height: px2vw(100);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: px2vw(28);
    color: #8c8c8c;
    i {
      font-size: px2vw(32);
      vertical-align: top;
    }
  }
}
</style>

<script>
  import useBoolean from "@crh/vue/functions/useBoolean";
  export default {
    name: "ListLoadByScroll",
    components: {},
    props: {
      /** 滚动容器dom selector 指定 */
      container: {
        type: String,
        required: true
      },
      /** 距离多少开始进入加载 */
      distance: {
        type: Number,
        default: 20
      },
      /** 已经到底 */
      noMore: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        stateLoading: useBoolean(false)
      };
    },
    watch: {
      noMore(isNoMore) {
        if (isNoMore) {
          // 当没有更多的时候自动关闭loading状态
          this.stateLoading.set(false);
        }
      }
    },
    methods: {
      /**
       * 滚动相关处理
       */
      scrollHandler() {
        if (this.$delayTimer) clearTimeout(this.$delayTimer);
        // 避免实时处理优化处理速度
        this.$delayTimer = setTimeout(() => {
          const containerRect = this.$containerEl.getBoundingClientRect();
          const elRect = this.$el.getBoundingClientRect();
          const distance = Math.abs(
            (containerRect.y || containerRect.top) +
              containerRect.height -
              (elRect.y || elRect.top)
          );
          // console.log('距离', distance, elRect.height);
          if (
            (distance - elRect.height) <= this.distance &&
            !this.noMore &&
            !this.stateLoading.value
          ) {
            this.stateLoading.set(true);
            this.$nextTick(() => {
              // 自动把loading的高度补偿滚动保证能被看到
              this.$containerEl.scrollTop +=
                this.$el.getBoundingClientRect().height + distance;
            });
            /**
             * 触发加载事件
             * @type {Event} load
             */
            this.$emit("load", () => {
              this.stateLoading.set(false);
            });
          }
        }, 100);
      }
    },
    computed: {},
    mounted() {
      this.$nextTick(() => {
        this.$containerEl = this.$root.$el.querySelector(this.container);
        if (!this.$containerEl) {
          throw new Error(
            "没有找到滚动容器，请查看 container 中设置的 selector 是否正确"
          );
        }
        this.$containerEl.addEventListener("scroll", this.scrollHandler, false);
      });
    },
    beforeDestroy() {
      this.$containerEl.removeEventListener("scroll", this.scrollHandler, false);
    }
  };
</script>