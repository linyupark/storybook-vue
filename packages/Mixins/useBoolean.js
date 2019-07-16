export default function(stateName, initValue = false) {
  if (!stateName) throw new Error('stateName 不能为空');
  return {
    value: initValue,
    set(newValue) {
      this.value = !!newValue;
    },
    reset() {
      this.value = initValue;
    },
    toggle() {
      this.value = !this.value;
    }
  };
}
