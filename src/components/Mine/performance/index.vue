<!--
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2019-09-10 17:49:49
 * @LastEditors: 
 * @LastEditTime: 2019-11-11 14:54:48
 -->
<template>
  <div class="performance">
    <div class="title">
      <div @click="subYear()">
        <van-icon name="arrow-left" />
      </div>
      <p>{{dataYear}}年{{nowMonth + 1}}月</p>
      <div @click="addYear()">
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="input">
      <span>直接业绩</span>
      <span>{{zjcent / 100 || 0}}元</span>
    </div>
    <div class="input">
      <span>间接业绩</span>
      <span>{{jjcent / 100 || 0}}元</span>
    </div>
    <div class="div-xiaoshou">
      <p class="xiaoshou">
        <!-- <span>医生列表</span> -->
        <span>销售记录</span>
      </p>
      <div class="fazhanquan">
        <span :class="typeInde === 99 ? 'typeInde' : ''" @click="typeInde = 99">全部</span>
        <span :class="typeInde === 0 ? 'typeInde' : ''" @click="typeInde = 0">直接业绩</span>
        <span :class="typeInde === 1 ? 'typeInde' : ''" @click="typeInde = 1">间接业绩</span>
      </div>
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
          <li
            :key="index"
            v-if="(item.type === typeInde || typeInde === 99)"
            v-for="(item,index) in message.cm_detail_info"
          >
            <div class="main">
              <span></span>
              <div class="divname">
                <span>{{item.msg.foodname}}</span>
                <span style="left: 32%;color:#000">下单时间:{{item.createtime}}</span>
                <span style="color:red;float:right">¥{{item.amount | pay}}</span>
              </div>

              <div style="font-size:13px;" class="divname">
                客户：{{item.info && item.info.name}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>发展时间：{{item.createtime && item.createtime.split(' ')[0]}}</span>
              </div>
              <div class="mainname">
                <p class="fazhanlian">
                  发展链
                  <span
                    :key="indexs"
                    v-for="(items,indexs) in item.objfazhan"
                  >{{items.name}} {{indexs !== item.objfazhan.length - 1 ? '=>' : ''}}</span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </mt-loadmore>
      <button @click="$router.go(-1)">确定</button>
    </div>
  </div>
</template>
<script>
import { Icon } from "vant";
import { Indicator } from "mint-ui";
export default {
  name: "performance",
  data() {
    return {
      allLoaded: false,
      zjcent: 0,
      jjcent: 0,
      typeInde: 99,
      dataYear: "",
      nowMonth: "",
      xianshi: false,
      src: "",
      message: {
        msg: {},
        cm_detail_info: []
      }
    };
  },
  filters: {},
  components: {
    [Icon.name]: Icon
  },

  async mounted() {
    var my_date = new Date();
    this.dataYear = my_date.getFullYear();
    this.nowMonth = my_date.getMonth();
    this.iperformance();
    Indicator.open("加载中...");
  },
  watch: {
    typeInde(res) {
      if (res === 99) {
        this.message.cm_detail_info.length == 0
          ? (this.xianshi = true)
          : (this.xianshi = false);
      } else {
        if (
          this.message.cm_detail_info.filter(s => s.type === res).length != 0
        ) {
          return (this.xianshi = false);
        } else {
          return (this.xianshi = true);
        }
      }
    }
  },
  methods: {
    iperformance() {
      this.$http({
        url: "/bjyyq/api/iperformance",
        data: {
          time: `${this.dataYear}-${this.nowMonth + 1}`
        },
        success: res => {
          this.message = res.data;
          var zjcent = 0,
            jjcent = 0;
          this.message.cm_detail_info.forEach(element => {
            if (element.type === 0) {
              zjcent += Number(element.amount);
            } else {
              jjcent += Number(element.amount);
            }
          });
          this.zjcent = zjcent;
          this.jjcent = jjcent;
          Indicator.close();
          res.data.cm_detail_info.length == 0
            ? (this.xianshi = true)
            : (this.xianshi = false);
        }
      });
    },
    async loadTop() {
      setTimeout(() => {
        this.$refs.loadmore.onTopLoaded();
      }, 700);
    },
    subYear() {
      if (this.nowMonth == 0) {
        this.dataYear -= 1;
        this.nowMonth = 11;
      } else {
        this.nowMonth -= 1;
      }
      var riqiList = [];
      this.iperformance();
    },
    addYear(dataYear) {
      if (this.nowMonth == 11) {
        this.dataYear += 1;
        this.nowMonth = 1;
      } else {
        this.nowMonth += 1;
      }
      var riqiList = [];
      this.iperformance();
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
<style lang="less">
.performance .van-icon-arrow,
.performance .van-icon-arrow-left {
  position: relative;
  top: 2px;
}
</style>