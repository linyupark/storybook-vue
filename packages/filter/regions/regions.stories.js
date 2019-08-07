import { storiesOf } from '@storybook/vue';
import { text, select, boolean, number, array } from '@storybook/addon-knobs';

import RegionsCity from "./city";

storiesOf('元素|Filter', module).add(
  'RegionsCity',
  () => ({
    components: {
      RegionsCity
    },
    props: {},
    data() {
      return {
      };
    },
    methods: {
    },
    template: `
      <div>
        <h4>城市过滤</h4>
        <RegionsCity />
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
