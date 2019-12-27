<template>
  <div class="orderform">
    <mt-loadmore
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :topDistance="40"
      :bottom-all-loaded="allLoaded"
      ref="loadmore"
    >
      <ul style="min-height: 95vh;">
        <li style="height: 228px;" v-if="_Vuex.state.orderList.length == 0">
          <div class="zanwu">暂无订单</div>
        </li>
        <li
          class="orderform-main"
          v-for="(item,index) in _Vuex.state.orderList"
          @click="orderFormMsg(item)"
          :key="index"
        >
          <img :src="item.commodity[0].foodpicsmall | imgFilter" alt />
          <div class="orderform-main-right">
            <div class="orderform-main-right-title">
              <p>
                <span>{{item.commodity[0].foodname}}</span>
                <span
                  :class="item.status == 1 ?  'preparehonse' : 'prepare'"
                >{{item.status | statusValue}}</span>
              </p>
              <p>{{item.createtime}}</p>
            </div>
            <div class="orderform-main-wulon">
              <span v-if="item.enddate != 'null' && item.enddate">订餐周期{{item.infoMsg.quantity}}天</span>
              <span v-else></span>
              <span>¥{{item.realamount | pay}}</span>
            </div>
            <div class="orderform-main-lrfi">
              <button v-if="item.status == 0" @click.stop="orderformstate(item,index,2)">取消订单</button>
              <button v-if="item.status == 0" @click.stop="orderformstate(item,index,1)">付款</button>
              <button
                v-if="item.status == 2 || item.status == 3"
                @click.stop="orderformstate(item,index,0)"
              >删除订单</button>
            </div>
          </div>
        </li>
      </ul>
    </mt-loadmore>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
export default {
  name: "orderform",
  data() {
    return {
      state: 0,
      allLoaded: false
    };
  },
  filters: {
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
  async mounted() {
    this._Vuex.dispatch("orderList");
    this.$root.dateMsg = ''
  },
  methods: {
    async loadTop() {
      this._Vuex.dispatch("orderList");
      setTimeout(() => {
        this.$refs.loadmore.onTopLoaded();
      }, 700);
    },
    orderformstate(item, index, status) {
      //  0(删除订单) 1（支付） 2（取消订单）
      var data = "";
      if (status === 0) {
        data = "确认删除订单?";
      } else if (status === 2) {
        data = "确认取消订单?";
      }
      if (status === 1) {
        this.$http({
          url: "/bjyyq/mockPay",
          method: "get",
          data: {
            ordernumber: item.ordernumber,
            orderid: item.id
          },
          success: res => {
            if (res.status === "success") {
              item.status = "1";
              return MessageBox.alert("支付成功！");
            }
          }
        });
        // this.orderformstateaxios(item, index, status);
        return;
      }
      MessageBox.confirm(`${data}`).then(action => {
        this.orderformstateaxios(item, index, status);
      });
    },
    orderformstateaxios(item, index, status) {
      this.$http({
        url: "/bjyyq/api/orderformstate",
        data: {
          id: item.id,
          status,
          remark1: item.remark1
        },
        success: res => {
          if (status === 0) {
            this._Vuex.state.orderList.splice(index, 1);
            return MessageBox.alert("已删除订单！");
          } else if (status == 2) {
            item.status = "3";
            return;
          }
        }
      });
    },
    loadBottom() {
      this.allLoaded = true; // if all data are loaded
      this.$refs.loadmore.onBottomLoaded();
    },
    orderFormMsg(item) {
      this.$router.push({
        path: "/orderFormMsg",
        query: {
          id: item.id,
          // date: item.createtime.split(" ")[0],
          realamount: item.realamount
        }
      });
      if (item.enddate == "null" || !item.enddate) {
      } else {
      }
    }
  }
};
</script>

<style lang='less' src='./index.less' scoped>
</style>
