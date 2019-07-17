/**
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
*/

export default function(baseSize = 75, maxWidth = 750) {
  // 设置 rem 函数
  function enable() {
    const scale = document.documentElement.clientWidth / maxWidth;
    // 设置页面根节点字体大小
    document.documentElement.style.fontSize =
      baseSize * Math.min(scale, 2) + 'px';
  }

  function onPageShow(event) {
    if (event.persisted) {
      setTimeout(function() {
        enableRem();
      }, 10);
    }
  }

  // 改变窗口大小时重新设置 rem
  window.addEventListener('resize', enable, false);
  window.addEventListener('pageShow', onPageShow, false);

  // 禁用
  function disable() {
    document.documentElement.removeAttribute('font-size');
    window.removeEventListener('resize', enable, false);
    window.removeEventListener('pageShow', onPageShow, false);
  }

  return {
    enable,
    disable
  };
}
