<template>
  <div class="introduce">
    <div v-wechat-title="$route.meta.title"></div>
    <mt-swipe :auto="4000" :show-indicators="false">
      <mt-swipe-item><img src="../../../static/images/banner.png"/></mt-swipe-item>
      <!-- <mt-swipe-item>2</mt-swipe-item> -->
      <!-- <mt-swipe-item>3</mt-swipe-item> -->
    </mt-swipe>
    <h3>
      <span></span>
      另起一行(北京)餐饮有限公司
    </h3>
    <p>
      {{this.$store.goods.state.companyInfo}}
      {{msg}}
      <!-- 另起一行（北京）餐饮有限公司创立于2018年，是国内领先的医学营养膳食的提供者。公司依靠国内一流的医学营养学研发团队，通过纯天然无公害的绿色食材，整合医学，营养学及中国传统膳食制作工艺，为消费者提供科学、系统的健康饮食解决方案及高质量的精准医学营养膳食服务。 -->
    </p>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from 'mint-ui'
import Vue from 'vue'

export default {
  name: 'Introduce',
  data () {
    return {
      msg: ''
    }
  },
  beforeMount(){
    let store = this.$store.goods
    store.dispatch('getCompanyInfo')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' src='./index.less' scoped>

</style>
