<template>
  <div class="createOrder">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="content">
      <div class="address" v-if="this.$route.query.type!='yyzx'" @click="goAddress">
        <div class="top">
          <div v-if="!addressObj.addrinfo" class="shdz">请设置收货地址</div>
          <div v-else>
            <p>{{addressObj.area}} {{addressObj.addrinfo}}</p>
            <div>
              <span>{{addressObj.custname}}</span>
              <span>{{addressObj.phonenum}}</span>
            </div>
          </div>
          <div>
            <span class="jiantou"></span>
          </div>
        </div>
      </div>
      <div class="cartBox">
        <!-- <div class="cartTitle">另起一行</div> -->
        <div class="itemBox">
          <div v-for="(item,index) in cartList" :key="index" class="item">
            <div>
              <img v-bind:src="item.foodpicsmall" />
            </div>
            <div>
              <div class="message">
                <div>{{item.foodname}}</div>
                <div class="keyword">
                  <!-- <span>{{item.foodkeyword}}</span> -->
                  <span v-for="item2 in item.foodkeyword.split(',')" :key="item2">{{item2}}</span>
                </div>
                <div>X{{item.quantity}}</div>
                <!-- <div v-if="$route.query.type=='yyzx'">
                  <p v-for="(itemyyzx,indexyyzx) in healthInfo" :key="indexyyzx" :style="indexyyzx!=0?'display:inline-block;paddingLeft:5px':'display:inline-block;'">
                    <span>{{itemyyzx.kindname}}</span>
                    <span>{{(Number(itemyyzx.price)/100).toFixed(2)}}</span>
                  </p>
                </div>-->
              </div>
            </div>
            <div v-if="$route.query.type=='yyzx'" class="price">
              {{((Number(item.quantity)*Number(item.foodprice)+(Number(item.quantity)*Number(healthPrice)))/100).toFixed(2)}}
              <!-- {{((Number(item.quantity)*Number(item.foodprice)+Number(healthPrice)))/100).toFixed(2)}} -->
              <!-- ￥{{(item.foodprice/100).toFixed(2)}} -->
            </div>
            <div v-else class="price">
              {{((Number(item.quantity)*Number(item.foodprice))/100).toFixed(2)}}
              <!-- ￥{{(item.foodprice/100).toFixed(2)}} -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="gmxz">
      <div class="contentGmxz">营养餐服务知情同意书</div>
      <p>我了解以中国糖尿病防治指南为依据，遵循个体化原则为糖妈妈们配置的营养餐，仅做营养支持，不声称及承诺有任何治疗用途。</p>
      <mt-checklist v-model="zqtysvalue" :options="['我同意营养餐服务知情同意书']"></mt-checklist>
    </div>
    <div class="yhq" v-if="couponList.length>0">
      <div class="contentGmxz">可用优惠券</div>
      <div>
        <div
          v-for="(item,index) in couponList"
          :key="index"
          class="yhqItem"
          @click="clickYhq(index)"
        >
          <p>
            <span class="name">{{item.couponname}}</span>
            <br />
            <span>满{{(item.limitamount/100).toFixed(2)}}减{{(item.discount/100).toFixed(2)}}</span>
          </p>
          <p :class="item.isTrue?'yxq bagfff':'yxq'">
            <span>有效期{{item.expiredate}}</span>
          </p>
          <div class="xuanzhong_box" v-if="item.isTrue">
            <span class="xuanzhong"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="dingdanremark">
      <div class="contentGmxz">订单备注</div>
      <textarea v-model="orderremark" name id cols="30" rows="10"></textarea>
    </div>
    <div class="footer">
      <p class="price">
        <span>合计</span>
        ￥{{(totalPrice/100).toFixed(2)}}
      </p>
      <p class="pay">
        <span @click="goPay">去支付</span>
        <span class="jiantou"></span>
      </p>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Checklist, Toast } from "mint-ui";
Vue.component(Checklist.name, Checklist);
Vue.component(Toast.name, Toast);

