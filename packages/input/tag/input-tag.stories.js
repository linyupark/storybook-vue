import { storiesOf } from '@storybook/vue';
import { text, select, boolean, number, array } from '@storybook/addon-knobs';

import InputTag from './index';

storiesOf('元素|Input', module).add(
  'Tag',
  () => ({
    components: {
      InputTag,
    },
    props: {
      /** 默认选中的标签 */
      tagsAdded: {
        type: Array,
        default: array('tagsAdded: 默认选中的标签', ['融券差'])
      },
      /** 可选用的标签（我的标签，点击添加） */
      tagsOptions: {
        type: Array,
        default: array('tagsOptions: 可选用的标签（我的标签，点击添加）', ['股票质押回', '融券差'])
      },
      /** 可选标签的说明 */
      tagsOptionsLabel: {
        type: String,
        default: text('tagsOptionsLabel: 可选标签的说明', '我的标签')
      },
      /** 每个标签内容的最大长度 */
      max: {
        type: Number,
        default: number('max: 每个标签内容的最大长度', 30)
      },
      /** 输入框提示信息 */
      placeholder: {
        type: String,
        default: text('placeholder: 输入框提示信息', '请输入标签')
      }
    },
    data() {
      return {}
    },
    methods: {
    },
    template: `
      <div>
        <h4>标签管理</h4>
        <div style="background: #f5f5f5; height: 80vh; padding-top: 5vh">
          <InputTag 
            :tagsOptionsLabel="tagsOptionsLabel"
            :tagsOptions="tagsOptions" 
            :tagsAdded="tagsAdded" 
            :placeholder="placeholder"
            :max="max"
          />
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
