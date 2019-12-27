<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zhang Zi Fang
 * @Date: 2019-09-10 17:49:49
 * @LastEditors: Zhang Zi Fang
 * @LastEditTime: 2019-10-22 13:47:57
 -->
<template>
  <div class="myqrcode">
    <div class="myqrcode-main">
      <p>{{name}}专属二维码</p>
      <p style="margin-top: 6px;margin-bottom: 8px;"></p>
      <div class="br">
        <span></span>
        <p></p>
        <span></span>
      </div>
      <div>
        <img style="width: 100%;" :src="src" alt />
      </div>
      <p class="weixin">扫一扫上图的二维码图案，关注公众号</p>
    </div>
    <p class="lishi" v-if="!$route.query.userid" @click="$router.push({path:'/kehuList'})">查看历史</p>
  </div>
</template>
<script>
import { Indicator, MessageBox } from "mint-ui";
export default {
  name: "myqrcode",
  data() {
    return {
      src: "",
      userid: "",
      name: ""
    };
  },
  filters: {},
  components: {},

  async mounted() {
    // 分享

    Indicator.open("加载中...");
    new Promise((v, s) => {
      if (this.$root.share && sessionStorage.userid) {
        v(this.$root.share);
      } else {
        var se = setInterval(() => {
          if (this.$root.share && sessionStorage.userid) {
            v(this.$root.share);
            clearInterval(se);
          }
        }, 10);
      }
    }).then(s => {
      var { desc, title, imgUrl } = this.$root.share;
      var url = location.origin + location.pathname;
      this.userid = this.$route.query.userid || sessionStorage.userid;
      url += `#/myqrcode?userid=${this.userid}`;
      wx.updateAppMessageShareData({
        title,
        desc, // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl
      });
      wx.updateTimelineShareData({
        title,
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl
      });
      wx.onMenuShareAppMessage({
        title,
        desc, // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl
      });
      wx.onMenuShareTimeline({
        title,
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl
      });
      var userid = /userid\=(.+?)(\&|$)/;
      var id = location.href.match(userid);
      this.$http({
        url: "/bjyyq/api/querycode",
        data: {
          queryuserid: id && id[1],
          userid: sessionStorage.userid
        },
        success: res => {
          Indicator.close();
          if (res.status != 0) {
            return MessageBox.alert("二维码获取失败，请尝试刷新网页");
          }
          this.name = res.rows.name;
          this.src = res.data.qrcodeinfo;
        }
      });
    });
  },
  watch: {},
  methods: {}
};
</script>
<style lang='less' src='./index.less' scoped>
</style>