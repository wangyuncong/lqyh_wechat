<!--
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2019-09-10 17:49:50
 * @LastEditors: 
 * @LastEditTime: 2019-11-19 14:13:08
 -->
<template>
  <div class="discounts">
    <div class="discounts-title">
      <span @click="status = 0" :class="status == 0 ? 'discounts-title-select' : ''">未使用 ({{wei}})</span>
      <span @click="status = 1" :class="status == 1 ? 'discounts-title-select' : ''">使用记录 ({{used}})</span>
      <span @click="status = 2" :class="status == 2 ? 'discounts-title-select' : ''">已过期 ({{past}})</span>
    </div>
    <div>
      <div v-if="wu" style="color:#999;text-align: center;margin-top:50px">
        <img style="width:100px;margin-bottom:10px;" src="static/images/zanwuxiaoshou.png" alt />
        <p>暂无此类优惠券</p>
      </div>
      <mt-loadmore
        :top-method="loadTop"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        ref="loadmore"
      >
        <ul>
          <li v-for="item in infoList" v-if="item.status == status">
            <div class="discounts-main">
              <div class="discounts-main-left">
                <img :src="src" alt />
                <span>¥</span>
                <span>{{item.msg.discount / 100}}</span>
                <span>满{{item.msg.limitamount | pay}}元可用</span>
              </div>
              <div class="discounts-main-right">
                <span :style="item.status != 0 ? 'color: #666;' : 'color: #000;'">
                  全品类
                  <em v-if="item.msg.couponname">({{item.msg.couponname}}）</em>
                </span>
                <span>失效期限：{{item.expiredate.split(' ')[0]}}</span>
                <button v-if="status == 0" @click="$router.push({path:'bjyyq/goods'})">立即使用</button>
                <div
                  :class="item.status == 0 ? 'discounts-main-xindao' :'discounts-main-huise'"
                >{{status | valueSata}}</div>
              </div>
            </div>
          </li>
        </ul>
      </mt-loadmore>
    </div>
  </div>
</template>
<script>
export default {
  name: "Discounts",
  data() {
    return {
      status: '',
      wei: 0,
      src: "static/images/03dd34092ab784ca59cf1827d1e2f48.png?3",
      used: 0,
      wu: false,
      past: 0,
      allLoaded: false,
      infoList: []
    };
  },
  filters: {
    valueSata(va) {
      if (va == 0) {
        return "新到";
      } else if (va == 1) {
        return "已用";
      } else if (va == 2) {
        return "过期";
      }
    }
  },
  watch: {
    status(res) {
      if (this.infoList.filter(s => s.status == this.status).length == 0) {
        this.wu = true;
      } else {
        this.wu = false;
      }
    }
  },
  methods: {
    async loadTop() {
      setTimeout(() => {
        this.$refs.loadmore.onTopLoaded();
      }, 700);
    },
    loadBottom() {
      this.allLoaded = true; // if all data are loaded
      this.$refs.loadmore.onBottomLoaded();
    },
    itemClick(item, index) {
      this.status = index;
    }
  },
  async mounted() {
    this._Vuex.dispatch("discountsList", {
      then: res => {
        this.infoList = res.data;
        this.wei = res.data.filter(s => s.status == 0).length;
        this.used = res.data.filter(s => s.status == 1).length;
        this.past = res.data.filter(s => s.status == 2).length;
        this.status = 0
      }
    });
  }
};
</script>
<style lang='less' src='./index.less' scoped>
</style>
<style lang="less">
.discounts .mint-loadmore {
  width: 100%;
}
</style>