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
    <van-action-sheet v-model="show" cancel-text="取消" :actions="actions" @select="onSelect" />
    <div class="imessage-div">
      <label for>体重</label>
      <input type="text" v-model="weight" placeholder="请输入体重(kg)" />
    </div>
    <div class="imessage-div">
      <label for>BMI</label>
      <input type="text" disabled v-model="BMI" placeholder="自动计算BMI" />
    </div>
    <div class="imessage-div">
      <label for>妊娠开始时间</label>
      <div style="float: right;width: 69%;font-size: 13px;height: 100%;" @click="refA">{{gestation}}</div>
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
      actions: [{ name: "男" }, { name: "女" }],
      show: false,
      age: "",
      pickerVisible: new Date(),
      phone: "",
      registerIf: false,
      sex: "",
      stature: "",
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
    }
  },
  methods: {
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
    refA() {
      this.$refs.picker.open();
    },
    onSelect(res) {
      this.sex = res.name;
      this.show = false;
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
    ismgregisterRout() {
      if (
        (!this.name ||
          !this.sex ||
          !this.stature ||
          !this.weight ||
          !this.BMI ||
          !this.age ||
          !this.gestation ||
        !this.phone)
      ) {
        return MessageBox.alert("请输入全部内容！");
      }
      if (this.phone.length !== 11) {
        return MessageBox.alert("请填写正确电话号码！");
      }
      sessionStorage.linshi = JSON.stringify(this.$data);
      this.$router.push({
        path: "/ismgregister"
      });
    }
  },
  components: {
    [ActionSheet.name]: ActionSheet,
    [DatetimePicker.name]: DatetimePicker
  },
  async mounted() {
    this.end = this.getNowFormatDate()
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
        res.data.forEach(s => {
          this[s.dataname] = s.datavalue;
        });
      }
    });
  }
};
</script>
<style lang='less' src='./index.less' scoped>
</style>
