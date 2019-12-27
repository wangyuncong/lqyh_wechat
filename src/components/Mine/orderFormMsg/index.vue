<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zhang Zi Fang
 * @Date: 2019-09-10 17:49:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-19 15:12:20
 -->
<template>
  <div class="orderFormMsg">
    <div :class="message.msg.length == 1 ? 'prepare' : 'orderFormMsg-dov'">
      <div :class="message.msg.length == 1 ? '' : 'orderFormMsg-dov-div'">
        <div
          class="orderFormMsg-title"
          v-for="item in message.msg"
          :style="message.msg.length == 1 ? 'width: 94%;' : ''"
        >
          <img v-if="item.commodity" :src="item.commodity[0].foodpicsmall | imgFilter" alt />
          <div
            class="orderFormMsg-title-right"
            :style="message.msg.length == 1 ? 'width: 74%;position: relative;top: 2px;' : ''"
          >
            <p v-if="item.commodity" style="margin-top: 0px !important;">
              <span>{{item.commodity[0].foodname}}</span>
              <span
                :class="message.msg.length == 1 ? 'prepare' : 'prepare-merou'"
              >¥{{message.msg.length == 1 ? (realamount | pay) : (Number(item.quantity) * Number(item.commodity[0].foodprice) )| pay}}</span>
            </p>
            <p>下单时间：{{item.createtime}}</p>
            <p v-if="message.msg.length == 1">配餐周期：{{zhouqigo}} - {{zhouqiend}}</p>
            <!-- 数量 -->
            <p v-else>X{{item.quantity}}</p>
            <p style="margin-top: 0px;">备注：{{orderremark || '暂无'}}</p>
          </div>
        </div>
        <div v-if="message.msg.length == 2" style="padding-top: 12px;background: white;">
          <div class="br-se"></div>
          <div class="zone">
            订单总额
            <span>¥{{zone | pay}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="orderFormMsg-nav" v-if="message.msg.length == 1">
      <span @click="dateFcun('front')">前一天</span>
      <span class="span" @click="riqi">
        <img src="/static/images/rili.png" alt />
        {{shijian}}
      </span>
      <span @click="dateFcun('rear')">后一天</span>
    </div>
    <div style="margin-top:15px;" v-if="message.msg.length == 1"></div>
    <mt-datetime-picker
      v-model="pickerVisible"
      type="date"
      :startDate="startDate"
      :endDate="endDate"
      ref="picker"
      year-format="{value} 年"
      month-format="{value} 月"
      @confirm="handleConfirm"
      date-format="{value} 日"
    ></mt-datetime-picker>
    <mt-cell
      class="lianjie"
      title="收货地址"
      @click.native="Hrer"
      is-link
      :value="addrid.area + addrid.addrinfo"
    ></mt-cell>
    <div class="br" v-if="message.msg.length == 1"></div>
    <template v-for="(item,index) in list" v-if="message.msg.length == 1">
      <van-collapse :key="index" v-if="item.list.length != 0" v-model="item.activeNames">
        <van-collapse-item name="1">
          <div slot="title">
            <span style="border-left:3px solid #41b396;padding-left:3px;">{{item.value}}</span>
          </div>
          <p v-for="items in item.list">{{items.msg.menuname}}{{items.menucent}}份</p>
        </van-collapse-item>
      </van-collapse>
    </template>
    <div v-if="message.order_menu_info.length == 0 && message.msg.length == 1" class="zanwucla">
      <template>尚未配餐</template>
    </div>
    <div class="br" v-if="message.order_menu_info.length == 0 && message.msg.length == 1"></div>
    <div class="orderFormMsg-main" :style="message.msg.length == 1 ? '' : 'margin-top: 25px;'">
      <p class="orderFormMsg-main-title" v-if="message.msg.length == 1">处理信息</p>
      <div :key="index" v-for="(item,index) in message.order_action_info">
        <span>
          {{item.time}}
          <br />
          {{item.timeData}}
        </span>
        <img src="/static/images/yuandian.png" alt />
        <p>{{item.actionname}}</p>
        <div v-if="index + 1  != message.order_action_info.length" class="imgbr"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { DatetimePicker } from "mint-ui";
import { Collapse, CollapseItem } from "vant";
export default {
  name: "orderFormMsg",
  data() {
    return {
      shijian: "",
      zhouqigo: "",
      morenFalse: false,
      hertDingdan: "",
      zone: 0,
      addrid: {
        area: "",
        addrinfo: ""
      },
      realamount: 0,
      orderremark: "",
      pay: 0,
      startDate: new Date(),
      endDate: new Date(),
      zhouqiend: "",
      list: [
        {
          value: "早餐",
          list: [],
          activeNames: ["1"]
        },
        {
          value: "上午间餐",
          list: [],
          activeNames: ["1"]
        },
        {
          value: "中餐",
          list: [],
          activeNames: ["1"]
        },
        {
          value: "下午间餐",
          list: [],
          activeNames: ["1"]
        },
        {
          value: "晚餐",
          list: [],
          activeNames: ["1"]
        },
        {
          value: "零食",
          list: [],
          activeNames: ["1"]
        }
      ],
      activeNames: ["1"],
      activeNames1: ["1"],
      activeNames2: ["1"],
      pickerVisible: new Date(),
      message: {
        msg: {
          commodity: [{}]
        },
        order_menu_info: [],
        order_action_info: []
      }
    };
  },
  filters: {
    pay(val) {
      return (Number(val) / 100).toFixed(2);
    },
    statusValue(val) {
      var value = "";
      switch (val) {
        case "0":
          value = "待支付";
          break;
        case "1":
          value = "执行中";
          break;
        case "2":
          value = "执行完成";
          break;
        case "3":
          value = "已取消";
          break;

        default:
          break;
      }
      return value;
    }
  },
  components: {
    "van-collapse": Collapse,
    "van-collapse-item": CollapseItem,
    [DatetimePicker.name]: DatetimePicker
  },
  async mounted() {
    this.realamount = this.$route.query.realamount;
    // 如果存在全局数据 拿全局的(代替vuex)  否则用url的  然后获取当前的
    this.shijian =
      this.$root.dateMsg || this.$route.query.date || this.getNowFormatDate();
  },
  watch: {
    shijian(res) {
      var [nian, yue, ri] = res.split("-");
      yue = yue < 10 ? "0" + Number(yue) : yue;
      ri = ri < 10 ? "0" + Number(ri) : ri;
      this.orderdiet({ date: `${nian}-${yue}-${ri}` });
      this.$root.dateMsg = res;
    }
  },
  methods: {
    dateFcun(res) {
      if (res === "rear") {
        if (this.zhouqiend == this.shijian) {
          return;
        }
        this.shijian = this.countDate(this.shijian, 1);
      } else {
        if (this.zhouqigo == this.shijian) {
          return;
        }
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
    Hrer() {
      // 当天不能改当天的 并且当天晚上四点不能修改第二天的单子
      if (new Date(this.shijian) <= new Date(this.countDate("", 0))) {
        return;
      }
      // 如果是下一天的
      if (this.countDate("", 1) === this.shijian) {
        if (new Date().getHours() >= 16) {
          return;
        }
      }
      this.$router.push({ path: this.hertDingdan });
    },
    orderdiet({ date = this.getNowFormatDate() }) {
      this.list.filter(s => (s.list = []));
      this.$http({
        url: "/bjyyq/api/orderdiet",
        data: {
          date,
          orderid: this.$route.query.id
        },
        success: res => {
          var kaishi = this.countDate(res.data.order_info.startdate, 0);
          this.zhouqigo = kaishi;
          this.startDate = new Date(res.data.order_info.startdate);
          this.zhouqiend = this.countDate(res.data.order_info.enddate, 0);
          this.endDate = new Date(res.data.order_info.enddate);
          // morenFalse
          if (!this.morenFalse) {
            if (new Date(this.countDate("", 0)) > this.endDate) {
              this.shijian = res.data.order_info.enddate;
            }
            this.morenFalse = true;
          }
          this.message = res.data;
          if (
            new Date(this.startDate).getTime() >
            new Date(this.shijian).getTime()
          ) {
            this.shijian = res.data.order_info.startdate;
          }
          res.data.msg.forEach(s => {
            this.zone =
              this.zone + Number(s.commodity[0].foodprice) * s.quantity;
          });

          if (res.data.addrid) {
            this.addrid = res.data.addrid;
          }
          var order_action_info = [];
          this.message.order_action_info.forEach(element => {
            var v = element.createtime.split(" ");
            var [s] = element.actionname.split(" ");
            element.time = v[1].split(":")[0] + ":" + v[1].split(":")[1];
            var gan = v[0].split("-");
            element.timeData = `${parseInt(gan[1])}月${parseInt(gan[2])}日`;
            // 判断后一天的不让用户看 并且判断状态信息为NAN
            if (
              new Date(this.countDate("", 1)).getTime() >=
                new Date(s).getTime() ||
              isNaN(new Date(s).getTime())
            ) {
              order_action_info.push(element);
            }
          });
          // 用户的收货地址跳转链接生成
          if (res.data.order_deal_info.length != 0) {
            this.hertDingdan = `/bjyyq/addressList?name=gengxin&orderid=${res.data.order_deal_info[0].id}`;
          }
          this.message.order_action_info = order_action_info;
          this.orderremark = res.data.order_info.orderremark || "";
          res.data.order_menu_info.forEach(s => {
            this.list.forEach((v, ind) => {
              if (s.mealtype === v.value) {
                this.list[ind].list.push(s);
              }
            });
          });
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
    riqi() {
      this.$refs.picker.open();
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
<style lang="less">
.lianjie {
  font-weight: 800;
  
  .mint-cell-value.is-link {
    max-width: 71%;
    text-align: right;
  }
  min-height: 35px;
  .mint-cell-text,
  .mint-cell-value {
    font-size: 13px;
    color: #333;
  }
  .mint-cell-mask::after {
    border-top: 0;
  }
}
.orderFormMsg {
  .van-cell,
  .van-collapse-item__content {
    padding: 0px;
  }
  .van-cell {
    height: 37px;
    line-height: 37px;
  }
  .van-collapse-item {
    width: 93%;
    display: block;
    margin: 0 auto;
  }
  .van-collapse-item__content {
    p {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #fff2f2f2;
      font-size: 11px;
    }
    .van-cell__right-icon {
      position: relative;
      top: 6px;
    }
  }
}
</style>