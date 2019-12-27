<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zhang Zi Fang
 * @Date: 2019-09-24 08:58:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-19 13:54:39
 -->
<template>
  <div class="everydayKa" v-wechat-title="title">
    <div class="title">
      <div @click="subYear()">
        <van-icon name="arrow-left" />
      </div>
      <p>{{dataYear}}年{{nowMonth + 1}}月</p>
      <div @click="addYear()">
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="calendar">
      <span>日</span>
      <span>一</span>
      <span>二</span>
      <span>三</span>
      <span>四</span>
      <span>五</span>
      <span>六</span>
    </div>
    <div class="calendar-date">
      <div
        @click="indexSelectClick(item,index)"
        :class="indexSelectClss(item,index)"
        :key="index"
        v-for="(item,index) in months_day"
      >
        <p>{{item.date}}</p>
        <div>
          <!-- <img
            v-if="item.tizhon && item.tizhon > tizhon.shang"
            src="/static/images/shanglanse.png"
            alt
          />-->
          <!-- <img v-if="item.tizhon && item.tizhon < tizhon.xia" src="/static/images/xialanse.png" alt />
          <img v-if="itemMax(item)" src="/static/images/shanghuangse.png" alt />-->
          <img
            v-if="item.pushstatus == 1 && item.nutritiontips"
            src="/static/images/adf810fa28a2c715fb22a6cab768db5.png"
            alt
          />
          <img
            v-if="item.pushstatus == 1"
            src="/static/images/56f21a70c02a18cb9ce748862e75cae.png?1"
            alt
          />
        </div>
      </div>
    </div>
    <!-- <p class="img-title">
      <img src="/static/images/shanglanse.png" alt /> 体重偏高
      <img src="/static/images/xialanse.png" alt />体重偏低
      <img src="/static/images/shanghuangse.png" alt />血糖偏高
      <img src="/static/images/xiahuangse.png" alt />血糖偏低
    </p>-->
    <p class="img-title">
      <img src="/static/images/adf810fa28a2c715fb22a6cab768db5.png" alt /> 营养小贴士
      <img src="/static/images/56f21a70c02a18cb9ce748862e75cae.png?1" alt />
      配餐完成
      <span
        style="float: right;margin-right: 11px;"
        @click="$router.push({path:'myAdvice'})"
      >
        <!-- <img style="width: 15px;margin-right: 4px;" src="static/images/fwefwe.png" alt />我要咨询 -->
      </span>
    </p>
    <p
      v-for="(item,index) in msg"
      :key="index"
      :class="tizhoIndex === index ? 'liSelect' : 'li'"
      @click="itemClick(item,index)"
    >
      {{item.indicatorname}}
      <span v-if="!$route.query.userid" style="position: relative;top: 2px;">
        <van-icon name="arrow" />
      </span>
      <span
        style="margin-right: 17px;color:rgba(153,153,153,1);"
        v-if="item.id !== 11"
        :class="itemMsg(item)"
      >{{item.msg ? item.msg.indicatorvalue + item.unit : $route.query.userid?(item.id == 15 ? '' : '未录入'):'请录入'}}</span>
      <button class="qushitu" v-if="itQUshitu(item)" @click.stop="qushitu(item)">趋势图</button>
    </p>
    <div v-if="show" class="show" @click="show = false">
      <div @click.stop class="showdiv">
        <div class="weibu">请输入{{itemValue.indicatorname}}</div>
        <van-field
          class="jujiao"
          type="number"
          v-model="value"
          :disabled="$route.query.userid"
          placeholder="请输入值"
        >
          <div slot="label">{{itemValue.indicatorname}}({{itemValue.unit}})</div>
        </van-field>
        <van-button class="queding" @click="goClick" v-if="!$route.query.userid" type="primary">保存</van-button>
      </div>
    </div>
    <p v-if="nutritiontips" style="font-size: 12px;color: #333;text-indent: 10px;">
      <span style="display: block;margin-top: 12px;margin-bottom: 3px;">
        <img src="/static/images/adf810fa28a2c715fb22a6cab768db5.png" alt />
        <span style="margin-left: 5px;font-size: 15px;font-weight: 800;">营养小贴士</span>
      </span>
      <span class="nutritiontips">{{nutritiontips}}</span>
    </p>
    <!-- 当天是否有摄入食物 -->
    <div v-if="intakeIf" class="show" @click="intakeIf = false">
      <div @click.stop class="showdiv">
        <p class="showdiv-title">额外摄入食物清单</p>
        <van-swipe indicator-color="white">
          <van-swipe-item :key="index" v-for="(item,index) in listMain">
            <img
              class="gunbifew"
              @click="imgClickdelect(index)"
              src="/static/images/gunbifew.png"
              alt
            />
            <van-field
              readonly
              v-model="item.value"
              class="inputSch border0"
              label="食物名称："
              placeholder
            />
            <van-field
              readonly
              type="number"
              class="inputSch border0"
              v-model="item.weight"
              label="重量  (g) ："
              placeholder
            />
            <div class="imgse" style="margin-top:0px;">
              <img @click="ImagePreview(item.img)" :src="item.img" alt />
            </div>
          </van-swipe-item>
        </van-swipe>
        <div class="br"></div>
        <div v-if="!$route.query.userid">
          <!-- <p class="showdiv-add" @click="goClick">
            <img src="/static/images/efwafw.png" alt /> 添加
          </p>-->
          <van-field v-model="value" class="inputSch" label="食物名称：" placeholder="请输入食物名称" />
          <van-field
            type="number"
            class="inputSch"
            v-model="weight"
            label="重量  (g) ："
            placeholder="请输入食物重量"
          />
          <div v-if="img[0]" class="imgse" @click="shangchu">
            <img :src="img[0].url" alt />
          </div>
          <div v-else class="imgse fwaefw" @click="shangchu">
            <img src="/static/images/gwgewgwe.png" style="width:21px;height:21px" alt />
            <p>点击添加食物照片</p>
          </div>
          <van-uploader
            v-model="img"
            ref="refUp"
            style="margin-top:10px;display:none;"
            :after-read="afterRead"
            :before-read="donhua"
          />
        </div>
        <div class="butList">
          <button @click="goClick">添加</button>
          <button v-if="!$route.query.userid" @click="intakeIf = false">返回</button>
        </div>
      </div>
    </div>
    <!-- 血糖 -->
    <div v-if="bloodIf" class="show" @click="bloodIf = false">
      <div @click.stop class="showdiv">
        <div class="weibu">血糖</div>
        <van-field
          :label="item.indicatorname + '：'"
          type="number"
          :key="index"
          v-for="(item,index) in xuetang"
          v-model="item.value"
          :disabled="$route.query.userid"
          placeholder
          class="jujiao"
        >
          <div slot="button">
            <button
              class="qushitu"
              style="margin-right: 0px;margin-top: 1px;margin-left: 10px;"
              @click.stop="qushitu(item)"
            >趋势图</button>
            {{item.unit}}
          </div>
        </van-field>
        <p class="jingshi" v-if="jinggao">
          <img src="/static/images/jingshi.png" alt />
          输入值{{namejinggao}}正常范围请检查
        </p>
        <van-button class="queding" @click="goClick" v-if="!$route.query.userid" type="primary">保存</van-button>
      </div>
    </div>
    <!-- 患者的svg弹框 -->
    <button class="button" @click="$router.go(-1)">{{$route.query.userid ? '返回' : '确定'}}</button>
    <div is="canvas-svg" @callback="callback" v-if="canvas"></div>
  </div>
