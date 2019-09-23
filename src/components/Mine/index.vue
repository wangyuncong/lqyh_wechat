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
          img: "/static/images/inimg.png?1",
          show: true
        },
        {
          name: "饮食偏好",
          url: "/dietHobby",
          img: "/static/images/gerenzho.png?1",
          show: true
        },
        {
          name: "收货地址",
          url: "/bjyyq/addressList?info=true",
          img: "/static/images/dizhi.png?1",
          show: true
        },
        {
          name: "订单信息",
          url: "/orderFormDetails",
          img: "/static/images/dingdan.png?1",
          show: true
        },
        {
          name: "每日打卡",
          url: "/everydayKa",
          img: "/static/images/meiri.png?1",
          show: true
        },
        {
          name: "优惠券",
          url: "/discounts",
          img: "/static/images/youhuijuan.png?1",
          show: true
        },
        {
          name: "积分兑换",
          url: "/integralStore",
          img: "/static/images/jifen.png?1",
          show: true
        },
        {
          name: "我的咨询",
          url: "/myAdvice",
          img: "/static/images/wdzx.png?1",
          show: true
        },
        {
          name: "邀请好友",
          url: "/inviteFriends",
          img: "/static/images/yaoqing.png?1",
          show: true
        },
        {
          name: "我的二维码",
          url: "/myqrcode",
          img: "/static/images/wdewm.png?1",
          show: false
        },
        {
          name: "我的业绩",
          url: "/performance",
          img: "/static/images/wdegwejo.png?1",
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
          if (element.name === "我的二维码") {
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
