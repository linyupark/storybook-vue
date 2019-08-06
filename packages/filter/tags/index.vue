<template>
  <!-- 标签选择筛选 -->
  <div class="filter-tags">
    <template v-for="(item, i) in items">
      <label :key="`label-${i}`">
        {{item.label}}
      </label>
      <!-- 标签列表 -->
      <div class="tags" :key="`tags-${i}`">
        <div
          class="tag"
          :class="{ selected: isSelected(item, tag) }"
          v-for="(tag, j) in item.tags"
          :key="j"
          @click="onSelect(tag, item)"
        >
          {{tag.text}}
        </div>
      </div>
    </template>
    <!-- 确认按钮 -->
    <div class="btn-row">
      <button class="reset" @click="onReset">清空</button>
      <button class="confirm" @click="onConfirm">确定</button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .filter-tags {
    line-height: px2vw(40);
    label {
      padding: px2vw(20) px2vw(30) 0 px2vw(30);
      display: block;
      color: #8c8c8c;
      font-size: px2vw(26);
    }
    .tags {
      padding: 0 px2vw(30) px2vw(40) px2vw(30);
      display: flex;
      align-items: center;
      justify-content: left;
      flex-wrap: wrap;

      .tag {
        padding: px2vw(12) px2vw(16);
        border: $hairline solid #F5F5F5;
        color: #595959;
        border-radius: 2px;
        font-size: px2vw(26);
        display: inline-block;
        margin-top: px2vw(18);
        margin-right: px2vw(40);
        background: #F5F5F5;

        &.selected {
          border-color: #3e86f7;
          color: #3e86f7;
          background: #fff;
        }
      }
    }
    .btn-row {
      height: px2vw(96);
      display: flex;
      border-top: $hairline solid #f5f5f5;
      button {
        height: px2vw(96);
        width: 50%;
        border: none;
        background: #fff;
        color: #3E86F7;
        font-size: px2vw(36);
        outline: none;
        &.confirm {
          color: #fff;
          background: #3E86F7;
        }
      }
    }
  }
</style>
<script>
  export default {
    name: "FilterTags",
    components: {},
    props: {
      /**
       * 标签选项列表
       * [name, label, tags: [{ key, text }], multi]
       */
      items: {
        type: Array,
        default: () => ([])
      },
      /** 默认选中的选项 */
      selectedItems: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        stateSelectedItems: this.$props.selectedItems
      };
    },
    methods: {
      /** 选中某项 */
      onSelect(tag, group) {
        if (this.isSelected(group, tag)) {
          // 清除
          this.stateSelectedItems[group.name] = this.stateSelectedItems[group.name].filter(oItem => oItem.key != tag.key);
        }
        else if (!group.multi) {
          this.stateSelectedItems[group.name] = [tag];
          this.stateSelectedItems = {...this.stateSelectedItems};
          return;
        }
        else {
          this.stateSelectedItems[group.name] = (this.stateSelectedItems[group.name] || []).concat(tag);
        }
        // 更新状态
        this.stateSelectedItems = {...this.stateSelectedItems};
      },
      /** 全部清楚 */
      onReset() {
        this.stateSelectedItems = {};
      },
      /** 确认提交 */
      onConfirm() {
        /**
         * 确认提交
         * @type {Event}
         */
        this.$emit('confirm', this.stateSelectedItems);
      },
      /**
       * 是否选中
       */
      isSelected(group, tag) {
        if (!this.stateSelectedItems[group.name]) return false;
        return !!~this.stateSelectedItems[group.name].findIndex(
          sItem => sItem.key === tag.key
        );
      },
      /** 手动恢复到初始化数据 */
      initSelectedItems() {
        this.stateSelectedItems = this.selectedItems;
      }
    },
    computed: {},
    mounted() {},
    destroyed() {
    }
    // name: '', watch: {}, mixins: [], filters: {}, directives: {},
    // beforeCreate() {}, created() {}, beforeMount() {}, beforeUpdate() {}, updated() {}, activated() {}, deactivated() {}, beforeDestroy() {}, destroyed() {},
  };
</script>
