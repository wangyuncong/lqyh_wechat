<!--
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2019-09-10 17:49:49
 * @LastEditors: 
 * @LastEditTime: 2019-12-19 16:18:17
 -->
<template>
  <div class="imessage">
    <div class="imessage-div">
      <label for>姓名</label>
      <input type="text" v-model="name" placeholder="请输入您的姓名" />
    </div>
    <div class="imessage-div">
      <label for>电话</label>
      <input type="text" v-model="phone" placeholder="请输入您的电话" />
    </div>
    <div class="imessage-div" @click="show = !show">
      <label for>性别</label>
      <input type="text" readonly v-model="sex" placeholder="请选择性别" />
    </div>
    <div class="imessage-div">
      <label for>年龄</label>
      <input type="text" v-model="age" placeholder="请输入年龄" />
    </div>
    <div class="imessage-div">
      <label for>身高</label>
      <input type="text" v-model="stature" placeholder="请输入身高(cm)" />
    </div>
    <div class="imessage-div" v-if="sex === '女'" @click="huanyunshow1 = true">
      <label for>是否怀孕</label>
      <div style="float: right;width: 78%;font-size: 13px">{{huanyun}}</div>
    </div>
    <van-action-sheet
      v-model="huanyunshow1"
      cancel-text="取消"
      :actions="lactoseList"
      @select="huanyunshow1onSelect1"
    />
    <van-action-sheet v-model="show" cancel-text="取消" :actions="actions" @select="onSelect" />
    <div class="imessage-div">
      <label for>体重</label>
      <input type="text" v-model="weight" :placeholder="sex === '女' ? '孕前体重(kg)' : '体重(kg)'" />
    </div>
    <div class="imessage-div">
      <label for>BMI</label>
      <input type="text" disabled v-model="BMI" placeholder="自动计算BMI" />
      <span style="position: absolute;right: 17px;">{{Sexname}}</span>
    </div>
    <div class="imessage-div" v-if="sex === '女' && huanyun === '是'">
      <label for>妊娠开始时间</label>
      <div style="float: right;width: 69%;font-size: 13px;height: 100%;" @click="refA">{{gestation}}</div>
    </div>
    <!-- <div class="imessage-div" @click="show1 = !show1">
      <label for>是否存在乳糖不耐受</label>
      <input style="width: 59%;" type="text" disabled v-model="lactose" placeholder />
    </div>-->
    <div class="qitmanxing" :key="indexs" v-for="(items,indexs) in jiankangList">
      <div class="imessage-div" style="border-bottom: 1px solid #eee;">
        <label style="margin-left:0px" for>{{items.kindname}}</label>
        <input style=" width: 82%;" type="text" disabled :value="items.kinddesc" />
      </div>
      <span
        :key="index"
        :class="item.select ? 'rq' : ''"
        @click="itemClick(item)"
        v-for="(item,index) in items.children"
      >{{item.kindname}}</span>
      <div class="imessage-div" style="border-bottom: 1px solid #eee;">
        <label style="margin-left:0px" for>其他</label>
        <input style=" width: 82%;" type="text" v-model="items.value" placeholder="如有其他请补充！" />
      </div>
    </div>
    <div style="padding-bottom: 66px;background:#fff;"></div>
    <van-action-sheet v-model="show1" cancel-text="取消" :actions="lactoseList" @select="onSelect1" />
    <mt-datetime-picker
      v-model="pickerVisible"
      type="date"
      ref="picker"
      year-format="{value} 年"
      month-format="{value} 月"
      @confirm="handleConfirm"
      date-format="{value} 日"
    ></mt-datetime-picker>
    <button @click="ismgregisterRout">保存并继续下一步</button>
  </div>
