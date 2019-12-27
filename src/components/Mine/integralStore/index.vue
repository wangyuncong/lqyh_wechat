<!--
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2019-09-10 17:49:49
 * @LastEditors: 
 * @LastEditTime: 2019-11-19 15:38:20
 -->
<template>
  <div class="integralStore">
    <div class="integralStore-title">
      <img src="/static/images/jifenduihuan.png" alt />
      <div>
        <p>积分换好礼</p>
        <button>当前积分：{{jifen || 0}}</button>
      </div>
    </div>
    <mt-loadmore
      :top-method="loadTop"
      :bottom-all-loaded="allLoaded"
      ref="loadmore"
      :topDistance="50"
    >
      <ul>
        <li style="height: 228px;" v-if="list.length === 0">
          <p style="text-align: center;font-size: 14px;color: #999;">暂无商品</p>
        </li>
        <li class="integralStore-maim" v-for="item in list">
          <img src="/static/images/infoYouhu.png?4" alt />
          <div class="integralStore-div-main">
            <p>
              ¥
              <span>{{item.msg.discount / 100}}</span>
            </p>
            <p v-if="item.msg.limitamount">(满{{item.msg.limitamount / 100}}可用)</p>
            <p>{{item.goodcent}}积分可兑换</p>
            <p @click="conversion(item)">点击兑换</p>
          </div>
        </li>
      </ul>
    </mt-loadmore>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
export default {
  name: "integralStore",
  data() {
    return {
      jifen: 0,
      list: [],
      allLoaded: false
    };
  },
  methods: {
    async loadTop() {
      setTimeout(() => {
        this.$refs.loadmore.onTopLoaded();
      }, 700);
    },
    conversion(item) {
      if(item.goodcent > this.jifen){
        return MessageBox("提示", '积分不足！');
      }
      MessageBox.confirm("确认兑换？").then(action => {
        this.$http({
          url: "/bjyyq/api/integralConversion",
          data: {
            id: item.id,
            goodid:item.goodid
          },
          success: res => {
            this.jifen = res.integral;
            MessageBox("提示", res.msg);
          }
        });
      });
    }
  },
  async mounted() {
    this.$http({
      url: "/bjyyq/api/integralList",
      data: {},
      success: res => {
        this.jifen = res.data.info.mycent;
        this.list = res.data.rows;
      }
    });
  }
};
</script>
<style lang='less' src='./index.less' scoped>
</style>
