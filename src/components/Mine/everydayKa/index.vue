<template>
  <div class="everydayKa">
    <div class="everydayKa-nav">
      <span @click="dateFcun('front')">前一天</span>
      <span class="span" @click="riqi">
        <img src="/static/images/rili.png" alt />
        {{shijian}}
      </span>
      <span @click="dateFcun('rear')">后一天</span>
    </div>
    <mt-datetime-picker
      v-model="pickerVisible"
      type="date"
      ref="picker"
      year-format="{value} 年"
      month-format="{value} 月"
      @confirm="handleConfirm"
      date-format="{value} 日"
    ></mt-datetime-picker>
    <p class="zhibiao">记录指标</p>
    <div class="dife">
      <div
      style="box-shadow: 2px 3px 4px #eee;box-sizing: border-box;"
        v-for="(item,index) in list"
        @click="showClick(item,index)"
        :key="index"
      >
        <img
          src="/static/images/bagkolvse.png?1"
          alt
        />
        <div class="dife-img" @click.stop="showClickTankuang(item,index)" style="background:#fff">
          <img src="/static/images/81230c0c30a08f98919964dca2c2d28.png" alt />
        </div>
        <div>
          <p>{{item.indicatorname}}</p>
          <p>{{item.msg&&item.msg.indicatorvalue}}{{item.msg&&item.unit}}</p>
        </div>
      </div>
    </div>
    <div v-if="show" class="show" @click="show = false">
      <div @click.stop class="showdiv">
        <van-field v-model="value" placeholder="请输入值">
          <div slot="button">{{list[indexSelect].unit}}</div>
        </van-field>
        <van-button class="queding" @click="goClick" type="primary">保存</van-button>
      </div>
    </div>
    <!-- <div class="shijain">
      时间跨度选择
      <span>一月</span>
      <img src="/static/images/left.png" alt />
    </div>-->
    <p style="text-indent: 8px;position: relative;top: 11px;">{{quxianSHuoMing.indicatorname}}({{quxianSHuoMing.unit}})</p>
    <div id="main" style="height: 250px;width: 100%;display: inline-block;position: relative;"></div>
    <button class="button" @click="$router.go(-1)">确定</button>
  </div>
</template>
<script>
import { Icon, Field, Button } from "vant";
import { MessageBox } from "mint-ui";
export default {
  name: "everydayKa",
  data() {
    return {
      shijian: "",
      pickerVisible: new Date(),
      list: [],
      value: "",
      quxianSHuoMing:{},
      unit: "",
      indexSelect: 0,
      option: {
        grid: {
          top: "30px",
          left: "30px",
          right: "15px",
          bottom: "80px"
        },
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: {
          type: "value",
          data: [],
          max: "",
          min: "",
          splitArea: {
            show: false,
            areaStyle: {
              color: []
            }
          },
          axisLabel: {
            formatter: "{value}"
          }
        },
        series: [
          {
            connectNulls: true,
            data: [],
            type: "line"
          }
        ]
      },
      show: false
    };
  },
  filters: {},
  components: {
    [Icon.name]: Icon,
    [Field.name]: Field,
    [Button.name]: Button
  },

  async mounted() {
    this.shijian = this.getNowFormatDate();
  },
  watch: {
    shijian() {
      this.everydayCal();
    },
    option(res) {
      this.$nextTick(() => {
        var myChart = echarts.init(document.getElementById("main"));
        myChart.setOption(this.option);
      });
    }
  },
  methods: {
    showClickTankuang(item) {
      var id = item.id;
      this.option.yAxis.max = item.ymax;
      this.option.yAxis.min = item.ymin;
      this.quxianTarget({ riqiList: [], id });
    },
    deepClone(data) {
      if (!data || !(data instanceof Object) || typeof data == "function") {
        return data || undefined;
      }
      var constructor = data.constructor;
      var result = new constructor();
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          result[key] = this.deepClone(data[key]);
        }
      }
      return result;
    },
    everydayCal() {
      this.$http({
        url: "/bjyyq/api/everydayCal",
        data: {
          valuetime: this.shijian
        },
        success: res => {
          this.list = res.data.msg;
          var id = this.list[this.indexSelect].id;
          this.quxianTarget({ riqiList: [], id });
        }
      });
    },
    riqi() {
      this.$refs.picker.open();
    },
    quxianTarget({ riqiList, id }) {
      if (riqiList.length == 0) {
        // 生成日期
        riqiList = [];
        for (let index = 0; index < 7; index++) {
          riqiList.push(this.countDate(this.shijian, index, true));
        }
        riqiList.reverse();
      }
      var li = this.list.filter(s=>s.id == id)
      this.quxianSHuoMing.indicatorname = li[0].indicatorname
      this.quxianSHuoMing.unit = li[0].unit
      this.quxianSHuoMing = JSON.parse(JSON.stringify(this.quxianSHuoMing))
      this.option.xAxis.data = [];
      this.option.series[0].data = [];
      this.$http({
        url: "/bjyyq/api/quxianTarget",
        data: {
          id,
          riqiList: riqiList
        },
        success: res => {
          var panduan = true;
          res.data.forEach((s, i) => {
            if (s) {
              this.option.xAxis.data.push(s.valuetime);
              this.option.series[0].data.push(s.indicatorvalue);
              panduan = false;
            } else {
              this.option.series[0].data.push("");
              this.option.xAxis.data.push(riqiList[i]);
            }
          });
          // 如果一个都没有设置默认值
          if (panduan) {
            this.option.series[0].data.push(50);
          }
          this.option = this.deepClone(this.option);
        }
      });
    },
    showClick(item, index) {
      this.indexSelect = index;
      if (item.msg) {
        this.value = item.msg.indicatorvalue;
      }

      this.show = true;
    },
    goClick() {
      this.show = false;
      var item = this.list[this.indexSelect];
      if (item.ymax < this.value || item.ymin > this.value) {
        return MessageBox.alert(
          `***数值范围为"${item.ymax}-${item.ymin}mmol/L",请重新输入。`
        );
      }
      this.$http({
        url: "/bjyyq/api/recordCal",
        data: {
          id: item.id,
          value: this.value,
          unit: this.unit,
          valuetime: this.shijian
        },
        success: res => {
          this.list[this.indexSelect].msg = {};
          this.list[this.indexSelect].msg.indicatorvalue = this.value;
          this.list[this.indexSelect].msg.unit = this.unit;
          this.list = JSON.parse(JSON.stringify(this.list));
          this.value = "";
          // var id = this.list[this.indexSelect].id;
          // this.quxianTarget({ riqiList: [], id });
        }
      });
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      var myDate = date.getHours() + 1;
      var getMinutes = date.getMinutes() + 1;
      var getSeconds = date.getSeconds() + 1;
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = `${year}-${month}-${strDate}`;
      return currentdate;
    },
    dateFcun(res) {
      if (res === "rear") {
        this.shijian = this.countDate(this.shijian, 1);
      } else {
        this.shijian = this.countDate(this.shijian, 1, true);
      }
    },
    // 根据日期获取以后的某天是几号  最后一个参数是前还是后 前为true
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
    handleConfirm(res) {
      var date = res;
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate =
        date.getFullYear() + seperator1 + month + seperator1 + strDate;
      this.shijian = currentdate;
    }
  }
};
</script>

<style lang='less' src='./index.less' scoped>
</style>