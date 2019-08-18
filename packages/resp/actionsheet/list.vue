<template>
  <!-- 简单的列表选择行动选择 -->
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
      <List>
        <ListItem
          v-for="(action, i) in actions"
          :key="i"
          @click="$emit('action', action)"
          :inlineStyles="{
            height: `${(110 / 750) * 100}vw`,
            justifyContent: 'center'
          }"
        >
          <span class="action">{{action.label}}</span>
        </ListItem>
      </List>
      <List :slotSpaceStyles="{
        height: `${(20 / 750) * 100}vw`,
        background: '#f5f5f5'
      }">
        <ListItem
          :inlineStyles="{
            height: `${(110 / 750) * 100}vw`,
            justifyContent: 'center'
          }"
          @click="close"
        >
          <span class="action cancelText">取消</span>
        </ListItem>
      </List>
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
  .actionsheet {
    .action {
      font-size: px2vw(36);
      color: #262626;
      &.cancelText {
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
    name: "ActionsheetList",
    extends: Base,
    components: {
      List,
      ListItem
    },
    props: {
      /**
       * 动作列表 label必须要有，作为显示
       * eg: [{id: 1, label: '动作1'}]
       */
      actions: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {};
    },
    methods: {},
    computed: {},
    mounted() {}
  };
</script>