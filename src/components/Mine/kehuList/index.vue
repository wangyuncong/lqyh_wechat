<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zhang Zi Fang
 * @Date: 2019-09-10 17:49:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-06 16:13:17
 -->
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
          <span class="span1">姓名</span>
          <span class="span2" @click="fashija">发展时间</span>
          <span class="span3" @click="fazhenrne">直接发展人</span>
        </li>
        <li v-if="xianshi" style="color:#999;text-align: center;margin-top:50px">
          <img style="width:100px;margin-bottom:10px;" src="static/images/zanwuxiaoshou.png" alt />
          <p>暂无发展记录</p>
        </li>
      </ul>
      <el-tree :data="list" v-if="list.length != 0">
        <span class="custom-tree-node" slot-scope="{ data }">
          <template v-if="data.createtime">
            <span style="font-size: 13px;" class="span1">{{data.msg && data.msg.name || '未知'}}</span>
            <span style="font-size: 13px;" class="span2">{{data.createtime}}</span>
            <span style="font-size: 13px;" class="span3">{{data.zhijieinfo.name}}</span>
          </template>
        </span>
      </el-tree>
    </mt-loadmore>
  </div>
</template>
<script>
export default {
  name: "kehuList",
  data() {
    return {
      list: [],
      xianshi: false,
      type: "createtime",
      allLoaded: false
    };
  },
  filters: {},
  components: {},
  async mounted() {
    this.huznheInfo();
  },
  watch: {},
  methods: {
    fazhenrne() {
      this.list.sort(function(a, b) {
        if (a.duserid === b.duserid) {
          return;
        } else {
          return a.duserid - b.duserid;
        }
      });
    },
    huznheInfo() {
      this.$http({
        url: "/bjyyq/api/huznheInfo/",
        data: {
          type: this.type
        },
        success: res => {
          var list = res.data.filter(s =>s.msg)
          this.list = list;
          this.fazhenrne();
          res.data.length == 0 ? (this.xianshi = true) : (this.xianshi = false);
        }
      });
    },
    fashija() {
      this.list.reverse();
    },
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