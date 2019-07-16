import { storiesOf } from '@storybook/vue';
import { text } from '@storybook/addon-knobs';
import ButtonLoading from './index';

storiesOf('ELEMENT|Button', module).add(
  'Base',
  () => ({
    components: {
      ButtonLoading
    },
    props: {
      text: {
        type: String,
        default: text('按钮内容', '提交')
      }
    },
    methods: {
      onSubmit(done, text) {
        console.log('开始loading', text);
        setTimeout(() => {
          // 模拟 ajax 请求 1秒 后解除 loading 状态
          done();
          console.log('通过执行函数带来的方法，结束loading');
        }, 1000);
      }
    },
    template: `
      <div>
        <p><button-loading @click="onSubmit($event, '按钮1')">{{text}}</button-loading></p>
        <p><button-loading size="m" @click="onSubmit($event, '按钮2')">{{text}}</button-loading></p>
        <p><button-loading size="s" @click="onSubmit($event, '按钮3')">{{text}}</button-loading></p>
        <p><button-loading type="primary" @click="onSubmit($event, '按钮4')">{{text}}</button-loading></p>
      </div>
    `
  }),
  {
    info: true
  }
);
