<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zhang Zi Fang
 * @Date: 2019-09-10 17:49:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-14 09:23:52
 -->
<template>
  <div class="canvas-svg"  v-wechat-title="title">
    <div class="piechart" v-if="indicatorname=='体重'">
      <div class="piefe">
        <div id="pie"></div>
        <div class="pier">
          <div class="BMI">
            <div>BMI</div>
            <div>{{m.bmi}}</div>
          </div>
        </div>
        <div class="neiron">
          <span v-if="status === 1">过轻</span>
          <span v-if="status === 2">正常</span>
          <span v-if="status === 3">超重</span>
          <span v-if="status === 4">肥胖</span>
        </div>
      </div>
      <div class="pie-main">
        <p>
          孕前体重:
          <span v-if="weight">{{weight}}kg</span>
          <span v-else class="luruwei">
            <span style="color:#999;" class="luru" v-if="$route.query.userid">未录入</span>
            <a style="color:#999;" v-else href="#/imessage?go=true">未录入</a>
          </span>
        </p>
        <p>
          身高:
          <span v-if="listData.length !== 0&& !gerenxinxi">{{m.stature}}cm</span>
          <span v-else  class="luruwei">
            <span style="color:#999;" v-if="$route.query.userid">未录入</span>
            <a style="color:#999;" v-else href="#/imessage?go=true">未录入</a>
          </span>
        </p>
        <p>
          变化:
          <img v-if="listData.length !== 0&& !gerenxinxi" src="static/images/jainfwe.png" alt />
          <span v-if="listData.length !== 0&& !gerenxinxi">{{m.bianhua}}kg</span>
          <span v-else>
            <!-- <span style="color:#41b396;" v-if="$route.query.userid">未录入</span>
            <a style="color:#41b396;" v-else href="#/imessage">未录入</a> -->
          </span>
        </p>
      </div>
    </div>
    <p class="qushitubr" v-if="$route.query.id!=8">
      <span>{{indicatorname}}变化趋势图</span>
      <button
        :class="butIndex == index ? 'select_but' : ''"
        @click="butIndex = index"
        :key="index"
        v-for="(item,index) in butList"
      >{{item}}</button>
    </p>
    <div class="porp" v-if="listData.length !== 0 && !gerenxinxi">
      <div class="main" id="main"></div>
    </div>
    <div class="zanwushu" v-if="listData.length === 0 && !gerenxinxi">
      <img src="/static/images/zanwushu.png" alt />
      <p>无记录数据</p>
    </div>
    <div class="zanwushu" v-if="gerenxinxi">
      <img src="/static/images/zanwushu.png" alt />
      <p>
        <span v-if="$route.query.userid">此用户未完善个人信息</span>
        <a style="color:#41b396;" v-else href="#/imessage?go=true">点击补充个人信息 <img style="width:14px;" src="static/images/dianji.png" alt=""></a>
      </p>
    </div>
    <button class="button" @click="all">{{indicatorname!=='体重'?'近三天所有血糖记录':'所有记录'}}</button>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
