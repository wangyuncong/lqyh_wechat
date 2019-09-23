<template>
  <div class="kehuList">
    <mt-loadmore
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :topDistance="40"
      :bottom-all-loaded="allLoaded"
      ref="loadmore"
    >
      <ul>
        <li class="xingming" style="color:#999;">
          <span>姓名</span>
          <span>发展时间</span>
        </li>
        <li v-if="xianshi" style="color:#999;text-align: center;margin-top:50px">
          <img style="width:100px;margin-bottom:10px;" src="static/images/zanwuxiaoshou.png" alt />
          <p>暂无发展记录</p>
        </li>
        <li class="xingming" v-if="item.msg" v-for="item in list">
          <span>{{item.msg ? item.msg.name : '未知'}}</span>
          <span>{{item.createtime}}</span>
        </li>
      </ul>
    </mt-loadmore>
  </div>
</template>
<script>
export default {
  name: "kehuList",
  data() {
    return {
      list: "",
      xianshi: false,
      allLoaded: false
    };
  },
  filters: {},
  components: {},
  async mounted() {
    this.$http({
      url: "/bjyyq/api/huznheInfo/",
      data: {},
      success: res => {
        this.list = res.data;
        res.data.length == 0 ? (this.xianshi = true) : (this.xianshi = false);
      }
    });
  },
  watch: {},
  methods: {
    async loadTop() {
      setTimeout(() => {
        this.$refs.loadmore.onTopLoaded();
      }, 700);
    },
    loadBottom() {
      this.allLoaded = true; // if all data are loaded
      this.$refs.loadmore.onBottomLoaded();
    }
  }
};
</script>
<style lang='less' src='./index.less' scoped>
</style>