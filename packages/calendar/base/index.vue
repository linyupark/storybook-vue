<style lang="scss" scoped>
  .wh_container {
    width: 100vw;
  }
  li {
    list-style-type: none;
  }
  .wh_top_changge {
    display: flex;
  }
  .wh_top_changge li {
    cursor: pointer;
    display: flex;
    color: #ccc;
    font-size: px2vw(32);
    flex: 1;
    justify-content: center;
    align-items: center;
    height: px2vw(47);
  }
  .wh_top_changge .wh_content_li {
    flex: 2.5;
  }
  .wh_content_all {
    background: #fff;
    width: 100%;
    overflow: hidden;
    padding-bottom: px2vw(8);
  }
  .wh_content {
    display: flex;
    flex-wrap: wrap;
    padding: 0 3% 0 3%;
    width: 100%;
  }
  .wh_content:first-child .wh_content_item_tag,
  .wh_content:first-child .wh_content_item {
    color: #ddd;
    font-size: px2vw(24);
  }
  .wh_content_item,
  .wh_content_item_tag {
    font-size: px2vw(24);
    width: 13.4%;
    text-align: center;
    color: #272727;
    position: relative;
  }
  .wh_content_item {
    height: px2vw(80);
  }
  /* 星期几 */
  .wh_top_tag, .wh_item_date {
    width: px2vw(80);
    height: px2vw(80);
    line-height: px2vw(80);
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: px2vw(26);
    color: #272727;
  }
  .wh_item_date {
    position: relative;
    .blue, .grey, .pink {
      position: absolute;
      width: px2vw(12);
      height: px2vw(12);
      border-radius: 50%;
      background: #3985FC;
      bottom: $hairline2;
    }
    .grey {
      background: #C7C7C7;
    }
    .pink {
      background: #FF7E71;
    }
  }
  .wh_jiantou1, .wh_jiantou2 {
    width: px2vw(18);
    height: px2vw(18);
    border-top: $hairline2 solid #ccc;
    border-left: $hairline2 solid #ccc;
    transform: rotate(-45deg);
  }
  .wh_jiantou1:active,
  .wh_jiantou2:active {
    border-color: #666;
  }
  .wh_jiantou2 {
    transform: rotate(135deg);
  }
  .wh_content_item > .wh_isMark {
    margin: auto;
    border-radius: 100px;
    background: blue;
    z-index: 2;
  }
  .wh_content_item .wh_other_dayhide {
    color: #c7c7c7;
  }
  .wh_content_item .wh_want_dayhide {
    color: #bfbfbf;
  }
  .wh_content_item .wh_isToday {
    border-radius: 50%;
    box-shadow: 0 0 0 $hairline2 #3985fc inset;
    .blue {
      background: #fff;
    }
  }
  /* 点击日 */
  .wh_content_item .wh_chose_day {
    background: #3985fc;
    color: #fff;
    border-radius: 100px;
    .blue {
      background: #fff;
    }
  }
