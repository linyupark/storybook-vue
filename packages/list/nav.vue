<template>
  <!-- 侧栏滑动定位列表位置 -->
  <div class="scroll-nav">
    <div class="list">
      <!-- @slot 列表内容 -->
      <slot />
    </div>
    <ul
      class="nav"
      @click="onNavClick"
      @touchmove="onNavMove"
    >
      <li
        class="keypoint"
        :key="key"
        v-for="(key) in keywords"
      >
        {{key}}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  .scroll-nav {
    .nav {
      list-style: none;
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      right: 0px;
      color: #8c8c8c;
      font-size: px2vw(24);
      line-height: px2vw(26);
      z-index: 99;
    }
    .keypoint {
      padding: px2vw(1) px2vw(18) px2vw(1) px2vw(40);
    }
  }
</style>

<script>
  export default {
    name: "ListNav",
    components: {},
    props: {
      /** 可用于导航滑动的关键字数组 */
      keywords: {
        type: Array,
        default: () => []
      },
      /**
       * 定义滚动元素 id 的前置与选中的keyword 合并成完整的 id
       * eg：'list-nav-' + 'A' -> id='list-nav-A'
       */
      idPrefix: {
        type: String,
        default: "list-nav-"
      },
      /** 包裹可滚动的容器，不填写的话默认为window级别滚动 */
      scroller: {
        type: String,
        default: null
      },
      /** 默认滚动到哪个key */
      keyword: {
        type: String,
        default: null
      },
      /** 滚动偏移量(避免在顶部看不到) */
      offsetY: {
        type: Number,
        default: 50
      }
    },
    data() {
      return {};
    },
    methods: {
      onNavClick(ev) {
        const key = ev.target.innerText;
        console.log('点击跳转到', key);
        if (~this.keywords.indexOf(key)) {
          this.scrollToId(key);
        }
      },
      onNavMove(ev) {
        const pointLocation = ev.changedTouches[0];
        // 获取到真正下方元素
        let realTarget = document.elementFromPoint(
          pointLocation.clientX,
          pointLocation.clientY
        );
        const key = realTarget ? realTarget.innerText : "";
        // 排除无效的关键字
        if (~this.keywords.indexOf(key)) {
          // console.log('滑动跳转到', key);
          this.scrollToId(key);
        }
      },
      scrollToId(id) {
        const scrollToTarget = this.$el.querySelector(`#${this.idPrefix}${id}`);
        if (!scrollToTarget) return false;
        const offsetY = scrollToTarget.offsetTop;
        if (!this.scroller) {
          // 不设置滚动容器默认为 window滚动
          window.scrollTo(0, offsetY - this.offsetY);
        } else {
          // 设置了滚动容器
          const scroller = document.querySelector(this.scroller);
          const scrollerOffsetY = scroller.getBoundingClientRect().y || scroller.getBoundingClientRect().top;
          if (!scroller) return false;
          scroller.scrollTop = offsetY - scrollerOffsetY - this.offsetY;
        }
        this.$emit("scrollTo", {
          id,
          offsetY
        });
        return offsetY;
      }
    },
    computed: {},
    mounted() {
      if (this.keyword) {
        this.scrollToId(this.keyword);
      }
    }
  };
</script>