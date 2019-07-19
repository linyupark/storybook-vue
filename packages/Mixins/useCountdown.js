/**
 * 使用倒计时
 * @param {Number} startNumber 开始数字
 * @param {Boolean|String} sessName 暂存数字的session名，false则不使用
 */
export default function(startNumber = 10, sessName = false) {

  return {
    num: 0,

    /**
     * 减少数
     * @param {Number} min 最小不能小于
     * @param {Number} step 减少幅度
     */
    down(min = 0, step = 1) {
      if (this.num > min) {
        this.num -= step;
        sessName && sessionStorage.setItem(sessName, this.num);
      }
      if (this.num <= min) {
        this.onStop(this.num);
        // 清除记录
        if (sessName) {
          sessionStorage.removeItem(sessName);
        }
      }
    },

    /**
     * 触发停止对应操作
     */
    onStop() {},

    /** 触发继续倒计时 */
    onContinue() {},

    /** 初始化 */
    init() {
      this.num = startNumber;
      if (sessName) {
        this.num = Number(sessionStorage.getItem(sessName)) || startNumber;
        sessionStorage.setItem(sessName, this.num);
      }
      if (this.num != startNumber) this.onContinue();
    }
  };
  
}
