import { storiesOf } from '@storybook/vue';
import { text, select, boolean, number, array } from '@storybook/addon-knobs';

import FilterDropdown from './index';
import List from '@crh/vue/list';
import ListItem from '@crh/vue/list/item';
import IconSvg from '@crh/vue/icon/svg';

storiesOf('ELEMENT|Filter', module).add(
  'Dropdown',
  () => ({
    components: {
      FilterDropdown,
      List,
      ListItem,
      IconSvg
    },
    props: {
    },
    data() {
      return {
        // 时间排序
        timeFilterOptions: [
          { key: 'time', value: 'desc', text: '时间倒序' },
          { key: 'time', value: 'asc', text: '时间正序' }
        ],
        // 状态选择
        statusFilterOptions: [
          { key: 'status', value: '0', text: '待处理' },
          { key: 'status', value: '1', text: '已处理' }
        ],
        // 用于程序修改选项卡内容
        tabItems: [
          { key: 'time', value: 'desc', text: '时间倒序' },
          { key: 'status', value: '0', text: '待处理' }
        ],
        // 选中项的值
        selectedItem: {}
      };
    },
    methods: {
      onExpand(selectedItem) {
        this.selectedItem = selectedItem;
      },
      isSelected(optionItem, selectedItem) {
        return (
          optionItem.key == selectedItem.key &&
          optionItem.value == selectedItem.value
        );
      },
      selectOrder(newItem) {
        this.selectedItem = newItem;
        console.log('选择了', JSON.stringify(newItem));
        const index = this.tabItems.findIndex(item => item.key == newItem.key);
        this.tabItems[index] = newItem;
        this.tabItems = [...this.tabItems];
        this.$refs.fdd.onUnexpand();
      },
    },
    template: `
      <div>
        <h4>这里是头部</h4>
        <FilterDropdown :tabItems="tabItems" @expand="onExpand" ref="fdd">
          <List slot="slot-time">
            <ListItem 
              v-for="(item, i) in timeFilterOptions" 
              :key="i"
              @click="selectOrder(item)"
            >
              {{item.text}}
              <IconSvg 
                v-show="isSelected(item, selectedItem)"
                cdn="//at.alicdn.com/t/font_1001796_k890pb7yti.js" 
                icon="icon-dangougouxuan"
              />
            </ListItem>
          </List>
          <List slot="slot-status">
          <ListItem 
            v-for="(item, i) in statusFilterOptions" 
            :key="i"
            @click="selectOrder(item)"
          >
            {{item.text}}
            <IconSvg 
              v-show="isSelected(item, selectedItem)"
              cdn="//at.alicdn.com/t/font_1001796_k890pb7yti.js" 
              icon="icon-dangougouxuan"
            />
          </ListItem>
          </List>
        </FilterDropdown>
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
