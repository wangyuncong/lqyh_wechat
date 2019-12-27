<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zhang Zi Fang
 * @Date: 2019-09-24 08:58:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-10-31 10:28:30
 -->
<template>
  <div class="ihuanzhe">
    <van-nav-bar :left-text="leftText" right-text="返回 >" @click-right="onClickLeft" />
    <li v-if="list.length === 0" style="color:#999;text-align: center;margin-top:50px">
      <img style="width:100px;margin-bottom:10px;" src="static/images/zanwuxiaoshou.png" alt />
      <p>暂无患者</p>
    </li>
    <div class="div" v-for="item in list" v-if="item.user" @click="everydayKa(item)">
      <img :src="sex(item)" alt />
      <p>{{item.user && item.user.name}}</p>
      <!-- <p>发展时间</p> -->
      <p>{{item.createtime.split(' ')[0]}}</p>
    </div>
  </div>
</template>
<script>
import { Icon, Field, Button, NavBar } from "vant";
export default {
  name: "ihuanzhe",
  data() {
    return {
      huanzhe: false,
      leftText: "",
      list: []
    };
  },
  filters: {},
  components: {
    [NavBar.name]: NavBar
  },
  async mounted() {
    this.leftText = this.$route.query.name;
    this.$http({
      url: "/bjyyq/api/direct",
      data: {
        userid: this.$route.query.userid,
        type: 2
      },
      success: res => {
        this.list = res.data;
      }
    });
  },
  watch: {},
  methods: {
    onClickLeft(res) {
      this.$router.go(-1);
    },
    sex(item) {
      
      if (!item.user) {
        return "static/images/weizhitou.png";
      }

      if (item.user.sex === "女") {
        return "static/images/nvhai.png";
      } else if (item.user.sex === "男") {
        return "static/images/boy.png";
      } else {
        return "static/images/weizhitou.png";
      }
    },
    everydayKa(item) {
      this.$router.push({ path: "/everydayKa?userid=" + item.user.id });
    }
  }
};
</script>

<style lang='less' src='./index.less' scoped>
</style>