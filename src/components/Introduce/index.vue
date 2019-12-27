<!--
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2019-09-12 17:51:37
 * @LastEditors: 
 * @LastEditTime: 2019-11-19 17:55:26
 -->
<template>
  <div class="introduce">
    <div class="introduce-img" v-wechat-title="$route.meta.title">
      <img src="static/images/fwefewgrt.png" alt />
      <img src="@/assets/logo.png" alt />
    </div>
    <div class="baground">
      <div class="baground-main">
        <p class="p1">另起一行(北京）餐饮有限公司</p>
        <p>{{$store.goods.state.companyInfo}}</p>
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="item in list">
              <img :src="img + item.contentinfo" alt />
              <!-- <p class="lvseyouji">{{item.contentinfo1}}</p> -->
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from "mint-ui";
import Vue from "vue";
import Swiper from "Swiper";
export default {
  name: "Introduce",
  data() {
    return {
      msg: "", 
      img:"",
      list: {}
    };
  },
  beforeMount() {
    let store = this.$store.goods;
    store.dispatch("getCompanyInfo");
  },
  mounted() {
    this.img = sessionStorage.img
    this.$http({
      url: "/bjyyq/api/content_info",
      success: res => {
        this.list = res.data;  
        this.$nextTick(() => {
          var swiper = new Swiper(".swiper-container", {
            slidesPerView: 1.8,
            spaceBetween: 30,
            centeredSlides: true,
            loop: true,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
              background: "#fff"
            }
          });
        });
      }
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' src='./index.less' scoped>
</style>
<style lang='less'>
.introduce {
  .swiper-slide img {
    width: 226px;
    height: 181px;
    padding-bottom: 23px;
  }
  .lvseyouji {
    position: relative;
    top: -15px;
  }
  .swiper-slide {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 300ms;
    transform: scale(0.8) !important;
    -webkit-transform:scale(0.8 )!important;
    flex-flow: row wrap;
    width: 100%;
  }
  .swiper-container {
    height: 230px;
  }
  .swiper-slide-active,
  .swiper-slide-duplicate-active {
    transform: scale(1) !important;
    -webkit-transform: scale(1) !important;
  }
  .swiper-pagination-bullet {
    background: #fff;
  }
}
</style>
