/**
 * 设置页面dpr属性
 * @param {Number} defaultDpr 如果无法获取到设备dpr默认值
 */
export default function(defaultDpr=2) {
  const dpr = window.devicePixelRatio || defaultDpr;
  document.documentElement.setAttribute('data-dpr', dpr);
}