import { storiesOf } from '@storybook/vue';
import { text, select, boolean, number } from '@storybook/addon-knobs';
import ButtonBase from './index';
import IconSvg from '@crh/vue/icon/svg';
import ButtonCountdown from './countdown';

storiesOf('基础元素|Button', module)
  .add(
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
          @click="onSubmit($event, '按钮3')"
        >
          <IconSvg 
            slot="loading" cdn="//at.alicdn.com/t/font_1001796_k890pb7yti.js" 
            icon="icon-shuaxin"
            color="#3E86F7"
            :rotate="1"
          />&nbsp;{{text}}
        </ButtonBase>

        <h4>默认开启loading</h4>
        <ButtonBase
          type="primary"
          size="s"
          loading
          @click="onSubmit($event, '按钮3')"
          :inlineStyles="{ height: '${99/750 * 100}vw' }"
        >
          <span slot="loading">loading...</span>
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
  )

  /** 扩展：倒计时按钮 */
  .add(
    'Countdown',
    () => ({
      components: {
        ButtonCountdown
      },
      props: {
        /** 起始数字 */
        startNumber: {
          type: Number,
          default: number('startNumber: 起始数字', 5)
        },
        /** 页面刷新也要保持倒计时 */
        holdon: {
          type: Boolean | String,
          default: boolean('holdon: 页面刷新也要保持倒计时', true)
        },
        /** 自动开始倒计时 */
        autoStart: {
          type: Boolean,
          default: boolean('autoStart: 自动开始倒计时', true)
        },
        /** 后续点击可以循环倒计时 */
        loop: {
          type: Boolean,
          default: boolean('loop: 后续点击可以循环倒计时', true),
        },
        /** 替换成倒计时数字的模板 */
        replacer: {
          type: String,
          default: text('replacer: 替换成倒计时数字的模板', "{[num]}")
        }
      },
      methods: {
        onClick(stop) {
          // stop(true);
        }
      },
      template: `
        <div>
          <h4>扩展：倒计时</h4>
          <ButtonCountdown 
            :startNumber="startNumber" 
            :holdon="holdon === true ? '@crh/vue/button/countdown': false"
            :autoStart="autoStart"
            :loop="loop"
            @click="onClick"
          >
            <span slot="left">开始阅读</span>
            <span slot="loading">({{replacer}}秒)</span>
          </ButtonCountdown>
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
