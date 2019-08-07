<template>
  <!-- 城市选择器 -->
  <div class="filter-regions">
    <!-- 省份滑块 -->
    <div class="province-container">
      <div
        class="item"
        :class="{
          checked: provinceId === province.id
        }"
        @click="checkProvince(province)"
        v-for="(province, i) in getProvinces()"
        :key="i"
      >
        {{province.name}}
      </div>
    </div>
    <!-- 城市tags -->
    <div class="city-list">
      <div
        class="tag"
        v-for="(city, i) in cityList"
        :key="i"
        :style="{
          padding: city.name.length >= 5 ? `0 ${10 / 750 * 100}vw` : 0
        }"
        :class="{
          checked: cityId === city.id
        }"
        @click="checkCity(city)"
      >
        {{city.name}}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .filter-regions {
    background: #fff;
    width: 100vw;
    .province-container {
      background: rgba(250, 250, 250, 1);
      width: px2vw(178);
      height: px2vw(750);
      overflow-x: hidden;
      overflow-y: auto;
      float: left;
      &::-webkit-scrollbar {
        width: 0px; /* 纵向滚动条宽度 */
        background: none;
      }
      &::-webkit-scrollbar-thumb {
        width: 0px;
        background: none;
      }
      .item {
        font-size: px2vw(32);
        color: #8c8c8c;
        text-indent: 20px;
        padding: px2vw(20) 0;
        &.checked {
          color: #272727;
        }
      }
    }
    .city-list {
      margin-left: px2vw(178);
      padding: px2vw(20) 0 px2vw(20) px2vw(30);
      height: px2vw(750);
      overflow-x: hidden;
      overflow-y: auto;
      .tag {
        display: inline-block;
        text-align: center;
        min-width: px2vw(156);
        height: px2vw(56);
        line-height: px2vw(56);
        color: #595959;
        font-size: px2vw(26);
        background: rgba(245, 245, 245, 1);
        border-radius: $hairline2;
        margin: 0 px2vw(20) px2vw(20) 0;
        border: $hairline solid rgba(245, 245, 245, 1);
        &.checked {
          border-color: #3e86f7;
          color: #3e86f7;
          background: #fff;
        }
      }
    }
  }
</style>

<script>
  import RegionsData from "./data";
  export default {
    name: "FilterRegionsCity",
    components: {},
    props: {},
    data() {
      return {
        provinceId: null,
        cityId: null,
        cityList: []
      };
    },
    methods: {
      /** 获取省份 */
      getProvinces() {
        return RegionsData.province;
      },
      /** 当前省份对应的城市 */
      checkProvince(province) {
        // console.log(province);
        this.provinceId = province.id;
        this.cityList = RegionsData.city[province.id];
      },
      /** 选中城市 */
      checkCity(city) {
        this.cityId = city.id;
        this.$emit('checkCity', city.name)
      }
    },
    computed: {},
    mounted() {}
    // name: '', watch: {}, mixins: [], filters: {}, directives: {},
    // beforeCreate() {}, created() {}, beforeMount() {}, beforeUpdate() {}, updated() {}, activated() {}, deactivated() {}, beforeDestroy() {}, destroyed() {},
  };
</script>