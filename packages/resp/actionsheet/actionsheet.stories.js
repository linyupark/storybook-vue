import { storiesOf } from '@storybook/vue';
import { select, object, array, text, boolean, number } from '@storybook/addon-knobs';

import ActionsheetBase from './index';
import List from '@crh/vue/list/';
import ListItem from '@crh/vue/list/item';
import ButtonBase from '@crh/vue/button/base';
import ActionsheetList from "./list";
import ActionsheetRegions from "./regions";


storiesOf('反馈|Actionseet', module).add(
  'Base',
  () => ({
    components: {
      ActionsheetBase,
      List,
      ListItem,
      ButtonBase
    },
    props: {
      /** 是否可见 */
      visible: {
        type: Boolean,
        default: boolean('visible: 是否可见', false)
      },
    },
    methods: {
      onOpen(close) {
        this.$refs.actionsheet.show();
        close();
      },
      onClose(close) {
        this.$refs.actionsheet.close();
        close();
      }
    },
    data() {
      return {
      }
    },
    mounted() {
    },
    template: `
      <div style="height: 150vh">
        <h4>基础上滑抽屉</h4>
        <ActionsheetBase
          :visible="visible"
          ref="actionsheet"
        >
          <List>
            <ListItem>发布线索</ListItem>
            <ListItem>发布商机</ListItem>
            <ListItem>添加联系人</ListItem>
          </List>
          <ButtonBase @click="onClose">取消</ButtonBase>
          <br />
        </ActionsheetBase>

        <ButtonBase @click="onOpen">打开</ButtonBase>
      </div>
    `
  }),
  {
    info: true,
    knobs: {
      escapeHTML: false
    }
  }
).add(
  'List',
  () => ({
    components: {
      ActionsheetList,
      ButtonBase
    },
    props: {
      /** 行动列表 */
      actions: {
        type: Array,
        default: array('actions: 行动列表', [
          {id: 'add', label: '添加记录'},
          {id: 'remove', label: '删除记录'},
        ])
      },
    },
    methods: {
      onOpen(close) {
        this.$refs.actionsheet.show();
        close();
      },
      onAction(action) {
        console.log('选择了', action);
        this.$refs.actionsheet.close();
      }
    },
    data() {
      return {
      }
    },
    mounted() {
    },
    template: `
      <div style="height: 150vh">
        <h4>动作选择</h4>
        <ActionsheetList
          ref="actionsheet"
          :actions="actions"
          @action="onAction"
        ></ActionsheetList>
        <ButtonBase @click="onOpen">打开</ButtonBase>
      </div>
    `
  }),
  {
    info: true,
    knobs: {
      escapeHTML: false
    }
  }
).add(
  'Regions',
  () => ({
    components: {
      ActionsheetRegions,
      ButtonBase
    },
    props: {
      /** 选择层级对应显示几列 provinces：省，cities：市，areas：区 */
      levels: {
        type: Array,
        default: () => array('levels: 选择层级', ["provinces", "cities", "areas"])
      },
      /** 默认选中数据 需要参考 stories里的对应js code */
      selected: {
        type: Array,
        default: () => array('selected: 默认选中数据', ["33", "3301"])
      }
    },
    methods: {
      onOpen(close) {
        this.$refs.actionsheet.show();
        close();
      },
      onSelect(data) {
        this.selectData = data.map(item => item.name).join(',');
        this.$refs.actionsheet.close();
      }
    },
    data() {
      return {
        selectData: ''
      }
    },
    computed: {
    },
    mounted() {
    },
    template: `
      <div>
        <ActionsheetRegions 
          ref="actionsheet" 
          :levels="levels"
          :selected="selected"
          @select="onSelect"
        />
        <br /><br />
        <center v-show="selectData !== ''">选择变为: {{selectData}}</center> 
        <br /><br />
        <ButtonBase @click="onOpen">打开</ButtonBase>
      </div>
    `
  }),
  {
    info: true,
    knobs: {
      escapeHTML: false
    }
  }
);
