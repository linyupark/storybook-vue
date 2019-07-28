<template>
  <!-- 列表内容单元 -->
  <div
    class="item-wrapper"
    @click="$emit('click')"
  >
    <div
      class="item"
      :class="short"
      :style="{
        ...inlineStyles
      }"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <!-- @slot 列表单元内容 -->
      <slot />
      <div
        class="slide"
        @click="onSlideClick"
        ref="slide"
      >
        <!-- @slot 滑动块展示内容 -->
        <slot name="slide" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .slide {
    position: absolute;
    left: 100%;
    top: 0;
    bottom: 0;
    transform: translateX(0);
  }
</style>

<script>
  import ListItem from "@crh/vue/list/item";
  export default {
    extends: ListItem,
    name: "ListItemSlide",
    components: {},
    props: {
      /** 是否允许兄弟列表一起展开多个滑块 */
      multi: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        slideIn: false
      };
    },
    methods: {
      onSlideClick() {
        this.$refs.slide.style = `translateX(0)`;
        /**
         * 滑动块点击
         * @type {Event} slideClicked
         */
        this.$emit("slideClicked", this);
      },
      onTouchStart(ev) {
        this.$refs.slide.style.transition = `none`;
        this.startPageX = ev.touches[0].pageX;
      },
      onTouchMove(ev) {
        this.movePageX = ev.touches[0].pageX;
        const touchLength = this.startPageX - this.movePageX;
        const slideWidth = this.$refs.slide.clientWidth;
        // 滑动范围不能超过slide自身宽度
        if (Math.abs(touchLength) < slideWidth) {
          const moveOffset = (this.slideIn ? -slideWidth : 0) - touchLength;
          if (touchLength > 0 && this.slideIn) return;
          if (touchLength < 0 && !this.slideIn) return;
          this.$refs.slide.style.transform = `translateX(${moveOffset}px)`;
        }
      },
      onTouchEnd() {
        const offsetX = Number(
          (this.$refs.slide.style.transform.match(/\((.+)px\)/) || [0, 0])[1]
        );
        this.slideIn = offsetX < -(Number(this.$refs.slide.clientWidth) / 2);
        this.$refs.slide.style.transition = `transform 0.3s`;
        if (this.slideIn) {
          this.$refs.slide.style.transform = `translateX(${-this.$refs.slide
            .clientWidth}px)`;
          this.closeSiblings();
          /**
           * 滑动块状态改变：划入/划出 { status: 'in/out'}
           * @type {Event} slideStatusChanged
           */
          this.$emit("slideStatusChanged", { status: "in" });
        } else {
          this.$refs.slide.style.transform = `translateX(0)`;
          this.$emit("slideStatusChanged", { status: "out" });
        }
      },
      closeSiblings() {
        if (!this.slideIn && this.multi) return;
        this.$parent.$children.map(vm => {
          if (
            vm._uid !== this._uid &&
            vm.$options.name === this.$options.name &&
            !vm.$props.multi
          ) {
            vm.$data.slideIn = false;
            vm.$refs.slide.style.transform = `translateX(0)`;
          }
        });
      }
    },
    computed: {},
    mounted() {
    }
  };
</script>
