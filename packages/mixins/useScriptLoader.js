/**
 * 外部引入 script
 * @param {String} url js地址
 * @param {Boolean} async 是否使用无阻塞
 */
export default function(url, async = true) {
  let isExist = false;
  [...document.body.querySelectorAll('script')].map(script => {
    if (~script.src.search(url)) isExist = true;
  });
  if (isExist) return;
  let scriptEl = document.createElement('script');
  scriptEl.src = url;
  scriptEl.async = async;
  scriptEl.onerror = () => {
    console.error(`加载外部连接失败. url: ${url}`);
  };
  scriptEl.onload = () => {
    console.log('引入外部链接成功', url);
  };
  document.body.appendChild(scriptEl);
  return () => {
    document.body.removeChild(scriptEl);
  };
}
