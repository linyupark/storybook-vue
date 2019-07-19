/**
 * 使用倒计时
 * @param {Number} startNumber 开始数字
 * @param {Boolean|String} sessName 暂存数字的session名，false则不使用
 */
export default function(startNumber = 10, sessName = false) {
  if (sessName) {
    startNumber = Number(sessionStorage.getItem(sessName)) || startNumber;
  }

  return {
    num: startNumber,

    /**
     * 减少数
     * @param {Number} min 最小不能小于
     * @param {Number} step 减少幅度
     */
    down(min = 0, step = 1) {
      if (startNumber > min) {
        startNumber -= step;
        this.num = startNumber;
      }
      if (startNumber <= min) {
        this.onStop(startNumber);
      }
    },

    /**
     * 触发停止对应操作
     */
    onStop: () => {}
  };
}
