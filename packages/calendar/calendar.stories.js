import { storiesOf } from '@storybook/vue';
import { text, select, boolean, number } from '@storybook/addon-knobs';
import CalendarBase from '@crh/vue/calendar/base';

storiesOf('元素|Calendar', module).add(
  'Base',
  () => ({
    components: {
      CalendarBase
    },
    props: {},
    methods: {
      clickDay(data) {
        console.log(data); //选中某天
      },
      changeDate(data) {
        console.log(data); //左右点击切换月份
      },
      clickToday(data) {
        // console.log(data); // 跳到了本月
      }
    },
    template: `
      <div>
        <h4>基础日历</h4>
        <CalendarBase
          :markDateMore="[
            {date: '2019/08/12', className: 'blue'},
            {date: '2019/08/14', className: 'grey'},
            {date: '2019/08/1', className: 'pink'}
          ]"
          @choseDay="clickDay"
          @changeMonth="changeDate"
          @isToday="clickToday"
        ></CalendarBase>
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
