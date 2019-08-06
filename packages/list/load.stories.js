import { storiesOf } from '@storybook/vue';
import { select, object } from '@storybook/addon-knobs';

import List from './index';
import ListItem from './item';
import LoadByScroll from './loadByScroll';
import IconSvg from '@crh/vue/icon/svg';

storiesOf('元素|List', module).add(
  'loadByScroll',
  () => ({
    components: {
      List,
      ListItem,
      LoadByScroll,
      IconSvg
    },
    props: {},
    methods: {
      onLoadMore(loadingHandler) {
        if (!this.$pages) this.$pages = 1;
        if (this.$pages == 2) {
          // 没有更多
          this.noMore = true;
          return;
        }
        console.log('加载更多', this.$pages);
        setTimeout(() => {
          this.resultList = this.resultList.concat(this.resultList);
          loadingHandler.set(false);
          this.$pages += 1;
        }, 1000);
      }
    },
    data() {
      return {
        resultList: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        noMore: false,
      }
    },
    template: `
      <div>
        <h4>列表带加载更多</h4>
        <div class="container" style="height: 89vh; overflow-y: auto; overflow-x: hidden">
          <List>
            <ListItem v-for="(item, i) in resultList" :key="i">
              内容({{i}})
            </ListItem>
            <LoadByScroll :noMore="noMore" container=".container" @load="onLoadMore">
              <div slot="loading" 
                style="
                  display: flex; 
                  height: 50px; 
                  align-items: center; 
                  justify-content: center;
                  color: #999;
                ">
                <IconSvg 
                  cdn="//at.alicdn.com/t/font_1001796_k890pb7yti.js" 
                  icon="icon-shuaxin"
                  :rotate="1" 
                />&nbsp;loading
              </div>
              <div slot="noMore"
              style="
                display: flex; 
                height: 50px; 
                align-items: center; 
                justify-content: center;
                color: #999;
                font-size: 14px;
              ">
                我是有底线的
              </div>
            </LoadByScroll>
          </List>
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
