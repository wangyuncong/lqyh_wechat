<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zhang Zi Fang
 * @Date: 2019-09-24 08:58:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-10-31 10:28:20
 -->
<template>
  <div class="ihuanzhe">
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
import { Icon, Field, Button } from "vant";
export default {
  name: "ihuanzhe",
  data() {
    return {
      huanzhe: false,
      list: []
    };
  },
  filters: {},
  components: {},
  async mounted() {
    this.$http({
      url: "/bjyyq/api/direct",
      data: {},
      success: res => {
        this.list = res.data;
      }
    });
  },
  watch: {},
  methods: {
    sex(item) {
      if (!item.user) {
        return "static/images/weizhitou.png";
      }
      if (item.user.roleid == 8) {
        return "static/images/yisheng.png";
      } else if (item.user.roleid == 3) {
        return "static/images/yingyangshi.png";
      } else if (item.user.roleid == 9) {
        return "static/images/teshuyingyangshi.png";
      }else {
        return "static/images/weizhitou.png";
      }
    },
    everydayKa(item) {
      if (
        item.user.roleid == 8 ||
        item.user.roleid == 3 ||
        item.user.roleid == 9
      ) {
        this.$router.push({
          path: `/ihuanzhesecond?userid=${item.user.id}&name=${item.user.name}`
        });
        return;
      }
      this.$router.push({ path: "/everydayKa?userid=" + item.user.id });
    }
  }
};
</script>

<style lang='less' src='./index.less' scoped>
</style>