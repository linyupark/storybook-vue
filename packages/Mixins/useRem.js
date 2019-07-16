export default function(baseSize = 75, maxWidth = 750) {
  // 设置 rem 函数
  function enableRem() {
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
  window.addEventListener('resize', enableRem, false);
  window.addEventListener('pageShow', onPageShow, false);

  // 禁用
  function disableRem() {
    document.documentElement.removeAttribute('font-size');
    window.removeEventListener('resize', enableRem, false);
    window.removeEventListener('pageShow', onPageShow, false);
  }

  return {
    enableRem,
    disableRem
  };
}
