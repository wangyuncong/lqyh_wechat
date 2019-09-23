<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title" />
  </div>
</template>

<script>
import urlencode from "urlencode";
export default {
  name: "App",
  data() {
    return {};
  },
  async created() {
    this.wxconfig();
    if (sessionStorage.openid) {
      let obj = {
        openId: sessionStorage.openid
      };
      await this.$http({
        url: "/bjyyq/api/userInfo",
        data: obj,
        method: "get",
        success: data => {
          sessionStorage.userId = data[0].id;
          this._Vuex.state.userInfo = data[0];
          sessionStorage.userid = data[0].id;
        }
      });
      return;
    }
    var url = location.search;
    this.winUrl = url;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
      }
    }

    if (
      process.env.NODE_ENV === "production" &&
      !theRequest.code &&
      !location.href.includes("shareThePage")
    ) {
      let redirect_uri = location.href;
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2b3de230eec21649&redirect_uri=${urlencode(
        redirect_uri
      )}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      return;
    }
    theRequest.code &&
      this.$http({
        url: "/bjyyq/aouth",
        data: theRequest,
        method: "get",
        success: data => {
          let obj = {
            openid: data.openid,
            name: data.nickname,
            img: data.headimgurl
          };
          sessionStorage.openid = data.openid;
          this.$http({
            url: "/bjyyq/api/userInfo",
            data: obj,
            method: "get",
            success: res => {
              sessionStorage.userid = res[0].id;
              this._Vuex.state.userInfo = res[0];
            }
          });
        }
      });
  },
  methods: {
    wxconfig() {
      this.$http({
        url: "/bjyyq/api/wxconfig",
        data: {
          url: location.href.split("#")[0]
        },
        success: res => {
          wx.config({
            debug: false,
            appId: res.appid, // 必填，公众号的唯一标识
            timestamp: Number(res.timestamp), // 必填，生成签名的时间戳
            nonceStr: res.noncestr, // 必填，生成签名的随机串
            signature: res.resultCode, // 必填，签名
            jsApiList: [
              "updateAppMessageShareData",
              "onMenuShareAppMessage",
              "updateTimelineShareData",
              "onMenuShareTimeline"
            ] // 必填，需要使用的JS接口列表
          });
          this.$root.share = res.share
        }
      });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
