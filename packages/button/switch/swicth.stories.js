import { storiesOf } from '@storybook/vue';
import { text, select, boolean, number } from '@storybook/addon-knobs';
import ButtonSwitch from './index';

storiesOf('元素|Button', module)
  .add(
    'Switch',
    () => ({
      components: {
        ButtonSwitch,
      },
      props: {
        /** 禁用开关 */
        disabled: {
          type: Boolean,
          default: boolean('disabled: 禁用开关', false),
        },
        /** 是否选中 */
        checked: {
          type: Boolean,
          default: boolean('checked: 是否选中', false),
        },
        /** 宽度 */
        w: {
          type: Number,
          default: number('w: 宽度', 80),
        },
        /** 高度 */
        h: {
          type: Number,
          default: number('h: 高度', 48),
        },
        /** 背景颜色 */
        color: {
          type: String,
          default: text('color: 背景颜色', "#4C98FC")
        }
      },
      methods: {
        onChange(checked) {
          // 为了实现效果这里直接修改了props 警告请无视
          this.$props.checked = checked;
          console.log('选中状态', checked);
        }
      },
      template: `
      <div>
        <h4>滑动开关</h4>
        <center>
        <ButtonSwitch 
          :disabled="disabled"
          :checked="checked"
          :w="w"
          :h="h"
          @change="onChange"
        ></ButtonSwitch>
        </center>
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
