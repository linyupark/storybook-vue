import { load, addDecorator, addParameters } from '@storybook/vue';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo, setDefaults } from 'storybook-addon-vue-info';
import '@storybook/addon-console';
import theme from './theme';

addDecorator(withA11y);
addDecorator(withKnobs);
addDecorator(withInfo);
setDefaults({
  header: false
});
addParameters({
  viewport: { defaultViewport: 'iphone6' },
  options: {
    theme
  }
});

load(require.context('../packages', true, /\.stories\.js$/), module);
