import { storiesOf } from '@storybook/vue';
import { text, select, boolean, number, array } from '@storybook/addon-knobs';

import FilterDropdown from './index';
import List from '@crh/vue/list';
import ListItem from '@crh/vue/list/item';
import IconSvg from '@crh/vue/icon/svg';
import FilterTags from '@crh/vue/filter/tags';

storiesOf('元素|Filter', module).add(
  'Dropdown',
  () => ({
    components: {
      FilterDropdown,
      FilterTags,
      List,
      ListItem,
      IconSvg
    },
    props: {},
    data() {
      return {
        // 用于程序修改选项卡内容
        tabItems: [
          { name: 'order_by', key: '0', text: '时间倒序' },
          { name: 'action_type', text: '行为筛选', tags: {} }
        ],
        // 时间排序
        orderByFilterOptions: [
          { name: 'order_by', key: '0', text: '时间倒序' },
          { name: 'order_by', key: '1', text: '时间顺序' }
        ],
        // 行为筛选
        actionTypeFilterOptions: [
          {
            name: 'action_type',
            label: '行为标签（可多选）',
            multi: true,
            tags: [
              { key: '0', text: '客户流失' },
              { key: '1', text: '购买理财' }
            ]
          },
          {
            name: 'area',
            label: '所在地区',
            multi: false,
            tags: [
              { key: 'hz', text: '杭州' },
              { key: 'sh', text: '上海' },
              { key: 'bj', text: '北京' },
              { key: 'gz', text: '广州' },
            ]
          }
        ]
      };
    },
    methods: {
      onExpand(tabItem) {
        if (tabItem.name === 'action_type') {
          // 避免选择了标签没有点确定再打开会选中之前的tag
          this.$refs.filterTags.initSelectedItems();
        }
      },

      isSelected(optionItem, selectedItem) {
        // console.log(optionItem, selectedItem);
        return (
          optionItem.name == selectedItem.name &&
          optionItem.key == selectedItem.key
        );
      },

      onOrderBtConfirm(newItem) {
        this.selectedItem = newItem;
        console.log('时间排序选择了', JSON.stringify(newItem));
        this.tabItems[0] = newItem;
        this.tabItems = [...this.tabItems];
        this.$refs.fdd.onUnexpand();
      },

      /** 当行为筛选确定 */
      onActionTypeConfirm(tags) {
        console.log('行为筛选选择了', JSON.stringify(tags));
        this.tabItems[1].tags = tags;
        let num = 0;
        for (let k in tags) {
          num += tags[k].length;
        }
        if (num === 0) {
          this.tabItems[1].text = '行为筛选';
        } else {
          this.tabItems[1].text = `行为筛选(${num})`;
        }
        this.tabItems = [...this.tabItems];
        this.$refs.fdd.onUnexpand();
      }
    },
    template: `
      <div style="height: 200vh">
        <h4>这里是头部</h4>
        <!-- 列表过滤 -->
        <FilterDropdown
          @expand="onExpand"
          :tabItems="tabItems"
          ref="fdd"
        >
          <!-- 时间正倒排序 -->
          <List slot="slot-order_by">
            <ListItem
              v-for="(item, i) in orderByFilterOptions"
              :key="i"
              @click="onOrderBtConfirm(item)"
            >
              <span class="order-text">{{item.text}}</span>
              <IconSvg 
                v-show="isSelected(item, tabItems[0])"
                cdn="//at.alicdn.com/t/font_1001796_k890pb7yti.js" 
                icon="icon-dangougouxuan"
              />
            </ListItem>
          </List>

          <!-- 行为筛选 -->
          <FilterTags
            slot="slot-action_type"
            :items="actionTypeFilterOptions"
            @confirm="onActionTypeConfirm"
            :selectedItems="tabItems[1].tags"
            ref="filterTags"
          >
          </FilterTags>
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