</template>
<script>
import { MessageBox, DatetimePicker } from "mint-ui";
import { ActionSheet } from "vant";
export default {
  name: "imessage",
  data() {
    return {
      gestation: "",
      name: "",
      lactoseList: [{ name: "是" }, { name: "否" }],
      actions: [{ name: "女" }, { name: "男" }],
      show: false,
      huanyunshow1: false,
      age: "",
      show1: false,
      pickerVisible: new Date(),
      phone: "",
      registerIf: false,
      huanyun: "是",
      sex: "女",
      stature: "",
      Sexname: "正常",
      lactose: "否",
      jiankang: "",
      xuqiu: [],
      jiankangList: [],
      jiankangIndex: 0,
      weight: "",
      BMI: ""
    };
  },
  watch: {
    stature() {
      this.BMIFun();
    },
    weight() {
      this.BMIFun();
    },
    BMI(num) {
      if (num < 18.5) {
        this.Sexname = "过轻";
      } else if (num < 24) {
        this.Sexname = "正常";
      } else if (num < 28) {
        this.Sexname = "超重";
      } else {
        this.Sexname = "肥胖";
      }
    }
  },
  methods: {
    jiangkang(item, index) {
      this.jiankangIndex = index;
      this.xuqiu = item.children;
      this.xuqiu.forEach(s => {
        s.select = false;
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
    huanyunshow1onSelect1(res) {
      this.huanyun = res.name;
      this.huanyunshow1 = false;
    },
    refA() {
      this.$refs.picker.open();
    },
    onSelect(res) {
      this.sex = res.name;
      this.show = false;
    },
    onSelect1(res) {
      this.lactose = res.name;
      this.show1 = false;
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
      this.gestation = currentdate;
    },
    BMIFun() {
      if (this.stature && this.weight) {
        this.BMI = (
          Number(this.weight) /
          ((this.stature / 100) * (this.stature / 100))
        ).toFixed(2);
      }
    },
    baocun() {
      var {
        name,
        sex,
        stature,
        weight,
        BMI,
        age,
        phone,
        lactose,
        huanyun,
        gestation
      } = JSON.parse(sessionStorage.linshi);
      var data = {
        name,
        sex,
        stature,
        huanyun,
        weight,
        BMI,
        lactose,
        age,
        chooseOther: "",
        phone,
        gestation
      };
      var jiankangListV = {};
      var chooseOther = [];
      this.jiankangList.forEach(s => {
        var v = s.children.filter(v => v.select);
        var value = [];
        data[`${s.remark2}input`] = s.value;
        v.forEach(b => {
          value.push(b.id);
          chooseOther.push(b.id);
        });
        value = value.toString(",");
        jiankangListV[s.remark2] = value;
      });
      data.chooseOther = chooseOther.toString(",");
      Object.keys(jiankangListV).forEach(s => {
        data[s] = jiankangListV[s];
      });
      this.$http({
        url: "/bjyyq/api/infoAdd",
        data,
        success: res => {}
      });
    },
    itemClick(item) {
      item.select = !item.select;
      this.jiankangList = JSON.parse(JSON.stringify(this.jiankangList));
    },
    ismgregisterRout() {
      if (
        !this.name ||
        !this.sex ||
        !this.stature ||
        !this.weight ||
        !this.BMI ||
        !this.age ||
        !this.phone
      ) {
        if (this.sex === "女" && !this.gestation) {
          return MessageBox.alert("请输入全部内容！");
        }
      }
      if (this.phone.length !== 11) {
        return MessageBox.alert("请填写正确电话号码！");
      }
      sessionStorage.linshi = JSON.stringify(this.$data);
      var callback = "";
      if (this.$route.query.go) {
        callback = `go=${this.$route.query.go}`;
      }
      this.baocun();
      if (this.$route.query.go) {
        return this.$router.go(-1);
      }
      this.$router.push({
        path: "/ismgregister?" + callback
      });
    }
  },
  components: {
    [ActionSheet.name]: ActionSheet,
    [DatetimePicker.name]: DatetimePicker
  },
  async mounted() {
    this.end = this.getNowFormatDate();
    if (sessionStorage.linshi) {
      var linshi = JSON.parse(sessionStorage.linshi);
      Object.keys(linshi).forEach(s => {
        this[s] = linshi[s];
      });
    }
    this.$http({
      url: "/bjyyq/api/getSetInfo",
      data: {},
      success: res => {
        var resList = res.data;
        res.data.forEach(s => {
          this[s.dataname] = s.datavalue;
        });
        this.$http({
          url: "/bjyyq/apimg/getHealthKindList",
          method: "get",
          data: {
            flag: 2
          },
          success: res => {
            this.jiankangList = res.data;
            this.jiankangList.forEach(v => {
              if (
                resList.filter(s => s.dataname === `${v.remark2}input`).length
              ) {
                v.value = resList.filter(
                  s => s.dataname === `${v.remark2}input`
                )[0].datavalue;
              }
              if (this[v.remark2]) {
                var value = this[v.remark2].split(",");
                value.forEach(s => {
                  v.children.filter(b => (b.id == s ? (b.select = true) : ""));
                });
              }
            });
            this.jiankangList = JSON.parse(JSON.stringify(this.jiankangList));
          }
        });
      }
    });
  }
};
</script>
<style lang='less' src='./index.less' scoped>
</style>