export default {
  name: "createOrder",
  data() {
    return {
      orderremark: "",
      addressObj: {},
      cartList: [],
      totalPrice: 0,
      zqtysvalue: [],
      couponList: [],
      yhqvalue: [],
      isBeijing: false,
      healthInfo: [],
      healthPrice: 0
      // couponListCheck:[]
    };
    // name: "createOrder",
    // data() {
    //   return {
    //     addressObj: {},
    //     cartList: [],
    //     totalPrice: 0
    //   };
  },
  created() {
    this.getList();
    if (this.$route.query.type == "yyzx") {
      this.gethealthInfo().then(() => {
        this.getCartList().then(() => {
          this.getUserCouponList();
        });
      });
    } else {
      this.getCartList().then(() => {
        this.getUserCouponList();
      });
    }

    if (
      this.addressObj.area &&
      !this.addressObj.area.includes("北京") &&
      this.$route.query.type == "taocan"
    ) {
      this.isBeijing = false;
      Toast({
        message:
          "目前配餐服务范围仅限北京地区，其他地区客户请购买营养咨询服务。"
      });
    } else {
      this.isBeijing = true;
    }
  },
  watch: {
    addressObj: {
      handler(newValue, oldValue) {
        if (
          newValue.area &&
          !newValue.area.includes("北京") &&
          this.$route.query.type == "taocan"
        ) {
          this.isBeijing = false;
          Toast({
            message:
              "目前配餐服务范围仅限北京地区，其他地区客户请购买营养咨询服务。"
          });
        } else {
          this.isBeijing = true;
        }
      },
      deep: true
    },
    healthPrice: {
      handler(newValue, oldValue) {},
      deep: true
    }
  },
  methods: {
    //营养咨询服务
    async gethealthInfo() {
      await this.$http({
        url: "/bjyyq/api/healthInfo",
        data: {},
        method: "get",
        success: data => {
          if (data.data.length > 0) {
            this.healthInfo = data.data;
            this.healthInfo.map(item => {
              this.healthPrice += Number(item.price);
            });
            // this.totalPrice+=this.healthPrice
          }
        }
      });
    },
    clickYhq($index) {
      this.totalPrice = 0;
      this.cartList.map(item => {
        this.totalPrice += Number(item.quantity) * Number(item.foodprice);
      });
      this.couponList[$index].isTrue = !this.couponList[$index].isTrue;
      this.couponList.map((item, index) => {
        if (item.isTrue) {
          this.totalPrice -= item.discount;
        }
      });
      console.log(this.couponList, "this.couponList");
    },
    getUserCouponList() {
      this.couponList = [];
      this.$http({
        url: "/bjyyq/api/userCouponList",
        data: {},
        method: "get",
        success: data => {
          let arr = [];
          if (this.cartList[0].startdate.includes("-")) {
            data.data.map(item => {
              if (item.foodcata.includes("套餐")) {
                arr.push(item);
              }
            });
          }
          arr.map(item => {
            console.log(this.totalPrice, item.limitamount);
            if (this.totalPrice >= item.limitamount) {
              var curTime = new Date();
              //把字符串格式转化为日期类
              // var starttime = new Date(Date.parse(begintime));
              var endtime = new Date(Date.parse(item.expiredate));
              console.log(curTime < endtime, "pp");
              if (curTime < endtime) {
                item.isTrue = false;
                this.couponList.push(item);
              }
            }
          });
          console.log(this.couponList, "this.couponList");
        }
      });
    },
    goAddress() {
      this.$router.push({ path: "/bjyyq/addressList" });
    },
    getList() {
      this.$http({
        url: "/bjyyq/api/addressList",
        data: {},
        method: "get",
        success: data => {
          if (data.status == "success") {
            // 如果是con选择页面点击过来的 拿到索引并且显示点击的第几个
            if (data.data.length > 0) {
              if (sessionStorage.takeINdex) {
                this.addressObj = data.data[sessionStorage.takeINdex];
                return;
              }
              data.data.map(item => {
                if (item.isdefault == "1") {
                  this.addressObj = item;
                }
              });
            }
          }
        }
      });
    },
    async getCartList() {
      let store = this.$store.goods;
      await store
        .dispatch("getCartInfo", {
          userId: sessionStorage.userId || sessionStorage.userid,
          goodid: this.$route.query.id
        })
        .then(() => {
          this.cartList = this.$store.goods.state.shopInfo;
          this.cartList.map(item => {
            this.totalPrice += Number(item.quantity) * Number(item.foodprice);

            if (item.catagoryid == 41) {
              console.log(item, this.healthPrice, "item");
              this.totalPrice += Number(item.quantity) * this.healthPrice;
            }
          });
          // Number(item.quantity)
        });
    },
    //去支付（下订单）
    goPay() {
      console.log(this.zqtysvalue);
      // this.isBeijing
      if (!this.isBeijing) {
        Toast({
          message:
            "目前配餐服务范围仅限北京地区，其他地区客户请购买营养咨询服务。"
        });
        return;
      }
      if (this.zqtysvalue.length == 0) {
        Toast({
          message: "请先阅读知情同意书"
        });
        return;
      }
      if (this.cartList.length == 0) {
        Toast({
          message: "选择商品才可以支付"
        });
        return;
      }
      if (!this.addressObj.addrinfo && this.$route.query.type != "yyzx") {
        Toast({
          message: "选择地址才可以支付"
        });
        return;
      }
      let goodidstr = "";
      this.cartList.map((item, index) => {
        if (index !== this.cartList.length - 1) {
          goodidstr += `${item.goodid},`;
        } else {
          goodidstr += `${item.goodid}`;
        }
      });
      let arr = [];
      this.couponList.map((item, index) => {
        if (item.isTrue) {
          arr.push(item.id);
        }
      });
      let str = arr.join(",");
      this.$http({
        url: "/bjyyq/api/orderAction",
        data: {
          addrid: this.addressObj.id,
          goodid: goodidstr,
          actionname: "创建订单",
          actiondes: "创建订单",
          area: this.addressObj.area,
          status: 0,
          goodMsg: JSON.stringify(this.cartList),
          actionseq: 1,
          realamount: this.totalPrice,
          remark1: str,
          type: this.$route.query.type,
          orderremark: this.orderremark
          // amount:this.totalPrice
        },
        method: "get",
        success: data => {
          if (data.status == "success") {
            // this.delCart()
            // this.Pay(data.data)
            this.userCouponAction();
            this.Pay(data.data);
            // this.mockPay(data.data);
          } else {
            if (data.status === 504) {
              Toast({
                message: data.msg
              });
              this.$router.push({ path: "/imessage?go=true" });
            }
          }
        }
      });
    },
    async mockPay(data) {
      await this.$http({
        url: "/bjyyq/mockPay",
        data: {
          orderid: data.id,
          ordernumber: data.ordernumber
        },
        method: "get",
        success: msg => {
          if (msg.status == "success") {
            this.$router.push({
              path: "/bjyyq/paySuccess",
              query: {
                orderid: data.id
              }
            });
            this.delCart();
          }
        }
      });
    },
    async Pay(data) {
      await this.$http({
        url: "/bjyyq/pay",
        data: {
          orderid: data.id,
          ordernumber: data.ordernumber
        },
        method: "get",
        success: msg => {
          if (msg.status == "success") {
            this.onBridgeReady(msg.data, data);
          }
        }
      });
    },
    onBridgeReady(options, data) {
      let that = this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: options.appId, //公众号名称，由商户传入
          timeStamp: options.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: options.nonceStr, //随机串
          package: "prepay_id=" + options.prepayId,
          signType: "MD5", //微信签名方式：
          paySign: options.sign //微信签名
        },
        function(res) {
          // console.log(res)
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // alert('zhiguchenggong')
            that.delCart();
            that.$router.push({
              path: "/bjyyq/paySuccess",
              query: {
                orderid: data.id
              }
            });

            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          }
        }
      );
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            this.onBridgeReady,
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", this.onBridgeReady);
          document.attachEvent("onWeixinJSBridgeReady", this.onBridgeReady);
        }
      } else {
        onBridgeReady();
      }
    },
    //清空购物车
    delCart() {
      this.$http({
        url: "/bjyyq/api/cartShopDel",
        data: {
          goodMsg: JSON.stringify(this.cartList)
        },
        method: "get",
        success: data => {
          if (data.status == "success") {
            // alert('创建订单成功')
            this.getCartList();
          }
        }
      });
    },
    //优惠劵改为以使用
    async userCouponAction() {
      let arr = [];
      this.couponList.map((item, index) => {
        if (item.isTrue) {
          arr.push(item.id);
        }
      });
      let str = arr.join(",");
      await this.$http({
        url: "/bjyyq/api/userCouponAction",
        data: {
          ids: str
        },
        method: "get",
        success: data => {
          if (data.status == "success") {
            // alert('创建订单成功')
            // this.getCartList();
          }
        }
      });
    }
  }
};
</script>
<style lang="less">
.gmxz {
  .mint-checkbox-core::after {
    left: 7px !important;
    top: 4px !important;
  }
  .mint-cell {
    background: none;
    font-size: 12px !important;
    border: none;
  }
  .mint-cell-wrapper {
    background: none;
    padding-left: 0px;
    .mint-cell-title {
      padding-left: 0px;
    }
  }
  .mint-checklist-label {
    padding-left: 0px;
  }
  .mint-checkbox-label {
    font-size: 12px;
    padding-left: 0px !important;
  }
}
</style>
<style lang="less" scoped>
.createOrder {
  background: #eeeeee;
  // padding:10px;
  min-height: 100vh;
  .gmxz {
    // margin-bottom: 50px;
    padding: 0px 15px;
    .contentGmxz {
      padding: 10px 0px 5px 0px;
      color: #41b396;
      font-size: 14px;
    }
    > p {
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
    }
  }
  .yhq {
    padding: 0px 15px;

    > div:nth-child(1) {
      padding: 10px 0px 5px 0px;
      color: #41b396;
      font-size: 14px;
    }
    .yhqItem {
      margin-bottom: 10px;
      background: #ef8989;
      // padding: 0px 10px;
      border-radius: 5px;
      position: relative;
      color: #fff;
      display: flex;
      p {
        padding: 10px 10px;
        flex: 3;
        .name {
          font-size: 14px;
        }

        &:nth-child(2) {
          padding-top: 18px;
          flex: 6;
        }
      }
      .yxq {
        // margin-left: 50px;
      }
      .xuanzhong_box {
        width: 36px/2;
        height: 36px/2;
        background: rgba(198, 41, 30, 1);
        border-radius: 50%;
        position: absolute;
        right: 20px;
        top: 20px;
      }
      .bagfff {
        background: #fff;
        color: #666666;
      }
      .xuanzhong {
        display: inline-block;

        width: 5px;
        height: 8px;
        border-color: #fff;
        border-style: solid;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        position: absolute;
        left: 5px;
        top: 2px;
      }
    }
  }
  .dingdanremark {
    margin-bottom: 50px;
    padding: 0px 15px;
    margin-top: 10px;
    .contentGmxz {
      padding: 10px 0px 5px 0px;
      color: #41b396;
      font-size: 14px;
    }
    textarea {
      width: 96%;
      height: 70px;
      background: #fff;
      border: 1px solid #41b396;
      border-radius: 5px;
    }
  }
  .content {
    padding: 10px;
  }
  .address {
    padding: 15px;
    background: #fff;
    .shdz {
      line-height: 90px;
      font-size: 20px;
    }
    .top {
      // border-bottom: 1px solid #F2F2F2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > div {
        > p {
          font-size: 18px;
          color: #333;
        }
        > div {
          padding: 15px 0px;
          span:nth-child(2) {
            margin-left: 20px;
          }
        }
      }
      .jiantou {
        display: inline-block;
        width: 9px;
        height: 9px;
        border-top: 2px solid #999999;
        border-right: 2px solid #999999;
        transform: rotate(45deg);
      }
    }
    .bottom {
      color: #333333;
      font-size: 16px;
      padding: 18px 0px 5px 0;
    }
  }
  .cartBox {
    background: #fff;
    margin-top: 10px;
    padding: 0px 15px;
    color: #333333;
    font-size: 14px;
    .cartTitle {
      padding: 20px 0px;
    }
    .itemBox {
      padding-bottom: 15px;
    }
    .item {
      box-sizing: border-box;
      padding-top: 20px;
      > div {
        display: inline-block;
        vertical-align: top;
        &:nth-child(1) {
          width: 50px;
          height: 50px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        &:nth-child(2) {
          font-size: 13px;
          margin-left: 5px;
        }
        &:nth-child(3) {
          float: right;
          font-size: 16px;
        }
        .message {
          .keyword {
            max-width: 210px;
          }
          > div {
            padding-top: 2px;
            color: #999999;
            font-size: 11px;
            &:first-child {
              padding-top: 0px;
              color: #333;
              font-size: 13px;
            }
          }
        }
      }
    }
  }
  .footer {
    width: 100%;
    height: 50px;
    background: #41b396;
    position: fixed;
    bottom: 0px;
    .price {
      color: #fff;
      font-size: 18px;
      line-height: 50px;
      > span {
        font-size: 14px;
        padding-left: 15px;
      }
    }
    .pay {
      position: absolute;
      right: 15px;
      font-size: 16px;
      // line-height: 50px;
      color: #fff;
      top: 15px;
      .jiantou {
        display: inline-block;
        width: 9px;
        height: 9px;
        border-top: 2px solid #ffffff;
        border-right: 2px solid #ffffff;
        transform: rotate(45deg);
      }
    }
  }
}
</style>