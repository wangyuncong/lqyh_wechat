<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zhang Zi Fang
 * @Date: 2019-09-10 17:49:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-11 13:48:53
 -->
<template>
  <div class="all">
    <div v-if="zhibiaoid==8" class="title">
      <span>记录日期</span>
      <span>体重(kg)</span>
      <span>BMI指数</span>
    </div>
    <div v-if="zhibiaoid!=8" class="title">
      <span>记录日期</span>
      <span>类型</span>
      <span>血糖值(mmol/L)</span>
    </div>
    <div v-if="zhibiaoid!=8" class="main" v-for="item in list">
      <span>{{item.valuetime}}</span>
      <span>{{item.indicatortype}}</span>
      <span>{{item.indicatorvalue}}</span>
    </div>
    <div v-if="zhibiaoid==8" class="main" v-for="item in list">
      <span>{{item.valuetime}}</span>
      <span>{{item.indicatorvalue}}</span>
      <span>{{item.BMI}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "all",
  data() {
    return {
      list: [],
      zhibiaoid: ""
    };
  },
  props: [""],
  filters: {},
  components: {},
  async mounted() {
    this.userid = this.$route.query.userid;
    this.zhibiaoid = this.$route.query.id;
    if (this.zhibiaoid != 8) {
      this.zhibiaoid = "1,2,3,4,5,6,7";
    }
    var xdata = this.getAll(
      this.countDate("", 3, true),
      this.getNowFormatDate()
    );
    this.$http({
      url: "/bjyyq/apimg/indicatorList?time=" + new Date().getTime(),
      method: "get",
      data: {
        indicatorid: this.zhibiaoid,
        userid: this.userid,
        xdate: this.zhibiaoid != 8 ? xdata.join(",") : null
      },
      success: res => {
        var list = res.data.filter(
          s => s.indicatorvalue != "undefined" && s.indicatorvalue
        );
        this.list = list;
        this.list.map(item => {
          if (item.indicatorid == 1) {
            item.indicatortype = "早餐前血糖";
          } else if (item.indicatorid == 2) {
            item.indicatortype = "早餐后血糖";
          } else if (item.indicatorid == 3) {
            item.indicatortype = "午餐前血糖";
          } else if (item.indicatorid == 4) {
            item.indicatortype = "午餐后血糖";
          } else if (item.indicatorid == 5) {
            item.indicatortype = "晚餐前血糖";
          } else if (item.indicatorid == 6) {
            item.indicatortype = "晚餐后血糖";
          } else if (item.indicatorid == 7) {
            item.indicatortype = "睡前血糖";
          }
        });
        this.list = [...this.list];
        this.customerMsg();
      }
    });
  },
  watch: {},
  methods: {
    customerMsg() {
      this.$http({
        url: "/bjyyq/apimg/customerMsg?time=" + new Date().getTime(),
        method: "get",
        data: {
          userid: this.userid
        },
        success: res => {
          this.list.forEach(element => {
            element.BMI = (
              Number(element.indicatorvalue) /
              ((res.data.stature / 100) * (res.data.stature / 100))
            ).toFixed(2);
          });
          this.list = JSON.parse(JSON.stringify(this.list));
        }
      });
    },
    countDate(res, AddDayCount, bl = false) {
      let dd = new Date();
      if (res) {
        dd = new Date(res);
      }
      //获取AddDayCount天后的日期
      if (bl) {
        dd.setDate(dd.getDate() - Number(AddDayCount));
      } else {
        dd.setDate(dd.getDate() + Number(AddDayCount));
      }
      let y = dd.getFullYear();
      //获取当前月份的日期，不足10补0
      let m =
        dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
      //获取当前几号，不足10补0
      let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
      let firstDistribution = y + "-" + m + "-" + d;
      return firstDistribution;
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    getAll(begin, end) {
      // 在时间Date的原型中定义一个format方法
      Date.prototype.format = function() {
        var s = ""; // 定义一个字符串，目的，要时间格式按照我们的要求拼接
        var month = this.getMonth() + 1;
        var day = this.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (day >= 0 && day <= 9) {
          day = "0" + day;
        }
        s += this.getFullYear() + "-";
        s += month + "-";
        s += day;
        return s; // 得到的格式如 "2018-11-20"
      };

      var ab = begin.split("-"); // 把日期参数分割，注意，如果以'/'连接，则分割'/'
      var ae = end.split("-");
      var db = new Date();
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]); // 返回符合UTC的时间格式
      var de = new Date();
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
      var unixDb = db.getTime();
      var unixDe = de.getTime();
      var arr = [];
      for (var k = unixDb; k <= unixDe; ) {
        arr.push(new Date(parseInt(k)).format());
        k = k + 24 * 60 * 60 * 1000;
      }
      return arr;
    }
  }
};
</script>
<style lang='less' src='./all.less' scoped>
</style>