<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zhang Zi Fang
 * @Date: 2019-10-18 10:47:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-19 14:51:52
 -->
<template>
  <div class="mine">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="navigation">
      <div class="head-img">
        <img :src="_Vuex.state.userInfo.img" alt />
      </div>
      <div class="use-message">
        <p>{{_Vuex.state.userInfo.name}}</p>
        <p>
          <img
            style="width: 15px;margin-right: 5px;float: left;"
            src="/static/images/infojifen.png"
            alt
          />
          积分：{{_Vuex.state.userInfo.mycent || 0}}
        </p>
      </div>
    </div>
    <h5>
      <p class="orc left_orc">
        <span></span>
        <span></span>
        <span></span>
      </p>
      <span>个人中心</span>
      <p class="orc right_orc">
        <span></span>
        <span></span>
        <span></span>
      </p>
    </h5>
    <ul class="ul">
      <li v-for="item in menuList" v-if="item.show" @click="itemClick({item})">
        <div class="ul-img">
          <img :src="item.img" alt />
          <span>{{item.name}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import urlencode from "urlencode";
export default {
  name: "Mine",
  data() {
    return {
      name: "我是名字",
      integral: 0,
      tag: "我是标签",
      img: "",
      menuList: [
        {
          name: "个人信息",
          url: "/imessage",
          img: "/static/images/inimg.png?2",
          show: true
        },
        {
          name: "饮食偏好",
          url: "/dietHobby",
          img: "/static/images/gerenzho.png",
          show: true
        },
        {
          name: "收货地址",
          url: "/bjyyq/addressList?info=true",
          img: "/static/images/dizhi.png",
          show: true
        },
        {
          name: "订单信息",
          url: "/orderFormDetails",
          img: "/static/images/dingdan.png",
          show: true
        },
        {
          name: "每日打卡",
          url: "/everydayKa",
          img: "/static/images/meiri.png",
          show: true
        },
        {
          name: "优惠券",
          url: "/discounts",
          img: "/static/images/youhuijuan.png",
          show: true
        },
        {
          name: "积分兑换",
          url: "/integralStore",
          img: "/static/images/jifen.png",
          show: true
        },
        {
          name: "我的咨询",
          url: "/myAdvice",
          img: "/static/images/wdzx.png",
          show: true
        },
        {
          name: "邀请好友",
          url: "/inviteFriends",
          img: "/static/images/yaoqing.png",
          show: true
        },
        {
          name: "推广记录",
          url: "/kehuList",
          img: "/static/images/wdewm.png",
          show: false
        },
        {
          name: "我的业绩",
          url: "/performance",
          img: "/static/images/wdegwejo.png",
          show: false
        },
        {
          name: "客服中心",
          url: "/callCenter",
          img: "/static/images/kefuzhongxin.png",
          show: false
        },
        {
          name: "我的患者",
          url: "/ihuanzhe",
          img: "/static/images/huanzhe.png",
          show: false
        },
      ]
    };
  },
  mounted() {
    new Promise((v, s) => {
      if (
        this._Vuex.state.userInfo.roleid ||
        process.env.NODE_ENV !== "production"
      ) {
        v(this._Vuex.state.userInfo.roleid);
      } else {
        var se = setInterval(() => {
          if (this._Vuex.state.userInfo.roleid) {
            v(this._Vuex.state.userInfo.roleid);
            clearInterval(se);
          }
        }, 10);
      }
    }).then(s => {
      if (
        this._Vuex.state.userInfo.roleid != null ||
        process.env.NODE_ENV !== "production"
      ) {
        this.menuList.forEach(element => {
          if (element.name === "推广记录") {
            element.show = true;
          }
        });
      }
      if (
        this._Vuex.state.userInfo.roleid == 7 ||
        process.env.NODE_ENV !== "production"
      ) {
        this.menuList.forEach(element => {
          if (element.name === "我的业绩") {
            element.show = true;
          }
        });
      }
      if (
        this._Vuex.state.userInfo.roleid == 3 ||
        process.env.NODE_ENV !== "production"
      ) {
        this.menuList.forEach(element => {
          if (element.name === "我的业绩") {
            element.show = true;
          }
        });
      }
      if (
        this._Vuex.state.userInfo.roleid == 9 ||
        process.env.NODE_ENV !== "production"
      ) {
        this.menuList.forEach(element => {
          if (element.name === "我的业绩") {
            element.show = true;
          }
        });
      }
      if (
        this._Vuex.state.userInfo.roleid == 8 ||
        process.env.NODE_ENV !== "production"
      ) {
        this.menuList.forEach(element => {
          if (element.name === "我的业绩") {
            element.show = true;
          }
        });
      }
      if (
        this._Vuex.state.userInfo.roleid == 7 ||
        this._Vuex.state.userInfo.roleid == 3 ||
        this._Vuex.state.userInfo.roleid == 6 ||
        this._Vuex.state.userInfo.roleid == 9 ||
        this._Vuex.state.userInfo.roleid == 12 ||
        process.env.NODE_ENV !== "production"
      ) {
        this.menuList.forEach(element => {
          if (element.name === "客服中心") {
            element.show = true;
          }
        });
      }
      if (
        this._Vuex.state.userInfo.roleid == 10 ||
        this._Vuex.state.userInfo.roleid == 8 ||
        this._Vuex.state.userInfo.roleid == 9 ||
        this._Vuex.state.userInfo.roleid == 7 ||
        this._Vuex.state.userInfo.roleid == 3 ||
        process.env.NODE_ENV !== "production"
      ) {
        this.menuList.forEach(element => {
          if (element.name === "我的患者") {
            element.show = true;
          }
        });
      }
    });
  },
  methods: {
    itemClick({ item }) {
      this.$router.push({
        path: item.url
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' src='./index.less' scoped>
</style>
