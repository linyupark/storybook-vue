import { storiesOf } from '@storybook/vue';
import { text, select, boolean } from '@storybook/addon-knobs';
import ButtonBase from './index';
import IconSvg from '@crh/Vue/Icon/svg';

storiesOf('ELEMENT|Button', module).add(
  'Base',
  () => ({
    components: {
      ButtonBase,
      IconSvg
    },
    props: {
      text: {
        type: String,
        default: text('slot: default', '提交')
      },
      loading: {
        type: String,
        default: text('slot: loading', '加载中')
      },
      hideText: {
        type: Boolean,
        default: boolean('hideText: 加载状态隐藏按钮内容?', true)
      },
      theme: {
        type: String,
        default: select('theme: 主题', ['zyb'], 'zyb')
      },
      size: {
        type: String,
        default: select('size: 尺寸', ['l', 'm', 's'], 'l')
      },
      type: {
        type: String,
        default: select('type: 类型', ['', 'primary', 'warn', 'error'], '')
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
        <h4>常规</h4>
        <ButtonBase
          :hideText="hideText" 
          :type="type" 
          :theme="theme" 
          :size="size" 
          @click="onSubmit($event, '按钮1')"
        >
          <span slot="loading" v-html="loading"></span>
          {{text}}
        </ButtonBase>
        <h4>加载带动画icon</h4>
        <ButtonBase
          size="m"
          @click="onSubmit($event, '按钮2')"
        >
          <IconSvg 
            slot="loading" cdn="//at.alicdn.com/t/font_1001796_k890pb7yti.js" 
            icon="icon-shuaxin"
            color="#3E86F7"
            :rotate="1"
          />
          &nbsp;
          {{text}}
        </ButtonBase>
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
