import { storiesOf } from '@storybook/vue';
import { select, object, array, text, boolean, number } from '@storybook/addon-knobs';

import InputLimitText from './text';
import ButtonBase from "@crh/vue/button/base";

storiesOf('元素|Input', module).add(
  'LimitText',
  () => ({
    components: {
      InputLimitText,
      ButtonBase
    },
    props: {
      /** 默认内容 */
      value: {
        type: String,
        default: text("value: 默认内容", "")
      },
      /** 内容过滤正则 */
      filterReg: {
        type: String,
        default: text("filterReg: 内容过滤正则", '')
      },
      /** 最大长度 */
      max: {
        type: Number,
        default: number("max: 最大长度", 120)
      },
      /** placeholder 提示信息 */
      placeholder: {
        type: String,
        default: text("placeholder:", "输入内容")
      },
      /** 容器样式微调 */
      wrapperInlineStyles: {
        type: Object,
        default: () => ({})
      },
      /** 文本框样式微调 */
      textareaInlineStyles: {
        type: Object,
        default: () => ({})
      }
    },
    methods: {
      onInput(value) {
        console.log(`内容: ${value}`);
      },
      onSubmit(done) {
        console.log('提交了', this.$refs.textarea.getContent());
        done();
      }
    },
    data() {
      return {
      }
    },
    mounted() {
    },
    template: `
      <div>
        <h4>输入文本限制长度</h4>
        <div style="height: 90.5vh; background: #f5f5f5">
          <br />
          <InputLimitText 
            ref="textarea"
            @input="onInput" 
            :value="value" 
            :filterReg="filterReg"
            :max="max"
            :placeholder="placeholder"
            :wrapperInlineStyles="{
              height: '42.66vw'
            }"
          ></InputLimitText>
          <br />
          <ButtonBase type="primary" @click="onSubmit">
            查看内容
          </ButtonBase>
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
