module.exports = {
  plugins: {
    'postcss-preset-env': {},
    'postcss-pxtorem': {
      rootValue: 75,
      unitPrecision: 2,
      propWhiteList: ['*'],
      selectorBlackList: ['.no-rem'],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    }
  }
};
