<style lang="scss" scoped>
  .container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100vw;
    height: px2vw(88);
    background: #ffffff;
    .slide {
      width: px2vw(40);
      height: px2vw(4);
      background: #3e86f7;
      position: absolute;
      transition: left 0.2s ease;
      border-radius: $hairline2;
      top: px2vw(88);
    }
  }
</style>


<template>
  <!-- tab滑动结果过滤 -->
  <div
    class="container"
    :style="{...containerInlineStyles}"
  >
    <slot />
    <div
      class="slide"
      ref="slide"
      :style="{
      visibility: slideLeft === '-1px' ? 'hidden' : 'visible',
      left: slideLeft,
      ...slideInlineStyles
    }"
    ></div>
  </div>
</template>

<script>
  export default {
    name: "FilterTabSlide",
    components: {},
    props: {
      /** 当前选中的tab index */
      index: {
        type: Number,
        default: 0
      },
      /** 容器样式微调 */
      containerInlineStyles: {
        type: Object,
        default: () => ({})
      },
      /** 滑块样式微调 */
      slideInlineStyles: {
        type: Object,
        default: () => ({})
      }
    },
    watch: {
      stateIndex(newIndex) {
        this.setSlideLeft();
      }
    },
    data() {
      return {
        stateIndex: this.$props.index,
        slideLeft: "-1px"
      };
    },
    methods: {
      getTabItems() {
        return this.$slots.default.filter((VNode, i) => VNode.tag);
      },
      setCurrentTab() {
        let tabItems = this.getTabItems();
        if (tabItems.length === 0) {
          throw new Error("请在标签内放置tab选项卡内容.");
        }
        tabItems.forEach((VNode, i) => {
          VNode.elm.addEventListener("click", () => {
            this.stateIndex = i;
            /**
             * 改变tab
             * @type {Event}
             */
            this.$emit("change", this.stateIndex);
          });
        });
        this.setSlideLeft();
      },
      setSlideLeft() {
        const slide = this.$refs.slide;
        const slideWidth = slide.clientWidth;
        const tabWidth = this.$el.clientWidth;
        const tabItemNum = this.getTabItems().length;
        // console.log("数量", tabItemNum);
        const itemWidth = tabWidth / tabItemNum;
        // 计算出 每个 tab slide 左错位距离
        const slideOffsetLeft = (itemWidth - slideWidth) / 2;
        this.slideLeft = `${this.stateIndex * itemWidth + slideOffsetLeft}px`;
      }
    },
    computed: {},
    mounted() {
      this.setCurrentTab();
      // 避免切换竖横屏导致定位错误
      window.addEventListener('resize', this.setSlideLeft, false);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.setSlideLeft, false);
    }
  };
</script>