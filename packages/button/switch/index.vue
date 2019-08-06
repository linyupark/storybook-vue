<style lang="scss" scoped>
  .switch {
    position: relative;
    display: inline-block;
    vertical-align: middle;

    &.disabled {
      opacity: 0.8;
    }

    .roundball {
      background: #fff;
      border: $hairline solid #f5f5f5;
      border-radius: 50%;
      position: absolute;
      left: 1px;
      top: 1px;
      transition: transform 0.3s;
    }
  }
</style>

<template>
  <!-- 滑动开关 -->
  <div
    class="switch"
    :class="{
      disabled
    }"
    :style="{ 
      backgroundColor: stateChecked ? color : '#C7C7C7',
      width: `${w / 750 * 100}vw`,
      height: `${h / 750 * 100}vw`,
      borderRadius: `${h / 2 / 750 * 100}vw`
    }"
    @click="onCheck"
  >
    <div
      :style="{
          transform: stateChecked ? `translateX(${(w - h) / 750 * 100}vw)` : 'none',
          width: `${(h - 8) / 750 * 100}vw`,
          height: `${(h - 8) / 750 * 100}vw`
        }"
      class="roundball"
    />
  </div>
</template>

<script>
  // import useBoolean from "@crh/vue/functions/useBoolean";
  export default {
    name: 'ButtonSwitch',
    components: {},
    props: {
      /** 禁用开关 */
      disabled: {
        type: Boolean,
        default: false
      },
      /** 是否选中 */
      checked: {
        type: Boolean,
        default: false
      },
      /** 宽度 */
      w: {
        type: Number,
        default: 80
      },
      /** 高度 */
      h: {
        type: Number,
        default: 48
      },
      /** 背景颜色 */
      color: {
        type: String,
        default: "#4C98FC"
      }
    },
    data() {
      return {
        stateChecked: this.$props.checked,
      };
    },
    methods: {
      onCheck() {
        if (this.disabled) {
          return;
        }
        this.stateChecked = !this.checked;
        /**
         * 选中状态改变
         * @type {Event} change
         */
        this.$emit('change', this.stateChecked);
      }
    },
    // computed: {},
    // mounted() {}
    // name: '', watch: {}, mixins: [], filters: {}, directives: {},
    // beforeCreate() {}, created() {}, beforeMount() {}, beforeUpdate() {}, updated() {}, activated() {}, deactivated() {}, beforeDestroy() {}, destroyed() {},
  };
</script>