<template>
  <!-- 下拉筛选 -->
  <div class="filter-dropdown">
    <!-- svg 图标 -->
    <svg style="display: none">
      <symbol
        id="icon-xiala"
        viewBox="0 0 1024 1024"
      >
        <path d="M512 629.568L808.16 288c13.824-12.928 28.544-12.928 44.096 0 15.552 12.928 19.456 26.912 11.744 42.016L512 736 160 330.016c-7.584-17.024-4.128-31.04 10.336-42.016 14.432-10.976 29.6-10.976 45.504 0L512 629.568z"></path>
      </symbol>
    </svg>
    <!-- 选中结果显示卡片 -->
    <div
      class="tabs"
      ref="tab"
      :class="{ onExpand: expandTab }"
    >
      <div
        @click="onExpand(i)"
        class="item"
        v-for="(item, i) in tabItems"
        :key="i"
      >
        {{item.text}}
        <IconSvg
          class="icon"
          icon="icon-xiala"
          :inlineStyles="{
          transition: 'transform 0.3s',
          transform: `rotate(${i == stateExpandIndex ? 180 : 0}deg)`
        }"
        />
      </div>
    </div>
    <!-- 不同选择时候展示的 slot -->
    <div
      class="options-slot"
      v-for="(slot, i) in tabItems"
      :key="i"
      v-show="expandTab && expandTab.key == slot.key"
      :style="{
        top: maskStyles().top
      }"
    >
      <!-- @slot slot-[key] 对应key的筛选具体内容 -->
      <slot :name="`slot-${slot.key}`" />
    </div>
    <!-- 遮罩 -->
    <div
      class="mask"
      v-show="expandTab"
      :style="{...maskStyles()}"
      @click="onUnexpand"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
  @import './theme/zyb.scss';
</style>

<script>
  import IconSvg from "@crh/vue/icon/svg";
  export default {
    name: "FilterDropdown",
    components: {
      IconSvg
    },
    props: {
      /** tab 选项卡展示列表 */
      tabItems: {
        type: Array,
        default: () => []
      },
      /** 当前选中的tab index */
      tabExpandIndex: {
        type: Number,
        default: -1
      }
    },
    data() {
      return {
        stateExpandIndex: this.$props.tabExpandIndex
      };
    },
    methods: {
      /**
       * 点击某下拉选项卡
       * @param {Number} index 选项卡对象index
       */
      onExpand(index) {
        if (index == this.stateExpandIndex) return this.onUnexpand();
        this.stateExpandIndex = index;
        this.$emit('expand', this.tabItems[index]);
      },
      /** 遮罩层的高度跟顶部位置计算 */
      maskStyles() {
        if (!this.$refs.tab) return {};
        const rect = this.$refs.tab.getBoundingClientRect();
        const top = (rect.top || rect.y) + this.$refs.tab.clientHeight;
        const height = `calc(100vh - ${top}px)`;
        return {
          top: `${top}px`,
          height
        };
      },
      /** 收起折叠 */
      onUnexpand() {
        this.stateExpandIndex = -1;
      }
    },
    computed: {
      /** 当前展开中的 tab */
      expandTab() {
        return this.tabItems[this.stateExpandIndex];
      },
    },
    mounted() {}
    // name: '', watch: {}, mixins: [], filters: {}, directives: {},
    // beforeCreate() {}, created() {}, beforeMount() {}, beforeUpdate() {}, updated() {}, activated() {}, deactivated() {}, beforeDestroy() {}, destroyed() {},
  };
</script>