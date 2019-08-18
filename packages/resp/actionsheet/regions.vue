<template>
  <!-- 地区选择器 -->
  <div
    class="actionsheet"
    :class="{
        visible: stateVisible
      }"
  >
    <div
      class="container"
      ref="container"
      :style="{
      ...containerInlineStyles
    }"
    >
      <!-- 列数组 -->
      <div class="col" v-for="lv in levels" :key="lv">
        <!-- 根据联动状态展示列表 -->
      </div>
    </div>
    <div
      class="mask"
      ref="mask"
      @click="onMaskClick"
      :style="{
        ...maskInlineStyles
      }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
  @import "./index";
</style>

<script>
  import Base from "./index";
  export default {
    name: "ActionsheetRegions",
    extends: Base,
    components: {
    },
    props: {
      /** 选择层级对应显示几列 provinces：省，cities：市，areas：区 */
      levels: {
        type: Array,
        default: () => (['provinces', 'cities', 'areas'])
      },
      /** 默认选中数据 */
      default: {
        type: Array,
        default: () => (['北京市', '市辖区'])
      }
    },
    data() {
      return {
        /** 选中的数据 */
        selected: []
      };
    },
    methods: {
      /** 根据联动数据筛选列表数据 */
      filterData() {
        
      }
    },
    computed: {
    },
    created() {
      /** 按需获取联动数据 */
      this.levels.map(async (lv, i) => {
        const data = await import(`@crh/vue/stores/${lv}`);
        this[lv] = Object.freeze(data.default);
        /** 根据默认数据来填充 selected 数据 */
        if (this.default[i]) {
          this.selected[i] = this[lv].filter(item => {
            return item.name === this.default[i];
          });
        }
      });
      console.log(this.selected);
    },
    mounted() {}
  };
</script>