<!--
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2019-09-10 17:49:49
 * @LastEditors: 
 * @LastEditTime: 2019-11-11 15:09:29
 -->
<template>
  <div class="shareThePage">
    <div class="shareThePage-title">
      <div class="span">健康生活 科学饮食</div>
      <img src="/static/images/fwe-left.png" alt />
      <div class="span2">
        <span>专业营养</span>
        <span>配餐</span>
      </div>
      <div class="span3">
        <span>heal</span>
        <span>thy</span>
      </div>
      <img src="/static/images/fwe-right.png" alt />
    </div>
    <div class="shareThePage-icon">
      <img class="shareThePage-beijing" src="/static/images/yuangr.png" alt />
      <img class="shareThePage-qccode" :src="src" alt />
      <p>长按二维码 关注我们</p>
    </div>
    <div class="liaotianimg">
      <p>
        接受邀请，关注我们
        <br />获取
        <span style="color:red;">新人专享优惠券</span>
      </p>
      <img class="img" src="/static/images/liaotianimg.png" alt />
    </div>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
export default {
  name: "shareThePage",
  data() {
    return {
      src: ""
    };
  },
  filters: {},
  components: {},

  async mounted() {
    var userid = /userid\=(.+?)(\&|$)/;
    var id = location.href.match(userid);
    // id[1]
    this.$http({
      url: "/bjyyq/api/querycode",
      data: {
        queryuserid: id[1]
      },
      success: res => {
        if (res.status != 0) {
          return MessageBox.alert("二维码获取失败，请尝试刷新网页");
        }
        this.src = res.data.qrcodeinfo;

        // 分享
        if (id == "") {
          return;
        }
        var { desc, title, imgUrl } = this.$root.share;
        var url = location.origin + location.pathname;
        url += `#/shareThePage?userid=${id}`;
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
      }
    });
  },
  watch: {},
  methods: {}
};
</script>

<style lang='less' src='./index.less' scoped>
</style>