export default {
  name: "canvas-svg",
  data() {
    return {
      allOrder:[],
      butList: ["七天", "三十天", "全部"],
      butIndex: 0,
      m: {},
      gerenxinxi: false,
      unit: "kg",
      listData: [],
      status: 0,
      indicatorname: "体重",
      weight:"",
      title:"体重详情",
      show: false,
      pie: {
        silent: true,
        series: [
          {
            name: "",
            type: "pie",
            radius: ["50%", "100%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              fontSize: "11",
              fontWeight: "bold",
              color: "#fff",
              position: "inside",
              lineHeight: 15,
              formatter: function(b, d) {
                var span = "";
                b.name.split("").forEach(element => {
                  span += `${element}`;
                });
                return span;
              }
            },
            data: [
              {
                value: 25,
                name: "过轻",
                itemStyle: {
                  color: "#41b396",
                  borderColor: "#fff"
                }
              },
              {
                value: 25,
                name: "正常",
                itemStyle: {
                  color: "#41b396",
                  borderColor: "#fff"
                }
              },
              {
                value: 25,
                name: "超重",
                itemStyle: {
                  color: "#41b396",
                  borderColor: "#fff"
                }
              },
              {
                value: 25,
                name: "肥胖",
                itemStyle: {
                  color: "#41b396",
                  borderColor: "#fff"
                }
              }
            ]
          }
        ]
      },
      option: {
        grid: {
          top: "30px",
          left: "30px",
          right: "15px",
          bottom: "30px"
        },
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: function(params) {
            return ``;
          },
          backgroundColor: "#fff",
          textStyle: {
            color: "#000"
          },
          borderColor: "#000",
          borderWidth: 1
        },
        xAxis: {
          type: "category",
          data: [1, 2, 3, 4],
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#999"
            }
          }
        },
        yAxis: {
          name: `(mmol/L)`,
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
              color: "#999"
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#e5e5e5"]
            }
          }
        },
        series: []
      },
      huanyunDateArr:[]
    };
  },
  props: [""],
  filters: {},
  components: {},
  async mounted() {
    if(this.$route.query.id && this.$route.query.id <=7){
      this.title = '血糖详情'
    }
    if (this.$route.query.id == 8) {
      this.indicatorname = "体重";
      this.unit = "kg";
      this.option.yAxis.name = "(kg)";
    } else if (this.$route.query.id == 1) {
      this.indicatorname = "早餐前血糖";
      this.unit = "mmol/L";
    } else if (this.$route.query.id == 2) {
      this.indicatorname = "早餐后血糖";
      this.unit = "mmol/L";
    } else if (this.$route.query.id == 3) {
      this.indicatorname = "午餐前血糖";
      this.unit = "mmol/L";
    } else if (this.$route.query.id == 4) {
      this.indicatorname = "午餐后血糖";
      this.unit = "mmol/L";
    } else if (this.$route.query.id == 5) {
      this.indicatorname = "晚餐前血糖";
      this.unit = "mmol/L";
    } else if (this.$route.query.id == 6) {
      this.indicatorname = "晚餐后血糖";
      this.unit = "mmol/L";
    } else if (this.$route.query.id == 7) {
      this.indicatorname = "睡前血糖";
      this.unit = "mmol/L";
    }
    this.userid = this.$route.query.userid;
    this.$nextTick(() => {
      var pie = echarts.init(document.getElementById("pie"));
      pie.setOption(this.pie);
    });
    this.$http({
      url: "/bjyyq/apimg/customerMsg?time=" + new Date().getTime(),
      data: {
        userid: this.userid
      },
      method: "get",
      success: data => {
        if (data.status === "success") {
          // if(!data.data.weight&&!data.data.stature&&!data.data.BMI){
          //   this.gerenxinxi = true;
          //   return;
          // }
          if (JSON.stringify(data.data) === "{}") {
            if(this.$route.query.id!=8){

            }else{
              this.gerenxinxi = true;
            }
            
            // return;
          }

          this.form = { ...data.data, ...this.form };
          this.indicatorList();
        }
       this.weight = data.data.weight
        this.m.weight = data.data.weight;
        this.m.stature = data.data.stature;
        this.m = JSON.parse(JSON.stringify(this.m));
      }
    }).then(()=>{
      let arrhuanyun = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
      // arrhuanyun.length = 40
      let huanyunDateArr = []
      var huaiyunDate = new Date(this.form.gestation);
      // huaiyunDate.setTime(day1.getTime());
      Array.from(arrhuanyun).map((item,index)=>{
        // console.log(']]]]]]]....',this.form.gestation,huaiyunDate.getTime())
        index!==0&& huanyunDateArr.push(
          {
            ZIndex:index,
            zhouname:`第${index}周`,
            zhouvalue:huaiyunDate.getFullYear()+"-" + ((huaiyunDate.getMonth()+1).toString().length==1?`0${(huaiyunDate.getMonth()+1)}`: (huaiyunDate.getMonth()+1))+ "-" + (huaiyunDate.getDate().toString().length==1?`0${huaiyunDate.getDate()}`: huaiyunDate.getDate())
          }
        )
        huaiyunDate = new Date(huaiyunDate.getTime()+24*60*60*7000)
      })
      huanyunDateArr.map((item)=>{
        if(item.ZIndex!=0){
          let arrdate = []
          arrdate.push(item.zhouvalue)
          arrdate.push((new Date(new Date(item.zhouvalue).getTime()-24*60*60*1000)).getFullYear()+"-" + (((new Date(new Date(item.zhouvalue).getTime()-24*60*60*1000)).getMonth()+1).toString().length==1?`0${((new Date(new Date(item.zhouvalue).getTime()-24*60*60*1000)).getMonth()+1)}`: ((new Date(new Date(item.zhouvalue).getTime()-24*60*60*1000)).getMonth()+1))+ "-" + ((new Date(new Date(item.zhouvalue).getTime()-24*60*60*1000)).getDate().toString().length==1?`0${(new Date(new Date(item.zhouvalue).getTime()-24*60*60*1000)).getDate()}`: (new Date(new Date(item.zhouvalue).getTime()-24*60*60*1000)).getDate()))
          arrdate.push((new Date(new Date(item.zhouvalue).getTime()-24*60*60*2000)).getFullYear()+"-" + (((new Date(new Date(item.zhouvalue).getTime()-24*60*60*2000)).getMonth()+1).toString().length==1?`0${((new Date(new Date(item.zhouvalue).getTime()-24*60*60*2000)).getMonth()+1)}`: ((new Date(new Date(item.zhouvalue).getTime()-24*60*60*2000)).getMonth()+1))+ "-" + ((new Date(new Date(item.zhouvalue).getTime()-24*60*60*2000)).getDate().toString().length==1?`0${(new Date(new Date(item.zhouvalue).getTime()-24*60*60*2000)).getDate()}`: (new Date(new Date(item.zhouvalue).getTime()-24*60*60*2000)).getDate()))
          arrdate.push((new Date(new Date(item.zhouvalue).getTime()-24*60*60*3000)).getFullYear()+"-" + (((new Date(new Date(item.zhouvalue).getTime()-24*60*60*3000)).getMonth()+1).toString().length==1?`0${((new Date(new Date(item.zhouvalue).getTime()-24*60*60*3000)).getMonth()+1)}`: ((new Date(new Date(item.zhouvalue).getTime()-24*60*60*3000)).getMonth()+1))+ "-" + ((new Date(new Date(item.zhouvalue).getTime()-24*60*60*3000)).getDate().toString().length==1?`0${(new Date(new Date(item.zhouvalue).getTime()-24*60*60*3000)).getDate()}`: (new Date(new Date(item.zhouvalue).getTime()-24*60*60*3000)).getDate()))
          arrdate.push((new Date(new Date(item.zhouvalue).getTime()-24*60*60*4000)).getFullYear()+"-" + (((new Date(new Date(item.zhouvalue).getTime()-24*60*60*4000)).getMonth()+1).toString().length==1?`0${((new Date(new Date(item.zhouvalue).getTime()-24*60*60*4000)).getMonth()+1)}`: ((new Date(new Date(item.zhouvalue).getTime()-24*60*60*4000)).getMonth()+1))+ "-" + ((new Date(new Date(item.zhouvalue).getTime()-24*60*60*4000)).getDate().toString().length==1?`0${(new Date(new Date(item.zhouvalue).getTime()-24*60*60*4000)).getDate()}`: (new Date(new Date(item.zhouvalue).getTime()-24*60*60*4000)).getDate()))
          arrdate.push((new Date(new Date(item.zhouvalue).getTime()-24*60*60*5000)).getFullYear()+"-" + (((new Date(new Date(item.zhouvalue).getTime()-24*60*60*5000)).getMonth()+1).toString().length==1?`0${((new Date(new Date(item.zhouvalue).getTime()-24*60*60*5000)).getMonth()+1)}`: ((new Date(new Date(item.zhouvalue).getTime()-24*60*60*5000)).getMonth()+1))+ "-" + ((new Date(new Date(item.zhouvalue).getTime()-24*60*60*5000)).getDate().toString().length==1?`0${(new Date(new Date(item.zhouvalue).getTime()-24*60*60*5000)).getDate()}`: (new Date(new Date(item.zhouvalue).getTime()-24*60*60*5000)).getDate()))
          arrdate.push((new Date(new Date(item.zhouvalue).getTime()-24*60*60*6000)).getFullYear()+"-" + (((new Date(new Date(item.zhouvalue).getTime()-24*60*60*6000)).getMonth()+1).toString().length==1?`0${((new Date(new Date(item.zhouvalue).getTime()-24*60*60*6000)).getMonth()+1)}`: ((new Date(new Date(item.zhouvalue).getTime()-24*60*60*6000)).getMonth()+1))+ "-" + ((new Date(new Date(item.zhouvalue).getTime()-24*60*60*6000)).getDate().toString().length==1?`0${(new Date(new Date(item.zhouvalue).getTime()-24*60*60*6000)).getDate()}`: (new Date(new Date(item.zhouvalue).getTime()-24*60*60*6000)).getDate()))
          // arrdate.push((new Date(item.zhouvalue).getTime()-24*60*60*2000).getFullYear()+"-" + (((new Date(item.zhouvalue).getTime()-24*60*60*2000).getMonth()+1).toString().length==1?`0${((new Date(item.zhouvalue).getTime()-24*60*60*2000).getMonth()+1)}`: ((new Date(item.zhouvalue).getTime()-24*60*60*2000).getMonth()+1))+ "-" + ((new Date(item.zhouvalue).getTime()-24*60*60*2000).getDate().toString().length==1?`0${huaiyunDate.getDate()}`: (new Date(item.zhouvalue).getTime()-24*60*60*2000).getDate()))
          // arrdate.push((new Date(item.zhouvalue).getTime()-24*60*60*3000).getFullYear()+"-" + (((new Date(item.zhouvalue).getTime()-24*60*60*3000).getMonth()+1).toString().length==1?`0${((new Date(item.zhouvalue).getTime()-24*60*60*3000).getMonth()+1)}`: ((new Date(item.zhouvalue).getTime()-24*60*60*3000).getMonth()+1))+ "-" + ((new Date(item.zhouvalue).getTime()-24*60*60*3000).getDate().toString().length==1?`0${huaiyunDate.getDate()}`: (new Date(item.zhouvalue).getTime()-24*60*60*3000).getDate()))
          // arrdate.push((new Date(item.zhouvalue).getTime()-24*60*60*4000).getFullYear()+"-" + (((new Date(item.zhouvalue).getTime()-24*60*60*4000).getMonth()+1).toString().length==1?`0${((new Date(item.zhouvalue).getTime()-24*60*60*4000).getMonth()+1)}`: ((new Date(item.zhouvalue).getTime()-24*60*60*4000).getMonth()+1))+ "-" + ((new Date(item.zhouvalue).getTime()-24*60*60*4000).getDate().toString().length==1?`0${huaiyunDate.getDate()}`: (new Date(item.zhouvalue).getTime()-24*60*60*4000).getDate()))
          // arrdate.push((new Date(item.zhouvalue).getTime()-24*60*60*5000).getFullYear()+"-" + (((new Date(item.zhouvalue).getTime()-24*60*60*5000).getMonth()+1).toString().length==1?`0${((new Date(item.zhouvalue).getTime()-24*60*60*5000).getMonth()+1)}`: ((new Date(item.zhouvalue).getTime()-24*60*60*5000).getMonth()+1))+ "-" + ((new Date(item.zhouvalue).getTime()-24*60*60*5000).getDate().toString().length==1?`0${huaiyunDate.getDate()}`: (new Date(item.zhouvalue).getTime()-24*60*60*5000).getDate()))
          // arrdate.push((new Date(item.zhouvalue).getTime()-24*60*60*6000).getFullYear()+"-" + (((new Date(item.zhouvalue).getTime()-24*60*60*6000).getMonth()+1).toString().length==1?`0${((new Date(item.zhouvalue).getTime()-24*60*60*6000).getMonth()+1)}`: ((new Date(item.zhouvalue).getTime()-24*60*60*6000).getMonth()+1))+ "-" + ((new Date(item.zhouvalue).getTime()-24*60*60*6000).getDate().toString().length==1?`0${huaiyunDate.getDate()}`: (new Date(item.zhouvalue).getTime()-24*60*60*6000).getDate()))
          item.zhouarr = arrdate
        }
      })
      this.huanyunDateArr = huanyunDateArr
    })
    this.getAllOrder()
  },
  watch: {
    butIndex(res) {
      this.indicatorList(res);
    }
  },
  methods: {
    getAllOrder(){
      this.$http({
        url: "/bjyyq/apimg/getUserAllTCOrder?time=" + new Date().getTime(),
        method: "get",
        data: {
          userid:this.userid
        },
        success: data => {
          this.allOrder = data.data
          console.log(this.allOrder,'allorderder')
        }
      })
    },
    all() {
      var callback = "";
      if (this.$route.query.userid) {
        callback += `userid=${this.$route.query.userid}&id=${this.$route.query.id}`;
      } else {
        callback += `id=${this.$route.query.id}`;
      }
      this.$router.push({ path: "/all?" + callback });
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
    TodayInfo(start, enddate, type) {
      var WEEKLEN = 7, // 一周7天为常量
        WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"],
        weekInfo = { week: null, day: null }, // 初始化返回信息，默认第null周，星期null
        oneDay = 24 * 60 * 60 * 1000, // 一天的毫秒时长
        weekLeave, // 当天所在周剩余天数
        weekStart, // 当天start是星期几
        today, // 今天
        dateDiff, // 今天与当天日期差
        sDate; //之日，日期对象
      var rDateStr = /\d{4}[\/-]\d{1,2}[\/-]\d{1,2}/g; // 简单的日期格式校验：2013/12/19
      if (!rDateStr.test(start)) {
        // alert("请使用合法的日期！！！");
        return weekInfo;
      }
      sDate = new Date(start.replace("-", "/"));
      weekStart = sDate.getDay();

      weekStart = weekStart === 0 ? 7 : weekStart; // JS中周日的索引为0，这里转换为7，方便计算
      weekLeave = WEEKLEN;
      if (type == "today") {
        today = new Date();
      } else {
        today = new Date(enddate);
      }

      weekInfo.day = WEEKDAYS[today.getDay()];
      today = new Date(
        today.getFullYear() +
          "/" +
          (today.getMonth() + 1) +
          "/" +
          today.getDate()
      );
      dateDiff = today - sDate;
      if (dateDiff < 0) {
        return weekInfo;
      }
      dateDiff = parseInt(dateDiff / oneDay);
      weekInfo.week = Math.ceil((dateDiff - weekLeave) / WEEKLEN) + 1;
      return weekInfo;
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
    indicatorList(s = 0) {
      var xdata = "";
      if (s === 0) {
        xdata = this.getAll(
          this.countDate("", 6, true),
          this.getNowFormatDate()
        );
      } else if (s === 1) {
        xdata = this.getAll(
          this.countDate("", 30, true),
          this.getNowFormatDate()
        );
      } else if (s === 2) {
        xdata = [];
      }
      this.$http({
        url: "/bjyyq/apimg/indicatorList?time=" + new Date().getTime(),
        method: "get",
        data: {
          indicatorid: this.$route.query.id,
          xdate: (this.$route.query.id==8)?null:xdata.join(","),
          userid: this.userid
        },
        success: data => {
          this.listData = data.data;
          if (data.data.length === 0) {
            return;
          }
          var { indicatorname } = this;
          if (data.status == "success") {
            this.option.xAxis.data = [];
            this.option.series = [];
            let _this = this;
            if (data.data.length > 0) {
              this.option.tooltip.formatter = function(params) {
                if (params.length == 1) {
                  return `<div>${params[0].axisValue} <br/>
                    <p>${
                      params[0].seriesName
                        ? `${params[0].seriesName}：${params[0].value ||
                            "无"}(${_this.unit})`
                        : ""
                    }</p>
                  </div>`;
                } else if (params.length == 2) {
                  return `<div>${params[0].axisValue} <br/>
                    <p>${
                      params[0].seriesName
                        ? `${params[0].seriesName}：${params[0].value ||
                            "无"}(${_this.unit})`
                        : ""
                    }</p>
                    <p>${
                      params[1].seriesName
                        ? `${params[1].seriesName}：${params[1].value ||
                            "无"}(${_this.unit})`
                        : ""
                    }</p>
                  </div>`;
                } else if (params.length == 3) {
                  return `<div>${params[0].axisValue} <br/>
                    <p>${
                      params[0].seriesName
                        ? `${params[0].seriesName}：${params[0].value ||
                            "无"}(${_this.unit})`
                        : ""
                    }</p>
                    <p>${
                      params[1].seriesName
                        ? `${params[1].seriesName}：${params[1].value ||
                            "无"}(${_this.unit})`
                        : ""
                    }</p>
                    <p>${
                      params[2].seriesName
                        ? `${params[2].seriesName}：${params[2].value ||
                            "无"}(${_this.unit})`
                        : ""
                    }</p>
                  </div>`;
                }
              };
              if (indicatorname == "体重") {
                this.option.legend = {
                  // symbolKeepAspect:false,
                  // itemWidth:25,
                  // itemHeight:9,
                  data: [
                    {
                      name: "实际增长",
                      textStyle: {
                        color: "#41b396"
                      },
                      // symbolKeepAspect:false,
                      // itemWidth:25,
                      // itemHeight:14,
                      icon:'image://http://bjyyq.zhaoshuikan.com.cn/static/images/shijizengzhang.png'
                      // borderColor:'#41b396'
                      
                    },
                    {
                      name: "增长下限",
                      textStyle: {
                        color: "#22a6e5"
                      },
                      // symbolKeepAspect:false,
                      // width:25,
                      // height:5,
                      icon:'image://http://bjyyq.zhaoshuikan.com.cn/static/images/zengzhangxiaxian.png'
                      // borderColor:'#22a6e5'
                    },
                    {
                      name: "增长上限",
                      textStyle: {
                        color: "#22e531"
                      },
                      
                      // itemWidth:25,
                      // itemHeight:14,
                      icon:'image://http://bjyyq.zhaoshuikan.com.cn/static/images/zengzhangshangxian.png'

                      // borderColor:'#22e531'
                    }
                  ]
                };
                // function CompareDate(d1, d2) {
                //   return (
                //     new Date(d1.replace(/-/g, "/")) >
                //     new Date(d2.replace(/-/g, "/"))
                //   );
                // }

                this.option.yAxis.splitNumber = 7;
                // let tempDate = false;
                let obj3 = {
                  connectNulls: true,
                  type: "line",
                  data: [],
                  lineStyle: {
                    color: "#41b396"
                  },
                  markArea: {
                    itemStyle:{
                      opacity:.4,
                      backgroundColor:'#f6db37',
                      color:'#f6db37'
                    },
                    data: [
                      // [
                      //   {
                      //     // name: '订餐期间',
                      //     xAxis: "第1周"
                      //   },
                      //   {
                      //     xAxis: "第7周"
                      //   }
                      // ],[
                      //   {
                      //     // name: '订餐期间',
                      //     xAxis: "第6周"
                      //   },
                      //   {
                      //     xAxis: "第10周"
                      //   }
                      // ]
                    ]
                  },
                  name: "实际增长"
                };
                this.allOrder.map((item,index)=>{
                  let arr = []
                  this.huanyunDateArr.map((item1,index1)=>{
                    item1.zhouarr.map((item2,index2)=>{
                      if(item.startdate == item2){
                        arr.push({
                          xAxis:item1.zhouname,
                          ZIndex:item1.ZIndex
                        })
                      }
                      if(item.enddate == item2){
                        arr.push({
                          xAxis:item1.zhouname,
                          ZIndex:item1.ZIndex
                        })
                      }
                    })
                  })
                  arr.length==2&&obj3.markArea.data.push(arr)
                  console.log(obj3.markArea.data,'obj3.markArea.data')
                })
                obj3.markArea.data.map((item,index)=>{
                  if(index!=obj3.markArea.data.length-1){
                    if(obj3.markArea.data[index+1][0].ZIndex<item[1].ZIndex){
                      obj3.markArea.data[index+1][0].ZIndex = item[1].ZIndex
                      obj3.markArea.data[index+1][0].xAxis = item[1].xAxis
                    }
                  }
                })
                 console.log(obj3.markArea.data,'obj3.markArea.data1111')
                this.huanyunDateArr.map((item,index)=>{
                  
                  obj3.data.push({
                      name: item.zhouname,
                      // value: (item.indicatorvalue-this.form.weight).toFixed(2),
                      value: null,
                      symbol: "emptyCircle",
                      symbolSize:  4,
                      symbolOffset:  "",
                      zhouarr:item.zhouarr
                    })
                })
                console.log( obj3.markArea,' obj3.markArea')
                data.data.map(item => {
                  obj3.data.map((itemshiji,indexshiji)=>{
                    // console.log(itemshiji,item.valuetime.split(' ')[0],'item.valuetime.split...................')
                    indexshiji>0 && itemshiji.zhouarr.map((item10)=>{
                      if(item10==item.valuetime.split(' ')[0]){
                        // console.log((item.indicatorvalue-this.form.weight).toFixed(2),'(item.indicatorvalue-this.form.weight).toFixed(2)')
                        itemshiji.value = (item.indicatorvalue-this.form.weight).toFixed(2)
                      }
                    })
                    
                  })
                  // var s = item.valuetime.split(" ")[0].split("-");
                  // this.option.xAxis.data.push(`${s[1]}-${s[2]}`);
                  // var num = (item.indicatorvalue - this.form.weight).toFixed(2);
                  // if (indicatorname == "体重") {
                  //   obj3.data.push({
                  //     name: item.indicatorvalue,
                  //     value:item.indicatorvalue,
                  //     // value: isNaN(num) ? "" : num,
                  //     symbol: "none",
                  //     symbolSize: 4,
                  //     symbolOffset: ""
                  //   });
                  // } else {
                  //   obj3.data.push({
                  //     name: item.indicatorvalue,
                  //     value: item.indicatorvalue,
                  //     symbol: "none",
                  //     symbolSize: 4,
                  //     symbolOffset: ""
                  //   });
                  // }
                });
                this.option.series.push(obj3);
                if (
                  this.form.BMI != "" &&
                  this.form.BMI != null &&
                  this.form.BMI != undefined &&
                  this.form.BMI != "null"
                ) {
                  let xiaxian = 0;
                  let shangxian = "";
                  if (this.form.BMI < 18.5) {
                    xiaxian = 0.44;
                    shangxian = 0.58;
                  } else if (this.form.BMI >= 18.5 && this.form.BMI <= 23.9) {
                    xiaxian = 0.35;
                    shangxian = 0.5;
                  } else if (this.form.BMI >= 24 && this.form.BMI <= 27.9) {
                    xiaxian = 0.23;
                    shangxian = 0.33;
                  } else if (this.form.BMI >= 28) {
                    xiaxian = 0.17;
                    shangxian = 0.27;
                  }

                  let obj1 = {
                    connectNulls: true,
                    type: "line",
                    data: [],
                    lineStyle: {
                      color: "#22a6e5",
                      type:'dotted'
                    },
                    name: "增长下限"
                  };
                  this.huanyunDateArr.map((item,index222)=>{
                    this.option.xAxis.data.push(item.zhouname)
                    let td = this.TodayInfo(this.form.gestation,item.zhouvalue)
                      // console.log(item,td,'itemitem333333332222')
                      obj1.data.push({
                        name: item.zhouname,
                        value: !td.week?null:Number(td.week * xiaxian).toFixed(2),
                        symbol: "none",
                        symbolSize:  4,
                        symbolOffset:  ""
                    })
                  })
                  // data.data.map(item => {
                  //   let td = this.TodayInfo(
                  //     this.form.gestation,
                  //     item.valuetime
                  //   );

                  //   obj1.data.push({
                  //     name: item.indicatorvalue,
                  //     value: !td.week
                  //       ? null
                  //       : Number(td.week * xiaxian).toFixed(2),
                  //     symbol: "none",
                  //     symbolSize: 4,
                  //     symbolOffset: ""
                  //   });
                  // });
                  this.option.series.push(obj1);
                  let obj2 = {
                    connectNulls: true,
                    type: "line",
                    data: [],
                    lineStyle: {
                      color: "#22e531",
                      type:'dotted'
                    },
                    name: "增长上限"
                  };
                  this.huanyunDateArr.map((item,index333)=>{
                    let td = this.TodayInfo(this.form.gestation,item.zhouvalue)
                    obj2.data.push({
                      name: item.zhouname,
                      value: !td.week?null:Number(td.week * shangxian).toFixed(2),
                      symbol: "none",
                      symbolSize:  4,
                      symbolOffset:  ""
                    })
                  })
                  // data.data.map(item => {
                  //   let td = this.TodayInfo(
                  //     this.form.gestation,
                  //     item.valuetime
                  //   );
                  //   obj2.data.push({
                  //     name: item.indicatorvalue,
                  //     value: !td.week
                  //       ? null
                  //       : Number(td.week * shangxian).toFixed(2),
                  //     symbol: "none",
                  //     symbolSize: 4,
                  //     symbolOffset: ""
                  //   });
                  // });
                  this.option.series.push(obj2);
                }
              } else {
                let obj3 = {
                  connectNulls: true,
                  type: "line",
                  data: [],
                  name: this.indicatorname,
                  lineStyle: {
                    color: "#41b396"
                  }
                };
                data.data.map(item => {
                  var s = item.valuetime.split(" ")[0].split("-");
                  this.option.xAxis.data.push(`${s[1]}-${s[2]}`);
                  // this.option.xAxis.data.push(item.valuetime.split(" ")[0]);
                  if (indicatorname == "体重") {
                    obj3.data.push({
                      name: item.indicatorvalue,
                      value: (item.indicatorvalue + this.form.weight).toFixed(
                        2
                      ),
                      symbol: "none",
                      symbolSize: 4,
                      symbolOffset: ""
                    });
                  } else {
                    obj3.data.push({
                      name: item.indicatorvalue,
                      value: item.indicatorvalue,
                      symbol: "none",
                      symbolSize: 4,
                      symbolOffset: ""
                    });
                  }
                });
                this.option.series.push(obj3);
              }
            }
          }
          if (data.data.length != 0 && this.m.weight) {
            var weight = this.m.weight
            this.m.bianhua =
              (data.data[data.data.length - 1].indicatorvalue - this.m.weight).toFixed(2);
            this.m.bmi = (
              Number(weight) /
              ((this.m.stature / 100) * (this.m.stature / 100))
            ).toFixed(2);
            if(isNaN(this.m.bmi)){
              this.m.bmi = ''
            }else if(!this.m.bmi){
              this.m.bmi = ''
            }
            this.m = JSON.parse(JSON.stringify(this.m));
            this.BMISTATUS(this.m.bmi);
          }

          this.$nextTick(() => {
            var myChart = echarts.init(document.getElementById("main"));
            myChart.setOption(this.option);
          });
        }
      });
    },
    guanbi() {
      this.$emit("callback", true);
    },
    BMISTATUS(num) {
      if (num < 18.5) {
        this.status = 1;
      } else if (num < 24) {
        this.status = 2;
      } else if (num < 28) {
        this.status = 3;
      } else {
        this.status = 4;
      }
    }
  }
};
</script>
<style lang='less' src='./svg.less' scoped>
</style>