</style>
<template>
  <section class="wh_container">
    <div class="wh_content_all">
      <div class="wh_top_changge">
        <li @click="PreMonth(myDate,false)">
          <div class="wh_jiantou1"></div>
        </li>
        <li class="wh_content_li">{{dateTop}}</li>
        <li @click="NextMonth(myDate,false)">
          <div class="wh_jiantou2"></div>
        </li>
      </div>
      <div class="wh_content">
        <div
          class="wh_content_item"
          v-for="(tag, i) in textTop"
          :key="i"
        >
          <div class="wh_top_tag">{{tag}}</div>
        </div>
      </div>
      <div class="wh_content">
        <div
          class="wh_content_item"
          v-for="(item, index) in list"
          @click="clickDay(item, index)"
          :key="index"
        >
          <div
            class="wh_item_date"
            v-bind:class="[{ wh_isMark: item.isMark},{wh_other_dayhide:item.otherMonth!=='nowMonth'},{wh_want_dayhide:item.dayHide},{wh_isToday:item.isToday},{wh_chose_day:item.chooseDay},setClass(item)]"
          >{{item.id}}<i
              v-show="item.markClassName !== ''"
              :class="{[item.markClassName]: true}"
            ></i></div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  import timeUtil from "./utils";
  export default {
    data() {
      return {
        myDate: [],
        list: [],
        historyChose: [],
        dateTop: ""
      };
    },
    props: {
      /**
       * 简单标注
       */
      markDate: {
        type: Array,
        default: () => []
      },
      /** 
       * 多类型标注
       * eg: [
            {date: '2019/08/12', className: 'blue'},
            {date: '2019/08/14', className: 'grey'},
            {date: '2019/08/1', className: 'pink'}
          ]
       */
      markDateMore: {
        type: Array,
        default: () => []
      },
      /** 顶部星期格式 */
      textTop: {
        type: Array,
        default: () => ["日", "一", "二", "三", "四", "五", "六"]
      },
      /** 从星期日开始从左到右排列 */
      sundayStart: {
        type: Boolean,
        default: () => true
      },
      /** 某个日期以前的不允许点击  时间戳10位 */
      agoDayHide: {
        type: String,
        default: `0`
      },
      /** 某个日期以后的不允许点击  时间戳10位 */
      futureDayHide: {
        type: String,
        default: `2554387200`
      }
    },
    created() {
      this.intStart();
      this.myDate = new Date();
    },
    methods: {
      intStart() {
        timeUtil.sundayStart = this.sundayStart;
      },
      setClass(data) {
        // let obj = {};
        // obj[data.markClassName] = data.markClassName;
        // return obj;
      },
      clickDay: function(item, index) {
        if (item.otherMonth === "nowMonth" && !item.dayHide) {
          this.getList(this.myDate, item.date);
        }
        if (item.otherMonth !== "nowMonth") {
          item.otherMonth === "preMonth"
            ? this.PreMonth(item.date)
            : this.NextMonth(item.date);
        }
      },
      ChoseMonth: function(date, isChosedDay = true) {
        date = timeUtil.dateFormat(date);
        this.myDate = new Date(date);
        /**
         * 改变月份
         * @type {Event}
         */
        this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
        if (isChosedDay) {
          this.getList(this.myDate, date, isChosedDay);
        } else {
          this.getList(this.myDate);
        }
      },
      PreMonth: function(date, isChosedDay = true) {
        date = timeUtil.dateFormat(date);
        this.myDate = timeUtil.getOtherMonth(this.myDate, "preMonth");
        this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
        if (isChosedDay) {
          this.getList(this.myDate, date, isChosedDay);
        } else {
          this.getList(this.myDate);
        }
      },
      NextMonth: function(date, isChosedDay = true) {
        date = timeUtil.dateFormat(date);
        this.myDate = timeUtil.getOtherMonth(this.myDate, "nextMonth");
        this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
        if (isChosedDay) {
          this.getList(this.myDate, date, isChosedDay);
        } else {
          this.getList(this.myDate);
        }
      },
      forMatArgs: function() {
        let markDate = this.markDate;
        let markDateMore = this.markDateMore;
        markDate = markDate.map(k => {
          return timeUtil.dateFormat(k);
        });
        markDateMore = markDateMore.map(k => {
          k.date = timeUtil.dateFormat(k.date);
          return k;
        });
        return [markDate, markDateMore];
      },
      getList: function(date, chooseDay, isChosedDay = true) {
        const [markDate, markDateMore] = this.forMatArgs();
        this.dateTop = `${date.getFullYear()}年${date.getMonth() + 1}月`;
        let arr = timeUtil.getMonthList(this.myDate);
        for (let i = 0; i < arr.length; i++) {
          let markClassName = "";
          let k = arr[i];
          k.chooseDay = false;
          const nowTime = k.date;
          const t = new Date(nowTime).getTime() / 1000;
          //看每一天的class
          for (const c of markDateMore) {
            if (c.date === nowTime) {
              markClassName = c.className || "";
            }
          }
          //标记选中某些天 设置class
          k.markClassName = markClassName;
          k.isMark = markDate.indexOf(nowTime) > -1;
          //无法选中某天
          k.dayHide = t < this.agoDayHide || t > this.futureDayHide;
          if (k.isToday) {
            /**
             * 点击的是今天
             * @type {Event} isToday
             */
            this.$emit("isToday", timeUtil.dateFormatXX(nowTime));
          }
          let flag = !k.dayHide && k.otherMonth === "nowMonth";
          if (chooseDay && chooseDay === nowTime && flag) {
            /**
             * 点击选择某日期
             * @type {Event} choseDay
             */
            this.$emit("choseDay", timeUtil.dateFormatXX(nowTime));
            this.historyChose.push(nowTime);
            k.chooseDay = true;
          } else if (
            this.historyChose[this.historyChose.length - 1] === nowTime &&
            !chooseDay &&
            flag
          ) {
            k.chooseDay = true;
          }
        }
        this.list = arr;
      }
    },
    mounted() {
      this.getList(this.myDate);
    },
    watch: {
      markDate: {
        handler(val, oldVal) {
          this.getList(this.myDate);
        },
        deep: true
      },
      markDateMore: {
        handler(val, oldVal) {
          this.getList(this.myDate);
        },
        deep: true
      },
      agoDayHide: {
        handler(val, oldVal) {
          this.getList(this.myDate);
        },
        deep: true
      },
      futureDayHide: {
        handler(val, oldVal) {
          this.getList(this.myDate);
        },
        deep: true
      },
      sundayStart: {
        handler(val, oldVal) {
          this.intStart();
          this.getList(this.myDate);
        },
        deep: true
      }
    }
  };
</script>