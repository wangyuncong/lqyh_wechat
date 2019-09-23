<template>
  <div class="performance">
    <div class="input">
      <span>直接业绩</span>
      <span>{{message.msg.zjcent / 100 || 0}}元</span>
    </div>
    <div class="input">
      <span>间接业绩</span>
      <span>{{message.msg.jjcent / 100 || 0}}元</span>
    </div>
    <!-- <div class="input">
      <span>医生总数</span>
      <span>{{message.bd_info.length}}</span>
    </div> -->
    <div class="div-xiaoshou">
      <p class="xiaoshou">
        <!-- <span>医生列表</span> -->
        <span>销售记录</span>
      </p>
      <mt-loadmore
        :top-method="loadTop"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        ref="loadmore"
      >
        <ul>
          <li v-if="xianshi" style="color:#999;text-align: center;margin-top:50px">
            <img style="width:100px;margin-bottom:10px;" src="static/images/zanwuxiaoshou.png" alt />
            <p>暂无销售记录</p>
          </li>
          <li v-for="item in message.cm_detail_info">
            <div class="main">
              <img :src="item.msg.foodpicsmall | imgFilter" alt />
              <span>{{item.msg.foodname}}</span>
              <span>¥{{item.amount | pay}}</span>
            </div>
          </li>
        </ul>
      </mt-loadmore>
      <button @click="$router.go(-1)">确定</button>
    </div>
  </div>
</template>
<script> 
import { Indicator } from "mint-ui";
export default {
  name: "performance",
  data() {
    return {
      allLoaded: false,
      xianshi: false,
      src: "",
      message: {
        msg: {},
        cm_detail_info: [],
        bd_info: []
      }
    };
  },
  filters: {},
  components: {},

  async mounted() {
    Indicator.open("加载中...");
    this.$http({
      url: "/bjyyq/api/iperformance",
      data: {},
      success: res => {
        this.message = res.data;
        Indicator.close();
        res.data.cm_detail_info.length == 0
          ? (this.xianshi = true)
          : (this.xianshi = false);
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
      this.allLoaded = true;
      this.$refs.loadmore.onBottomLoaded();
    }
  }
};
</script>

<style lang='less' src='./index.less' scoped>
</style>