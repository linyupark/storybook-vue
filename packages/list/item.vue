<template>
  <!-- 列表内容单元 -->
  <div class="item-wrapper" @click="$emit('click')">
    <div
      class="item"
      :class="short"
      :style="{
        ...inlineStyles
      }"
    >
      <!-- @slot 列表单元内容 -->
      <slot />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  $sideSpace: px2vw(30);
  $borderColor: #f5f5f5;
  .item-wrapper {
    position: relative;
    overflow: hidden;
    /deep/ .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: px2vw(88);
      padding: 0 $sideSpace;
      border-bottom: $hairline solid $borderColor;
      cursor: pointer;

      &.left {
        padding-left: 0;
        margin-left: $sideSpace;
      }

      &.right {
        padding-right: 0;
        margin-right: $sideSpace;
      }

      &.both {
        margin: 0 $sideSpace;
        padding: 0;
      }
    }
  }
</style>
<script>
  export default {
    name: "ListItem",
    components: {},
    props: {
      /** 那边需要缩进 */
      short: {
        type: "" | "left" | "right" | "both",
        default: ""
      },
      inlineStyles: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {};
    },
    methods: {},
    computed: {},
    mounted() {}
    // name: '', watch: {}, mixins: [], filters: {}, directives: {},
    // beforeCreate() {}, created() {}, beforeMount() {}, beforeUpdate() {}, updated() {}, activated() {}, deactivated() {}, beforeDestroy() {}, destroyed() {},
  };
</script>
