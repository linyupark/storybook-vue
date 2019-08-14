<template>
  <!-- 仿微信标签管理 -->
  <div class="input-tag-container">
    <form
      action=""
      @submit="onSubmit"
      @click="onFormTap"
      class="input-tag"
    >
      <div
        v-for="(tag, i) in stateTagsAdded"
        :key="i"
        class="tag"
        @click="removeTag(tag)"
      >
        {{tag}}
      </div>
      <input
        type="text"
        class="input"
        ref="input"
        :placeholder="placeholder"
        @keydown="onKeydown"
        @keyup="onKeyup"
        :maxlength="max"
        :style="{
          width: inputWidth()
        }"
      >
      <span
        class="shadow"
        ref="shadowText"
      >
        {{shadowText}}
      </span>
    </form>

    <!-- 备选标签列表 -->
    <div
      class="options"
      v-show="tagsOptions.length > 0"
    >
      <label>{{tagsOptionsLabel}}</label>
      <div class="tags">
        <div
          v-for="(tag, i) in tagsOptions"
          :key="i"
          class="tag"
          @click="addTag(tag)"
          :class="{
            active: ~stateTagsAdded.indexOf(tag)
          }"
        >
          {{tag}}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .input-tag {
    padding: px2vw(10) px2vw(30);
    background: #fff;
    position: relative;
    min-height: px2vw(68);
    display: flex;
    flex-wrap: wrap;

    .tag {
      font-size: px2vw(26);
      color: #fff;
      height: px2vw(58);
      display: flex;
      align-items: center;
      background: #3985fc;
      padding: 0 px2vw(20);
      border-radius: px2vw(29);
      margin: px2vw(5) px2vw(18) px2vw(5) 0;
    }

    .input {
      font-size: px2vw(32);
      outline: none;
      border: $hairline dashed #fff;
      min-width: px2vw(160);

      &::placeholder {
        color: #bfbfbf;
      }

      &.active {
        border-color: #fff;
      }
    }

    .shadow {
      visibility: hidden;
      z-index: -1;
      position: absolute;
      max-width: px2vw(690);
      overflow: hidden;
      left: 0;
      top: 0;
    }
  }

  .options {
    padding: px2vw(20) px2vw(30) 0 px2vw(30);
    label {
      color: #595959;
      font-size: px2vw(26);
    }
    .tag {
      margin: px2vw(20) px2vw(12) 0 0;
      font-size: px2vw(26);
      color: #595959;
      height: px2vw(58);
      display: inline-flex;
      align-items: center;
      padding: 0 px2vw(20);
      border-radius: px2vw(29);
      border: $hairline solid #595959;

      &.active {
        background: #3985fc;
        color: #fff;
        border-color: #3985fc;
      }
    }
  }
</style>

<script>
  export default {
    name: "InputTags",
    components: {},
    props: {
      /** 默认选中的标签 */
      tagsAdded: {
        type: Array,
        default: () => []
      },
      /** 可选用的标签（我的标签，点击添加） */
      tagsOptions: {
        type: Array,
        default: () => []
      },
      /** 可选标签的说明 */
      tagsOptionsLabel: {
        type: String,
        default: "我的标签"
      },
      /** 每个标签内容的最大长度 */
      max: {
        type: Number,
        default: 30
      },
      /** 输入框提示信息 */
      placeholder: {
        type: String,
        default: "请输入标签"
      }
    },
    data() {
      return {
        stateTagsAdded: [],
        /** 输入框内容副本 */
        shadowText: this.$props.placeholder
      };
    },
    watch: {
      stateTagsAdded(newTags) {
        /** 
         * 添加的标签发生变化
         * @type {Event}
         */
        this.$emit('change', newTags);
      },
      tagsAdded: {
        handler(newTags) {
          this.stateTagsAdded = newTags;
        },
        immediate: true
      }
    },
    methods: {
      /** 添加标签 */
      addTag(tagString) {
        const tagValue = tagString.trim();
        if (tagValue === "") return;
        // 有重复的不添加
        if (~this.stateTagsAdded.indexOf(tagValue)) return;
        this.stateTagsAdded = this.stateTagsAdded.concat(tagValue.trim());
        this.onFormTap();
      },
      onSubmit(event) {
        this.addTag(this.$refs.input.value);
        this.$refs.input.value = "";
        this.$refs.input.classList.remove("active");
        event.preventDefault();
        return this.tags;
      },
      onKeydown(event) {
        if (event.keyCode === 8 && this.$refs.input.value === "") {
          this.stateTagsAdded = this.stateTagsAdded.slice(0, -1);
        }
        // 根据输入框有没有内容切换样式
        this.$refs.input.classList.toggle(
          "active",
          this.$refs.input.value !== ""
        );
      },
      onKeyup(event) {
        this.shadowText = event.target.value;
      },
      removeTag(tag) {
        const index = this.stateTagsAdded.indexOf(tag);
        this.stateTagsAdded.splice(index, 1);
        // this.stateTagsAdded = [...this.stateTagsAdded];
      },
      onFormTap() {
        this.$refs.input.focus();
      },
      inputWidth() {
        return this.$refs.shadowText
          ? this.$refs.shadowText.clientWidth + 10 + "px"
          : "21.33333vw";
      },
      /**
       * 外部方法，获取当前添加的标签
       */
      getTags() {
        return this.stateTagsAdded;
      }
    },
    computed: {},
    mounted() {}
  };
</script>