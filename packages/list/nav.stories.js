import { storiesOf } from '@storybook/vue';
import { select, object } from '@storybook/addon-knobs';

import List from './index';
import ListItem from './item';
import ListNav from "./nav";

storiesOf('元素|List', module).add(
  'Nav',
  () => ({
    components: {
      List,
      ListItem,
      ListNav
    },
    props: {
      inlineStyles: {
        type: Object,
        default: object('inlineStyles: 内联样式', {
          width: '85%'
        })
      },
      slotSpaceStyles: {
        type: Object,
        default: object('slotSpaceStyles: 列表顶部自定义样式', {
          height: `${(60 / 750) * 100}vw`,
          background: '#f5f5f5'
        })
      }
    },
    methods: {
    },
    data() {
      return {
        keys: ['A', 'B', 'C', 'D', 'E'],
        items: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      }
    },
    mounted() {

    },
    template: `
      <div>
        <h4>列表导航关键字</h4>
        <div class="container" 
          style="
            height: 89vh; 
            overflow-y: auto; 
            overflow-x: hidden
          "
        >
          <ListNav :keywords="keys" scroller=".container">
            <List v-for="(key) in keys" :key="key" :slotSpaceStyles="slotSpaceStyles">
              <div class="totoalCount" slot="space" :id="\`list-nav-\${key}\`">
                {{key}}
              </div>
              <ListItem 
                v-for="(item) in items" 
                :key="item" 
                short="right" 
                :inlineStyles="inlineStyles"
              >
                <div class="label">{{key}}</div>
                <div>{{item}}</div>
              </ListItem>
            </List>
          </ListNav>
        </div>
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
