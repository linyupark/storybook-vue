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
      <div class="tabs">
        <div
          class="item"
          v-for="(label, i) in labels"
          :key="label.code"
          @click="selectIndex(i)"
        ><span>{{label.name}}</span></div>
        <div
          class="item"
          v-if="labels.length < levels.length"
          @click="selectIndex(labels.length)"
        >请选择</div>
      </div>
      <div
        class="options"
        ref="options"
      >
        <List>
          <ListItem
            :inlineStyles="{
            height: `${80/750*100}vw`,
            fontSize: `${28/750*100}vw`
          }"
            class="opt"
            v-for="opt in options"
            :key="opt.code"
            @click="selectOption(opt)"
          >
            <span :class="{ checked: opt.selected }">{{opt.name}}</span>
          </ListItem>
        </List>
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
  .container {
    .tabs {
      height: px2vw(80);
      width: 100vw;
      display: flex;
      justify-content: left;
      padding: 0 px2vw(30);
      box-sizing: border-box;
      border-bottom: $hairline solid #f5f5f5;
      .item {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        height: px2vw(80);
        border-bottom: px2vw(4) solid transparent;
        margin-right: px2vw(20);
        font-size: px2vw(28);
        span {
          max-width: px2vw(250);
          @include limitTextHeight(1);
        }
        color: #272727;
        &:last-child {
          border-color: #3e86f7;
        }
      }
    }
    .options {
      height: px2vw(556);
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        width: 0px; /* 纵向滚动条宽度 */
        background: none;
      }
      &::-webkit-scrollbar-thumb {
        width: 0px;
        background: none;
      }
      .checked {
        color: #3e86f7;
      }
    }
  }
</style>

<script>
  import Base from "./index";
  import List from "@crh/vue/list/";
  import ListItem from "@crh/vue/list/item";
  export default {
    name: "ActionsheetRegions",
    extends: Base,
    components: {
      List,
      ListItem
    },
    props: {
      /** 选择层级对应显示几列 provinces：省，cities：市，areas：区 */
      levels: {
        type: Array,
        default: () => ["provinces", "cities", "areas"]
      },
      /** 默认选中数据 */
      selected: {
        type: Array,
        default: () => []
        // default: () => ["33", "3301", "330106"]
      }
    },
    data() {
      return {
        /** 选中的数据 */
        stateSelected: this.$props.selected,
        /** 选中标签列表 */
        labels: [],
        /** 选项列表 */
        options: []
      };
    },
    watch: {
      selected: {
        handler(newSelect) {
          this.stateSelected = newSelect;
        },
        immediate: true
      },
      stateSelected(newSelect) {
        if (newSelect.length <= this.levels.length) {
          this.columnsData();
        }
        this.$nextTick(() => {
          const checkedOption = this.$refs.options.querySelector(".checked");
          if (!checkedOption) {
            this.$refs.options.scrollTop = 0;
          }
          if (newSelect.length === this.levels.length) {
            /**
             * 区域选择结果
             * @type {Event}
             */
            this.$emit('select', this.labels);
          }
        });
      }
    },
    methods: {
      /** 切换选择层级 */
      selectIndex(index) {
        this.stateSelected = this.stateSelected.slice(0, index);
      },
      /** 选择了某层级数据 */
      selectOption(option) {
        let newSelectState = [...this.stateSelected];
        if (newSelectState.length < this.levels.length) {
          newSelectState.push(option.code);
        } else {
          newSelectState[this.levels.length - 1] = option.code;
        }
        this.stateSelected = newSelectState;
      },
      /** 按需获取联动数据 */
      fetchData() {
        return Promise.all(
          this.levels.map(async (lv, i) => {
            const data = await import(`@crh/vue/stores/${lv}`);
            this[lv] = Object.freeze(data.default);
          })
        );
      },
      /** 根据当前选择计算展示数据 */
      columnsData() {
        if (!this.stateSelected) return [];
        const selectedLength = this.stateSelected.length;
        if (selectedLength === 0) {
          // 一个都没选则直接输出第一层列表
          this.labels = [];
          this.options = this[this.levels[0]];
          return;
        }
        // 已选展示
        let selected = [];
        let options = [];
        this.stateSelected.map((selectId, i) => {
          selected[i] = this[this.levels[i]].filter(item => {
            return item.code == selectId;
          })[0];
        });
        let nextLevel = this[this.levels[selectedLength]];
        if (!nextLevel) {
          // 没有下一层
          options = this[this.levels[selectedLength - 1]].filter(item => {
            let parentField = [, "provinceCode", "cityCode"][selectedLength - 1];
            return item[parentField] == this.stateSelected[selectedLength - 2];
          });
          options = options.map(opt => {
            if (opt.code == this.stateSelected[selectedLength - 1]) {
              return {
                ...opt,
                selected: true
              };
            }
            return opt;
          });
        } else {
          options = nextLevel.filter(
            item =>
              (item.cityCode || item.provinceCode) ==
              this.stateSelected[selectedLength - 1]
          );
        }
        this.labels = selected;
        this.options = options;
      }
    },
    computed: {},
    created() {},
    mounted() {
      this.fetchData().then(() => {
        this.columnsData();
      });
    },
    destroyed() {
    }
  };
</script>