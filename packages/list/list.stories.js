import { storiesOf } from '@storybook/vue';
import { select, object } from '@storybook/addon-knobs';

import List from './index';
import ListItem from './item';
import IconSvg from '@crh/vue/icon/svg';

storiesOf('元素|List', module).add(
  'Base',
  () => ({
    components: {
      List,
      ListItem,
      IconSvg
    },
    props: {
      short: {
        type: String,
        default: select('short: 哪边缩进', ["", "left", "right", "both"], "")
      },
      inlineStyles: {
        type: Object,
        default: object('inlineStyles: 内联样式', {})
      },
      slotSpaceStyles: {
        type: Object,
        default: object('slotSpaceStyles: 列表顶部自定义样式', {
          height: `${60/750*100}vw`,
          background: '#f5f5f5'
        })
      }
    },
    methods: {},
    template: `
      <div>
        <h4>普通列表</h4>
        <List>
          <ListItem :short="short" :inlineStyles="inlineStyles">
            <div class="label">查看详情</div>
            <IconSvg 
              cdn="//at.alicdn.com/t/font_1001796_k890pb7yti.js" 
              icon="icon-jinru"
            />
          </ListItem>
        </List>
        <h4>列表空隙样式</h4>
        <List :slotSpaceStyles="slotSpaceStyles">
          <div class="totoalCount" slot="space">
            共1条记录
          </div>
          <ListItem :short="short" :inlineStyles="inlineStyles">
            <div class="label">查看详情</div>
            <IconSvg 
              cdn="//at.alicdn.com/t/font_1001796_k890pb7yti.js" 
              icon="icon-jinru"
            />
          </ListItem>
        </List>
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
