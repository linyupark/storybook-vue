const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  /** 故事源文件 */
  config.module.rules.push({
    test: /\.stories\.jsx?$/,
    loaders: [require.resolve('@storybook/addon-storysource/loader')],
    enforce: 'pre'
  });

  /** 加入 scss 支持 */
  config.module.rules.push({
    test: /\.scss$/,
    include: path.resolve(__dirname, '../packages'),
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2
        }
      },
      {
        loader: 'postcss-loader'
      },
      {
        loader: 'sass-loader'
        // options: {
        //   data: `
        //     @import "~@/Themes/var.scss";
        //   `
        // }
      }
    ]
  });

  /** 加入路径别名 */
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, '../packages'),
    '~': path.resolve(__dirname, '../packages')
  };

  /** vue 文件内容解析 */
  config.module.rules.push({
    test: /\.vue$/,
    loader: 'storybook-addon-vue-info/loader',
    options: {
      docgenOptions: {
        alias: config.resolve.alias
      }
    },
    enforce: 'post'
  });

  /** 不需要调试 */
  config.devtool = false;

  /** 不需要报错提示 */
  config.devServer = { stats: 'errors-only', compress: true };

  // Return the altered config
  return config;
};
