<template>
  <div class="goods">
    <!-- <form action="/apitarget/bjyyq/apimg/fileupload" enctype="multipart/form-data" method="post">
      <input type="file" name="files" />
      <input type="submit" value="提交" />
    </form> -->
    <div v-wechat-title="$route.meta.title"></div>
    <mt-swipe :auto="3000">
      <mt-swipe-item v-for="item in this.$store.goods.state.swipers" :key="item.id">
        <!-- {{item.contentinfo}} -->
        <img v-bind:src="item.contentinfo" />
        <!-- {{this.$store.goods.state.swipers[0]['contentinfo']}} -->
      </mt-swipe-item>
    </mt-swipe>
    <div class="content">
      <div class="left">
        <p
          v-for="item in this.$store.goods.state.category"
          :key="item.id"
          v-on:click="clickCategory(item.id,item.cname)"
          :class="item.active?'active':''"
        >{{item.cname}}</p>
        <!-- <p>套餐</p> -->
      </div>
      <div class="right">
        <h5>
          <p class="orc left_orc">
            <span></span>
            <span></span>
            <span></span>
          </p>
          <span>{{shopTitle}}</span>
          <p class="orc right_orc">
            <span></span>
            <span></span>
            <span></span>
          </p>
        </h5>
        <ul class="shopBox">
          <li
            v-for="item in this.$store.goods.state.categoryFoods"
            :key="item.id"
            @click="goFoodDetails(item.foodid)"
          >
            <div>
              <img v-bind:src="item.foodpicsmall" />
            </div>
            <div class="message">
              <h4>{{item.foodname}}</h4>
              <div class="keyword">
                <span v-for="item2 in item.foodkeywordarr" :key="item2">{{item2}}</span>
              </div>
              <div class="price">
                <p>￥{{(item.foodprice/100).toFixed(2)}}</p>
                <p v-if="shopTitle == '特医食品'" class="add_del">
                  <span
                    :class="item.num<=0?'none':''"
                    v-on:click.stop="num(item.foodid,'subtraction')"
                  >-</span>
                  <span :class="item.num<=0?'none':''">{{item.num}}</span>
                  <span v-on:click.stop="num(item.foodid,'add')">+</span>
                </p>
                <p v-if="shopTitle == '套餐'" @click.stop="goFoodDetails(item.foodid)" class="riqi">
                  <mt-button size="small" type="primary">选购</mt-button>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="shopTitle != '套餐'" class="footer">
      <span v-on:click="changeIsShow()" class="shop">
        <svg
          t="1561603799426"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1163"
        >
          <path
            d="M430.440801 837.777037c32.134842 0 58.179188 26.04537 58.179188 58.179188s-26.044346 58.178165-58.179188 58.178165-58.178165-26.044346-58.178165-58.178165S398.306983 837.777037 430.440801 837.777037z"
            p-id="1164"
            fill="#ffffff"
          />
          <path
            d="M732.970943 837.777037c32.134842 0 58.178165 26.04537 58.178165 58.179188s-26.044346 58.178165-58.178165 58.178165-58.178165-26.044346-58.178165-58.178165S700.836101 837.777037 732.970943 837.777037z"
            p-id="1165"
            fill="#ffffff"
          />
          <path
            d="M802.785355 791.23512 383.89786 791.23512c-43.01029 0-81.476258-33.300105-87.661982-75.841423l-85.72056-559.313981c-0.018431-0.116731-0.035838-0.234486-0.052222-0.351217-1.181646-8.273573-10.198612-16.09558-18.554101-16.09558l-87.280046 0c-19.279062 0-34.906694-15.628656-34.906694-34.906694s15.628656-34.906694 34.906694-34.906694l87.280046 0c43.002098 0 81.458851 33.299081 87.639455 75.842447l85.721584 559.312957c0.017407 0.115707 0.034815 0.231414 0.051198 0.347121 1.18267 8.27562 10.210899 16.099676 18.577652 16.099676l418.887495 0c19.279062 0 34.907718 15.628656 34.907718 34.907718C837.693073 775.606465 822.064417 791.23512 802.785355 791.23512z"
            p-id="1166"
            fill="#ffffff"
          />
          <path
            d="M429.432204 651.357475c-18.331902 0-33.710712-14.297512-34.813514-32.837277-1.14376-19.244248 13.529544-35.772962 32.773792-36.916721l326.141566-19.385554c0.034815-0.002048 0.069629-0.004096 0.105468-0.006144 23.628832-1.333192 53.021517-22.622282 62.705078-45.110425l64.798046-240.445581c0.32869-1.220557 0.723938-2.421658 1.18267-3.599209 2.685839-6.887135 2.563988-11.906572 1.252299-13.826491-1.18779-1.736631-5.400349-3.489645-12.137986-3.489645l-487.792633 0c-19.279062 0-34.907718-15.628656-34.907718-34.906694s15.628656-34.906694 34.907718-34.906694l487.792633 0c29.616932 0 55.049976 12.361209 69.778573 33.913456 14.545309 21.286018 17.020213 49.114097 6.888159 76.638061l-64.914778 240.876667c-0.32869 1.220557-0.723938 2.422682-1.18267 3.600233-9.141888 23.442471-26.849176 45.639811-49.861586 62.506431-23.10047 16.931129-49.568734 27.034513-74.534854 28.452693l-326.077057 19.381458C430.830929 651.335972 430.128495 651.357475 429.432204 651.357475z"
            p-id="1167"
            fill="#ffffff"
          />
        </svg>
        <span class="shopNum">{{this.$store.goods.state.shopInfo.length}}</span>
      </span>

      <mt-popup v-model="isShow" pop-transition="popup-fade">
        <div class="shopCarList">
          <div
            v-for="item in this.$store.goods.state.shopInfo"
            :key="item.id"
            :class="item.quantity<=0?'item none':'item'"
          >
            <div class="img">
              <img v-bind:src="item.foodpicsmall" />
            </div>
            <div class="shopCarMsg">
              <p>{{item.foodname}}</p>
              <p class="count_price">￥{{(Number(item.quantity) * (item.foodprice/100)).toFixed(2)}}</p>
              <p
                v-if="!(item.startdate!==null&&item.startdate.split('-').length>=3)"
                class="add_del shop_add"
              >
                <span
                  :class="item.quantity<=0?'none':''"
                  v-on:click="num(item.goodid,'subtraction')"
                >-</span>
                <span :class="item.quantity<=0?'none':''">{{item.quantity}}</span>
                <span v-on:click="num(item.goodid,'add')">+</span>
              </p>
              <div v-else class="dateModal">
                <p>
                  <span>开始时间：</span>
                  {{item.startdate}}
                  <span>结束时间：</span>
                  {{item.enddate}}
                </p>
                <!-- <p></p> -->
                <p>共计{{item.quantity}}天</p>
              </div>
            </div>
          </div>
        </div>
      </mt-popup>
      <p @click="createOrder" class="pay">
        <span>去支付</span>
        <span class="jiantou"></span>
      </p>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Swipe, SwipeItem, Popup, Button } from "mint-ui";
