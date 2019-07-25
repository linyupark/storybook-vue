import { storiesOf } from '@storybook/vue';
import { text, select, boolean, number, array } from '@storybook/addon-knobs';

import Toast from './index';
import IconSvg from '@crh/vue/icon/svg';

storiesOf('反馈|Toast', module).add(
  'Base',
  () => ({
    components: {
      Toast,
      IconSvg
    },
    props: {},
    data() {
      return {};
    },
    methods: {
      openToast() {
        Toast.show('你好，这条消息来自Toast', {
          onClose() {
            console.log('信息消失了');
          },
          duration: 3000,
          inlineStyles: {
            position: 'absolute',
            top: `${(400 / 750) * 100}vw`
          }
        });
      },
      closeByClick() {
        const myToast = Toast.show(
          [
            this.$createElement(IconSvg, {
              props: {
                cdn: '//at.alicdn.com/t/font_1001796_k890pb7yti.js',
                icon: 'icon-shuaxin',
                rotate: 1,
                color: '#fff'
              }
            }),
            this.$createElement('span', ' hello '),
            this.$createElement(
              'span',
              {
                on: {
                  click() {
                    myToast.close();
                  }
                }
              },
              [
                this.$createElement(IconSvg, {
                  props: {
                    icon: 'icon-guanbi',
                    color: '#fff'
                  }
                })
              ]
            )
          ],
          {
            duration: 0
          }
        );
      }
    },
    template: `
      <div>
        <h4>Toast.show 唤起微调位置</h4>
        <center><button @click="openToast">弹出</button></center>
        <h4>手动关闭</h4>
        <center><button @click="closeByClick">弹出</button></center>
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
