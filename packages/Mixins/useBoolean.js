export default function(initValue = false) {
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