import { setTimeout, clearTimeout } from "timers";
import axios from "axios";
Vue.component(Popup.name, Popup, Button);
export default {
  name: "Goods",
  data() {
    return {
      shopTitle: "",
      userId: "",
      isShow: false,
      timer: null
    };
  },
  beforeMount() {
    // this.userId = sessionStorage.userId || sessionStorage.userid 
    // process.env.NODE_ENV === "production" ? "" : (this.userId = "1");
    // let store = this.$store.goods;
    // store.commit("setUserId", this.userId);
    // sessionStorage.userId = this.userId;
  },
  mounted() {
    let store = this.$store.goods;
    store.dispatch("getSwipers");
    store.dispatch("getCategory").then(() => {
      this.shopTitle = store.state.category[0].cname;
      store
        .dispatch("getCategoryFood", {
          categoryId: store.state.category[0].id
        })
        .then(() => {
          store.dispatch("getCartInfo", { userId: sessionStorage.userId || sessionStorage.userid });
        });
    });
  },
  methods: {
    chage(e) {
      axios({
        url: "/apitarget/bjyyq/apimg/fileupload",
        method: "post",
        data: {
          files: e.target.files
        },
        transformRequest: [
          function(data) {
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          }
        ],
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
    },
    createOrder() {
      this.$router.push({ path: "/bjyyq/createOrder",query:{type:'other'} });
    },
    xuanzeDate() {},
    //跳转详情页
    goFoodDetails(goodId) {
      this.$router.push({
        path: "/bjyyq/goodsDetail",
        query: { id: goodId, categoryName: this.shopTitle }
      });
    },
    //点击分类获取商品
    clickCategory(categoryId, cname) {
      let store = this.$store.goods;
      store
        .dispatch("getCategoryFood", {
          categoryId
        })
        .then(() => {
          store.dispatch("getCartInfo", { userId: sessionStorage.userId || sessionStorage.userid });
        });
      this.shopTitle = cname;
    },
    //购物车添加减少
    num(id, temp) {
      let store = this.$store.goods;
      store
        .dispatch("goodNum", {
          goodId: id,
          type: temp,
          userId: sessionStorage.userId || sessionStorage.userid
        })
        .then(() => {
          store.dispatch("getCartInfo", { userId: sessionStorage.userId || sessionStorage.userid }).then(() => {
            if (this.$store.goods.state.shopInfo.length <= 0) {
              this.isShow = false;
            }
          });
        });
    },
    //控制购物车商品的弹出和隐藏
    changeIsShow() {
      this.isShow = !this.isShow;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' src='./index.less' scoped>
</style>
