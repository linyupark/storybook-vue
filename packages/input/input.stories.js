import { storiesOf } from '@storybook/vue';
import { text, select, boolean, number, array } from '@storybook/addon-knobs';

import InputBase from './base/index';
import InputSearch from './search/index';

storiesOf('元素|Input', module).add(
  'Base',
  () => ({
    components: {
      InputBase,
      InputSearch
    },
    props: {
      /** 输入框类型 */
      type: {
        type: String,
        default: text('type: 输入框类型', 'text')
      },
      /** 一键清除按钮 */
      useClear: {
        type: Boolean,
        default: boolean('useClear: 一键清除按钮', true)
      },
      /** 设置默认显示数据 */
      value: {
        type: String,
        default: text('value: 设置默认显示数据', '')
      },
      /** 帮助提示信息 */
      placeholder: {
        type: String,
        default: text('placeholder: 帮助提示信息', '请输入')
      },
      /** 最大输入长度 */
      max: {
        type: Number,
        default: number('max: 最大输入长度', 25)
      },
      /** 自动聚焦 */
      autoFocus: {
        type: Boolean,
        default: boolean('autoFocus: 自动聚焦', false)
      },
    },
    data() {
      return {}
    },
    methods: {
    },
    template: `
      <div>
        <h4>基础输入框</h4>
        <InputBase 
          :type="type"
          :useClear="useClear"
          :value="value"
          :max="max"
          :placeholder="placeholder" 
          :autoFocus="autoFocus"
        />
        <h4>搜索框</h4>
        <InputSearch placeholder="搜索机构/股东/联系人" :value="value" />
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
