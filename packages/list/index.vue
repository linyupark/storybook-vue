<template>
  <!-- 列表 -->
  <div class="list-wrapper">
    <div
      class="space"
      :style="{...slotSpaceStyles}"
    >
      <!-- @slot space 列表内容顶部空间样式 -->
      <slot name="space" />
    </div>
    <div class="list">
      <!-- @slot 默认列表内容 -->
      <slot />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  $sideSpace: px2vw(30);
  .space {
    display: flex;
    align-items: center;
    padding: 0 $sideSpace;
    font-size: px2vw(24);
  }

  .list {
    background: #fff;
  }
</style>
<script>
  export default {
    name: "List",
    components: {},
    props: {
      slotSpaceStyles: {
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
