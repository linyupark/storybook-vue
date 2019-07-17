import { storiesOf } from '@storybook/vue';
import { text, number } from '@storybook/addon-knobs';
import IconSvg from './index';

storiesOf('ELEMENT|Icon', module).add(
  'Svg',
  () => ({
    components: {
      IconSvg
    },
    props: {
      /** 如果直接引入 cdn 图标可以填入 */
      cdn: {
        type: String,
        default: text('cdn: 外部引入(可选)', '//at.alicdn.com/t/font_1001796_k890pb7yti.js')
      },
      /** 图标名称 */
      icon: {
        type: String,
        default: text('icon: 图标名称', 'icon-shuaxin')
      },
      /** 图标颜色 */
      color: {
        type: String,
        default: text('color: 图标颜色', 'currentColor')
      },
      /** 图标大小 单位: em */
      size: {
        type: Number,
        default: number('size: 图标大小', 2)
      },
      /** 是否需要旋转, 0: 不旋转, 数字越大速度越快 */
      rotate: {
        type: Number,
        default: number('rotate: 旋转速度', 1)
      }
    },
    methods: {
    },
    template: `
      <IconSvg
        :size="size" 
        :cdn="cdn" 
        :icon="icon" 
        :color="color" 
        :rotate="rotate"
      >
      </IconSvg>
    `
  }),
  {
    info: true,
    knobs: {}
  }
);
