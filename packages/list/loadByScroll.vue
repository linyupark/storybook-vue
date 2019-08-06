<template>
  <!-- 列表滑动到底部进行加载操作 -->
  <div class="load-by-scroll">
    <!-- 加载中时候显示 -->
    <div v-show="!noMore && stateLoading.value">
      <slot name="loading" />
    </div>
    <!-- 没有更多数据的时候显示 -->
    <div v-show="noMore">
      <slot name="noMore" />
    </div>
  </div>
</template>

<script>
  import useBoolean from "@crh/vue/functions/useBoolean";
  export default {
    name: 'ListLoadByScroll',
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
        stateLoading: useBoolean(false),
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
          const distance = Math.abs(containerRect.y + containerRect.height - elRect.y);
          // console.log('距离', distance);
          if (distance <= this.distance && !this.noMore && !this.stateLoading.value) {
            this.stateLoading.set(true);
            this.$nextTick(() => {
              // 自动把loading的高度补偿滚动保证能被看到
              this.$containerEl.scrollTop += (this.$el.getBoundingClientRect().height + distance);
            });
            /**
             * 触发加载事件
             * @type {Event} load
             */
            this.$emit('load', this.stateLoading);
          }
        }, 100);
      }
    },
    computed: {},
    mounted() {
      this.$nextTick(() => {
        this.$containerEl = this.$root.$el.querySelector(this.container);
        if (!this.$containerEl) {
          throw new Error('没有找到滚动容器，请查看 container 中设置的 selector 是否正确');
        }
        this.$containerEl.addEventListener('scroll', this.scrollHandler, false);
      });
    },
    // name: '', watch: {}, mixins: [], filters: {}, directives: {},
    // beforeCreate() {}, created() {}, beforeMount() {}, beforeUpdate() {}, updated() {}, activated() {}, deactivated() {}, beforeDestroy() {}, destroyed() {},
  };
</script>