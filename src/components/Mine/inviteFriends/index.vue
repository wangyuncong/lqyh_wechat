<template>
  <div class="inviteFriends">
    <div class="inviteFriends-title">
      <img src="/static/images/d378c05ef29168448e64940f62040b7.png" alt />
      <div class="border">
        <img :src="img" alt />
      </div>
    </div>
    <!-- <div class="yaoqingbu">
      <div>
        <p>0</p>
        <p>邀请好友</p>
      </div>
      <div>
        <p>0</p>
        <p>获得积分</p>
      </div>
    </div>-->
    <p class="fontsTIshi">
      提示 邀请的好友扫码关注可得积分
      <br />解释权归另起一行（北京）餐饮管理有限公司所有
    </p>
    <div class="button" @click="yaoqing">立即邀请</div>
    <div class="inviteFriends-share" @click="share = false" v-if="share">
      <div>
        <img src="/static/images/imgfenxiang.png" alt />
        <p>点击分享至朋友圈即可得积分红包</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "inviteFriends",
  data() {
    return {
      share: false,
      img: ""
    };
  },
  methods: {
    yaoqing() {
      this.share = true;
    }
  },
  async mounted() {
    // 分享
    var { desc, title, imgUrl } = this.$root.share;
    var url = location.origin + location.pathname;
    url += `#/shareThePage?userid=${sessionStorage.userid}`;
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
    this.$http({
      url: "/bjyyq/api/qrcode",
      data: {
        type: 1
      },
      success: res => {
        this.img = res.data;
        console.log(res);
      }
    });
  }
};
</script>
<style lang='less' src='./index.less' scoped>
</style>
