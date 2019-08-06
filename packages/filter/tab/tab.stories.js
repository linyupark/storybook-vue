import { storiesOf } from '@storybook/vue';
import { text, select, boolean, number } from '@storybook/addon-knobs';
import FilterTabSlide from './slide';

storiesOf('元素|Filter', module).add(
  'Tab',
  () => ({
    components: {
      FilterTabSlide
    },
    props: {
      /** 当前选中的tab index */
      index: {
        type: Number,
        default: number('index: 当前选中的tab index', 0)
      }
    },
    methods: {
      onChange(i) {
        console.log('切换到', i);
      }
    },
    template: `
      <div>
        <h4>滑动tab</h4>
        <FilterTabSlide :index="index" @change="onChange" :slideInlineStyles="{
          width: '20%',
          height: '2px'
        }">
          <div style="width: 50%; text-align: center">选项1</div>
          <div style="width: 50%; text-align: center">选项2</div>
        </FilterTabSlide>
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
