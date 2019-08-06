import { storiesOf } from '@storybook/vue';
import { select, object } from '@storybook/addon-knobs';

import List from './index';
import ListItem from './item';
import LoadByScroll from './loadByScroll';
import Refresh from "./refresh";
import IconSvg from '@crh/vue/icon/svg';

storiesOf('元素|List', module).add(
  'loadByScroll',
  () => ({
    components: {
      List,
      ListItem,
      LoadByScroll,
      Refresh,
      IconSvg
    },
    props: {},
    methods: {
      onLoadMore(reset) {
        if (!this.$pages) this.$pages = 1;
        if (this.$pages == 2) {
          // 没有更多
          this.noMore = true;
          return;
        }
        setTimeout(() => {
          console.log('加载更多');
          this.resultList = this.resultList.concat(this.resultList);
          reset();
          this.$pages += 1;
        }, 1000);
      },
      onRefresh(reset) {
        console.log('刷新');
        setTimeout(() => {
          this.$pages = 1;
          this.resultList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
          reset();
          this.noMore = false;
        }, 1000);
      }
    },
    data() {
      return {
        resultList: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        noMore: false,
      }
    },
    mounted() {

    },
    template: `
      <div>
        <h4>列表 加载更多 + 下拉刷新</h4>
        <div class="container" 
          style="
            height: 89vh; 
            overflow-y: auto; 
            overflow-x: hidden
          "
        >
          <Refresh 
            container=".container" 
            @refresh="onRefresh" 
            :refreshOnLoad="true" 
          />
          <List>
            <ListItem v-for="(item, i) in resultList" :key="i">
              内容({{i}})
            </ListItem>
            <LoadByScroll 
              :noMore="noMore" 
              container=".container" 
              @load="onLoadMore"
            >
              <div slot="loading" 
                style="
                  display: flex; 
                  height: 50px; 
                  align-items: center; 
                  justify-content: center;
                  color: #999;
                ">
                <IconSvg 
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
