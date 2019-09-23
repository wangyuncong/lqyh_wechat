<template>
  <div class="myqrcode">
    <div class="myqrcode-main">
      <p>{{_Vuex.state.userInfo.name}}专属二维码</p>
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
    <p class="lishi" @click="$router.push({path:'/kehuList'})">查看历史</p>
  </div>
</template>
<script>
import { Indicator, MessageBox } from "mint-ui";
export default {
  name: "myqrcode",
  data() {
    return {
      src: ""
    };
  },
  filters: {},
  components: {},

  async mounted() {
    Indicator.open("加载中...");
    this.$http({
      url: "/bjyyq/api/querycode",
      data: {
        userid: sessionStorage.userid
      },
      success: res => {
        if (res.status != 0) {
          return MessageBox.alert("二维码获取失败，请尝试刷新网页");
        }
        this.src = res.data.qrcodeinfo;
        Indicator.close();
      }
    });
  },
  watch: {},
  methods: {}
};
</script>
<style lang='less' src='./index.less' scoped>
</style>