</template>
<script>
import {
  Icon,
  Field,
  Button,
  Collapse,
  CollapseItem,
  Uploader,
  Swipe,
  ImagePreview,
  SwipeItem,
  Toast
} from "vant";
import { Indicator, MessageBox } from "mint-ui";
import svg from "./svg";
export default {
  name: "everydayKa",
  data() {
    return {
      listMain: [
        {
          value: "",
          weight: ""
        }
      ],
      canvas: false,
      bloodIf: false,
      intakeIf: false,
      title: "",
      activeNames: 0,
      show: false,
      weight: "",
      nutritiontips: "",
      value: "",
      nowMonth: "",
      tizhoIndex: "",
      dataYear: "",
      msg: [],
      indexSelect: "",
      itemCity: {},
      xuetangQian: {},
      namejinggao: "",
      xuetang: [],
      xuetangValue: [],
      jinggao: false,
      cityTIme: "",
      xuetangHou: {},
      tizhon: {},
      itemValue: "",
      tzuint: "",
      xtuint: "",
      xuetangMin: "",
      delectTrue: false,
      userid: "",
      months_day: [], //定义临时的数组保存判断后的月份
      month_olypic: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], //闰年每个月份的天数,
      img: []
    };
  },
  filters: {},
  components: {
    [Icon.name]: Icon,
    [Field.name]: Field,
    [Button.name]: Button,
    [svg.name]: svg,
    [Collapse.name]: Collapse,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [CollapseItem.name]: CollapseItem,
    [Uploader.name]: Uploader
  },
  async mounted() {
    Toast.setDefaultOptions({ duration: 1500 });
    this.userid = this.$route.query.userid;
    if (this.userid) {
      this.title = "患者信息";
    } else {
      this.title = "每日打卡";
    }
    this.cityTIme = this.getNowFormatDate();
    // 获取每个的最大值等
    this.everydayCalMax();
    this.dataFun({});
    var riqiList = [];
    this.months_day.filter(s => riqiList.push(s.value));
    this.quxianTarget({ riqiList });
  },
  watch: {
    itemValue() {
      this.showIF();
    },
    indexSelect() {
      this.showIF();
    }
  },
  methods: {
    shangchu() {
      var input = document.querySelector('[type="file"]');
      input.click();
    },
    imgClickdelect(index) {
      this.listMain.splice(index, 1);
      var yue = this.months_day[this.indexSelect].date;
      var ri = Number(this.nowMonth) + 1;
      this.recordCal({ value: JSON.stringify(this.listMain), ri, yue });
    },
    compressImg(base64, scale, callback) {
      const img = new Image();
      img.src = base64;
      img.onload = function() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.setAttribute("width", this.width);
        canvas.setAttribute("height", this.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 转成base64 文件
        let base64 = canvas.toDataURL("image/jpeg");
        // 根据自己需求填写大小 我的目标是小于3兆
        base64 = canvas.toDataURL("image/jpeg", scale);
        // baser64 TO blob 这一块如果不懂可以自行百度，我就不加注释了
        const arr = base64.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bytes = atob(arr[1]);
        const bytesLength = bytes.length;
        const u8arr = new Uint8Array(bytesLength);
        for (let i = 0; i < bytes.length; i++) {
          u8arr[i] = bytes.charCodeAt(i);
        }
        const blob = new Blob([u8arr], { type: mime });
        // 回调函数 根据需求返回二进制数据或者base64数据，我的项目都给返回了
        callback(base64);
      };
    },
    donhua(res) {
      Indicator.open({
        text: "上传中...",
        spinnerType: "fading-circle"
      });
      return true;
    },
    afterRead(res) {
      if (res.length == undefined) {
        this.compressImg(res.content, 0.3, base64 => {
          res.content = base64;
          this.imgAdd(res, res.file.name);
        });
      } else {
        res.forEach((element, index) => {
          this.compressImg(res.content, 0.3, base64 => {
            res.content = base64;
            this.imgAdd(element, element.file.name, index);
          });
        });
      }
    },
    imgAdd(res, name, index) {
      this.$http({
        url: "/bjyyq/api/imgAdd",
        data: {
          base_64: res.content,
          name: name.split(",")
        },
        success: resCl => {
          // 获取当前是哪个图片 根据base64判断
          this.img.splice(0, 1);
          this.img.push({
            url: sessionStorage.img + resCl.url
          });
          this.img = JSON.parse(JSON.stringify(this.img));
          Indicator.close();
        }
      });
    },
    itQUshitu(item) {
      if (!this.$route.query.userid && item.id === 12) {
        return true;
      } else if (this.$route.query.userid && item.id === 12) {
        return true;
      }
      return false;
    },
    qushitu(item) {
      var id = item.id;
      if (item.id === 12) {
        id = 8;
      }
      var callback = `id=${id}`;
      if (this.$route.query.userid) {
        callback += `&userid=${this.$route.query.userid}`;
      }
      this.$router.push({ path: "/svg?" + callback });
    },
    callback() {
      this.canvas = false;
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
    itemMsg(item) {
      if (item.msg && item.remark1) {
        var [, msg] = item.remark1.split("-");
        if (Number(item.msg.indicatorvalue) > Number(msg)) {
          // return "red";
        }
      }
    },
    itemMin(item) {
      // 餐后血糖
      if (item.houmin && item.houmin < this.xuetangHou.min) {
        return true;
      } else if (item.min && item.min < this.xuetangQian.min) {
        // 餐前血糖
        return true;
      }
      return false;
    },
    itemMax(item) {
      // 餐后血糖
      if (item.houmax && item.houmax > this.xuetangHou.max) {
        return true;
      } else if (item.max && item.max > this.xuetangQian.max) {
        // 餐前血糖
        return true;
      }
      return false;
    },
    indexSelectClick(item, index) {
      if (item.className === "flag") {
        return;
      }
      this.tizhoIndex = "";
      this.itemValue = "";
      this.nutritiontips = item.pushstatus == 1 && item.nutritiontips;
      this.indexSelect = index;
      this.itemCity = item;
      var yue = this.months_day[this.indexSelect].date;
      var ri = Number(this.nowMonth) + 1;
      this.everydayCal(
        `${this.dataYear}-${ri < 10 ? "0" + ri : ri}-${
          yue < 10 ? "0" + yue : yue
        }`
      );
    },
    ImagePreview(src) {
      src && ImagePreview([src]);
    },
    itemClick(item, index) {
      if (
        this.$route.query.userid &&
        (item.id === 13 || item.id === 12 || item.id === 14)
      ) {
      } else {
        // 食物说明 暂无数据
        if (
          this.$route.query.userid &&
          item.id === 11 &&
          this.listMain.length === 0
        ) {
          return;
        }
        this.tizhoIndex = index;
        this.itemValue = "";
        this.$nextTick(() => {
          this.itemValue = item;
        });
      }
    },
    showIF() {
      if (this.tizhoIndex !== "") {
        this.value =
          this.msg[this.tizhoIndex].msg &&
          this.msg[this.tizhoIndex].msg.indicatorvalue;
      }
      if ((this.indexSelect || this.indexSelect === 0) && this.itemValue) {
        if (this.itemValue.id === 11) {
          this.value = "";
          this.intakeIf = true;
        } else if (this.itemValue.id === 15) {
          this.bloodIf = true;
        } else {
          this.show = true;
        }

        this.$nextTick(() => {
          var tizhon = document.querySelector(".jujiao input");
          if (tizhon) {
            tizhon.click();
            tizhon.focus();
          }
        });
      }
    },
    indexSelectClss(item, index) {
      if (this.indexSelect === index) {
        if (item.className === "dangtian") {
          // 当天的
          return "dangtian selectIndex";
        }
        return "selectIndex";
      } else {
        return item.className;
      }
    },
    goClick() {
      // 进行深拷贝
      var vs = "";
      var value = this.value;
      // 当天是否有摄入驶入判断
      if (this.itemValue.id === 11) {
        // 判断最后一个是否为空 然后删除
        if (!this.weight && !this.value) {
          return Toast("请输入食物名称与重量!");
        }
        this.listMain.push({
          weight: this.weight,
          value: this.value,
          img: this.img[0] && JSON.parse(JSON.stringify(this.img[0].url))
        });
        vs = JSON.parse(JSON.stringify(this.listMain));
        value = JSON.stringify(vs);
        this.weight = "";
        this.img = [];
        // this.intakeIf = false;
      } else if (this.itemValue.id === 15) {
        var itemValue = {};
        // var jixu = true;
        // this.xuetang.forEach(s => {
        //   var { ymin, ymax } = s;
        //   if (isNaN(Number(s.value))) {
        //     this.namejinggao = s.indicatorname + "低于";
        //     jixu = false;
        //     return (this.jinggao = true);
        //   }
        //   if (Number(s.value) > ymax) {
        //     this.namejinggao = s.indicatorname + "超出";
        //     jixu = false;
        //     return (this.jinggao = true);
        //   }
        //   if (Number(s.value) < ymin) {
        //     this.namejinggao = s.indicatorname + "低于";
        //     jixu = false;
        //     return (this.jinggao = true);
        //   }
        // });
        // if (!jixu) {
        //   return;
        // }
        var list = [];
        this.xuetang.forEach(s => {
          if (!s.value) {
            return;
          }
          list.push({
            id: s.id,
            value: s.value
          });
        });
        this.bloodIf = false;
        value = list;
      } else {
        if (!this.value) {
          return MessageBox("提示", "请输入内容");
        }
        this.show = false;
      }
      var yue = this.months_day[this.indexSelect].date;
      var ri = Number(this.nowMonth) + 1;
      this.recordCal({ value, ri, yue });
    },
    recordCal({ value, ri, yue }) {
      var id = this.itemValue.id;
      if (id === 12) {
        id = 8;
      }
      this.$http({
        url: "/bjyyq/api/recordCal",
        data: {
          id: id,
          userid: this.userid,
          value: value || "",
          valuetime: `${this.dataYear}-${ri < 10 ? "0" + ri : ri}-${
            yue < 10 ? "0" + yue : yue
          }`
        },
        success: res => {
          var riqiList = [];
          this.months_day.filter(s => riqiList.push(s.value));
          this.quxianTarget({ riqiList });
          this.everydayCal(
            `${this.dataYear}-${ri < 10 ? "0" + ri : ri}-${
              yue < 10 ? "0" + yue : yue
            }`
          );
          if (this.itemValue.id === 15) {
            Toast("保存成功");
          }
          this.value = "";
          this.tizhoIndex = "";
        }
      });
    },
    everydayCalMax(res) {
      this.$http({
        url: "/bjyyq/api/everydayCalMax",
        data: {
          userid: this.userid
        },
        success: res => {
          var qian = res.data.xuetang[0].paramvalue.split("-");
          var hou = res.data.xuetang[1].paramvalue.split("-");
          this.xuetangHou = {
            min: hou[0],
            max: hou[1]
          };
          this.xuetangQian = {
            min: qian[0],
            max: qian[1]
          };
          this.tizhon = JSON.parse(JSON.stringify(res.data.tizhon));
          this.months_day = JSON.parse(JSON.stringify(this.months_day));
        }
      });
    },
    quxianTarget({ riqiList, id }) {
      this.$http({
        url: "/bjyyq/api/quxianTarget",
        data: {
          riqiList: riqiList,
          userid: this.userid
        },
        success: res => {
          var set = setInterval(() => {
            // 先判断是否有底部的数据
            if (this.msg.length != 0) {
              clearInterval(set);
              this.months_day.forEach(s => {
                if (res.data.filter(v => v.orderdate === s.value).length != 0) {
                  var v = res.data.filter(v => v.orderdate === s.value)[0];
                  s.nutritiontips = v.nutritiontips;
                  s.pushstatus = v.pushstatus;
                }
              });
              this.months_day = JSON.parse(JSON.stringify(this.months_day));
            }
          }, 50);
        }
      });
    },
    everydayCal(valuetime = "") {
      this.$http({
        url: "/bjyyq/api/everydayCal",
        data: {
          valuetime: valuetime,
          userid: this.userid,
          type: "新内容" //新的
        },
        success: res => {
          var data = res.data.msg;
          this.msg = res.data.msg;
          this.msg.filter(s => {
            if (s.id === 11) {
              if (s.msg && JSON.parse(s.msg.indicatorvalue).length != 0) {
                this.listMain = JSON.parse(s.msg.indicatorvalue);
              } else {
                this.listMain = [];
              }
            }
          });
        }
      }).then(s => {
        this.$http({
          url: "/bjyyq/api/everydayCal",
          data: {
            valuetime: valuetime,
            userid: this.userid,
            type: "" //新的
          },
          success: res => {
            var v = res.data.msg.filter(s => s.indicatorname.includes("血糖"));
            v.filter(s => (s.value = s.msg && s.msg.indicatorvalue));
            // var p = v.pop();
            // v.unshift(p);
            this.xuetang = v;
          }
        });
      });
    },
    subYear() {
      if (this.nowMonth == 0) {
        this.dataYear -= 1;
        this.nowMonth = 11;
      } else {
        this.nowMonth -= 1;
      }
      this.dataFun({
        my_monthProps: this.nowMonth,
        my_yearProps: this.dataYear
      });
      var riqiList = [];
      this.months_day.filter(s => riqiList.push(s.value));
      this.quxianTarget({ riqiList });
    },
    addYear(dataYear) {
      if (this.nowMonth == 11) {
        this.dataYear += 1;
        this.nowMonth = 1;
      } else {
        this.nowMonth += 1;
      }
      this.dataFun({
        my_monthProps: this.nowMonth,
        my_yearProps: this.dataYear
      });
      var riqiList = [];
      this.months_day.filter(s => riqiList.push(s.value));
      this.quxianTarget({ riqiList });
    },
    dataFun({ my_yearProps, my_monthProps = "" }, selectZlsId) {
      this.months_day = [];
      //获取当天的年月日
      var my_date = new Date();
      var my_year = this.dataYear || my_date.getFullYear(); //获取年份
      this.dataYear = my_year; //赋值回去。
      var my_month = my_monthProps !== "" ? my_monthProps : my_date.getMonth(); //获取月份，一月份的下标为0
      this.nowMonth = my_month;
      var my_day = my_date.getDate(); //获取当前日期
      var datas = "";
      if (my_year % 4 == 0 && my_year % 100 !== 0) {
        datas = this.month_olypic[my_month];
      } else {
        datas = this.month_olypic[my_month];
      }
      for (var i = 0; i < datas; i++) {
        var date = i + Number(1);
        var value =
          my_year +
          "-" +
          (my_month + Number(1) < 10
            ? "0" + (my_month + Number(1))
            : my_month + Number(1)) +
          "-" +
          (Number(i) + 1 < 10 ? "0" + (Number(i) + 1) : Number(i) + 1);

        this.months_day.push({ value, peopleList: [], date: date });
      }

      var year = my_year,
        month = my_month,
        date = my_day; //  保存当前是几号
      var dt = new Date(year, month, 1);
      var dtGetDay = dt.getDay(); //判断每个月的一号是礼拜几
      var oldMonth = my_month == 0 ? 11 : my_month - 1;
      var newDatas = "";
      if (my_year % 4 == 0 && my_year % 100 !== 0) {
        newDatas = this.month_olypic[oldMonth];
      } else {
        datas = this.month_olypic[my_month];
      }
      var qinariq = this.month_olypic[this.nowMonth + 1] || 31;
      // 获取下一月是几号
      for (var i = 0; i < dtGetDay; i++) {
        var date = Number(qinariq) - i;
        var value =
          my_year +
          "-" +
          (my_month < 10 ? "0" + my_month : my_month) +
          "-" +
          (Number(date) < 10 ? "0" + Number(date) : Number(date));

        this.months_day.unshift({
          value,
          className: "flag",
          peopleList: [],
          date
        });
      }
      var index = this.months_day.length % 7;
      if (index) {
        for (let i = 0; i < 7 - index; i++) {
          var date = `${i + 1}`;
          var value = `${my_year}-${
            my_month + 2 < 10 ? "0" + (my_month + 2) : my_month + 2
          }-${i + 1 < 10 ? "0" + (i + 1) : i + 1}`;

          this.months_day.push({
            value: value,
            className: "flag",
            peopleList: [],
            date
          });
        }
      }
      // 当天日期的数据
      this.months_day.forEach((s, index) => {
        if (s.value === this.cityTIme) {
          s.className = "dangtian";
          this.indexSelectClick(s, index);
        }
      });
    }
  }
};
</script>

<style lang='less' src='./index.less' scoped>
</style>
<style lang="less">
.showdiv .van-cell {
  padding: 5px 11px;
  font-size: 12px;
}
.showdiv .van-field__label {
  width: 2rem;
}
.showdiv {
  span {
    text-align: right;
    display: inline-block;
  }
}
.van-swipe-item {
  padding-bottom: 8px;
}
.inputSch {
  padding-left: 0 !important;
  border-bottom: 1px solid #e8dfdf !important;
  width: 94%;
  margin: 0 auto;
  .van-cell {
    font-size: 13px;
    color: #666;
  }
}
.border0 {
  border-bottom: 0px solid #fff !important;
}
.border0:after {
  border-bottom: none !important;
}
#app .van-swipe__indicator--active {
  background-color: #666 !important;
}
.van-swipe__indicator {
  position: relative;
  top: 11px;
  background-color: #999 !important;
}
.everydayKa .van-icon-arrow,
.everydayKa .van-icon-arrow-left {
  position: relative;
  top: 2px;
}
</style>