<template>
  <div class="goodsDetail">
    <div v-wechat-title="$route.meta.title"></div>
    <div v-if="this.$store.goods.state.goodsDetail.foodname" class="goods_detail">
      <mt-swipe :auto="3000" class="goods_detail_swiper">
        <mt-swipe-item><img v-bind:src="`http://bjyyq.zhaoshuikan.com.cn/static/${this.$store.goods.state.goodsDetail.foodpicbig}`"></mt-swipe-item>
      </mt-swipe>
      <p>{{this.$store.goods.state.goodsDetail.foodname}}</p>
      <div class="keywords">
        <span v-for="(item,index) in this.$store.goods.state.goodsDetail.foodkeyword.split(',')" :key="index">
          {{item}}
        </span>
      </div>
      <div class="price_box">
        <p class='count_price'>￥{{(this.$store.goods.state.goodsDetail.foodprice/100).toFixed(2)}}<span v-if="this.$route.query.categoryName == '套餐'">/天</span></p>
        <p v-if="this.$route.query.categoryName != '套餐'" class="add_del shop_add">
          <span :class="$store.goods.state.goodsDetail.quantity<=0?'none':''" v-on:click="num($store.goods.state.goodsDetail.id,'subtraction')">-</span>
          <span :class="$store.goods.state.goodsDetail.quantity<=0?'none':''">{{$store.goods.state.goodsDetail.quantity}}</span>
          <span v-on:click="num($store.goods.state.goodsDetail.id,'add')">+</span>
        </p>
      </div>
    </div>
    <div class="shop">
      <div>商品详情</div>
      <div v-html="$store.goods.state.goodsDetail.fooddesc"></div>
    </div>
    <div v-if="this.$route.query.categoryName == '套餐'" class="dingcanDate">
      <div>配送规则</div>
      <div style="padding-bottom:10px;">{{$store.goods.state.goodsDetail.foodtrans}}</div>
      <div>
        <div class="dingcanDate-xuanze">
          <mt-datetime-picker
            ref="pickerLeft"
            type="date"
            :startDate="startDate"
            @confirm="handleConfirm"
          >
          </mt-datetime-picker>
          <mt-datetime-picker
            ref="pickerRight"
            type="date"
            :startDate="endDate"
            @confirm="handleConfirm1"
          >
          </mt-datetime-picker>
          <div><p class="shijian">起始时间</p><mt-button class="shijian_button" type="default" @click="setStartTime">{{pickerValue.start}}</mt-button></div>
          <div><p class="shijian">终止时间</p><mt-button class="shijian_button" type="default" @click="setStartTime1">{{pickerValue.end}}</mt-button></div>
        </div>
      </div>
      <div class="bottom">共计{{tianshu}}天</div>
    </div>
    <!-- <div>
      <div>订餐日期</div>
    </div> -->
    <div class="footer">
      <p class='price'><span>合计</span>￥{{(Number(this.$store.goods.state.goodsDetail.quantity) * (this.$store.goods.state.goodsDetail.foodprice/100)).toFixed(2)}}</p>
      <p @click="createOrder" class="pay">
        <span>继续下单</span>
        <span class="jiantou"></span>
      </p>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { DatetimePicker,Toast } from 'mint-ui';
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Toast.name, Toast);
export default {
  name:'GoodsDetail',
  data(){
    return {
      startDate:new Date(),
      endDate:new Date(),
      pickerValue:{
        // start:this.formatDate(new Date()),
        // end:this.fun_date(7,new Date())
        start:'请选择时间',
        end:'请选择时间'
      },
      tianshu: 0
    }
  },
  created(){
    let store = this.$store.goods;
    if(this.time_range('00:00','15:59')){
      this.startDate = new Date(new Date().getTime()+ 24*60*60*1000*1 )
      // this.startDate = new Date(new Date().getTime()- 24*60*60*1000*10 )
    }else{
      // console.log(new Date()+1,'new Date()')
      this.startDate = new Date(new Date().getTime() + 24*60*60*1000*2)
    }
    
    this.getGoodsDetail()
    // store.dispatch("getCartInfo", { userId: store.state.userId })
    // console.log(store.state.userId, store.state.goodsDetail)
  },
  methods:{
    time_range (beginTime, endTime) {
        var strb = beginTime.split (":");
        if (strb.length != 2) {
            return false;
        }
    
        var stre = endTime.split (":");
        if (stre.length != 2) {
            return false;
      }

      var b = new Date ();
      var e = new Date ();
      var n = new Date ();

      b.setHours (strb[0]);
      b.setMinutes (strb[1]);
      e.setHours (stre[0]);
      e.setMinutes (stre[1]);

      if (n.getTime () - b.getTime () > 0 && n.getTime () - e.getTime () < 0) {
          return true;
      } else {
          return false;
      }
    },
    createOrder(){
      if(this.$route.query.categoryName == '套餐'){
        if(this.tianshu>0){
          this.$router.push({path:'/bjyyq/createOrder',query:{id:this.$route.query.id,type:'taocan'}})
        }else{
          Toast({
            message: "请选择配餐时间段"
          });
        }
      }else if(this.$route.query.categoryName == '营养咨询'){
        this.$router.push({path:'/bjyyq/createOrder',query:{id:this.$route.query.id,type:'yyzx'}})
      }else if(this.$route.query.categoryName == '特医食品'){
        this.$router.push({path:'/bjyyq/createOrder',query:{id:this.$route.query.id,type:'notaocao'}})
      }
      
    },
    formatDate(date){
      date = new Date(date);
      var y=date.getFullYear();
      var m=date.getMonth()+1;
      var d=date.getDate();
      m = m<10?("0"+m):m;
      d = d<10?("0"+d):d;
      return y+"-"+m+"-"+d;
    },
    fun_date(aa,val){
      // var date1 = new Date(val),
      // time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
      // var date2 = new Date(date1);
      // date2.setDate(date1.getDate()+aa);
      // var time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate()
      let time2 = new Date(new Date(val).getTime() + 24*60*60*1000*aa)
      console.log(time2,'time2')
      return time2
    },
    handleConfirm(val){
      console.log(val,'val')
      this.endDate = val
      this.pickerValue.start = this.formatDate(val)
      this.pickerValue.end = this.formatDate(this.fun_date(6,val))
      this.getDateDiff(this.pickerValue.start,this.pickerValue.end)
      let store = this.$store.goods;
      console.log(this.$route.query,'this.$route.query')
      this.$http({
        url: "/bjyyq/api/setShopDate",
        data: {
          goodsId:this.$route.query.id,
          startdate:this.pickerValue.start,
          enddate:this.pickerValue.end,
          tianshu:this.tianshu
        },
        method: "get",
        success: data => {
          if (data.status == "success") {
            store.dispatch("getCartInfo", { userId:sessionStorage.userId || sessionStorage.userid,goodid: this.$route.query.id }).then(()=>{
              store.dispatch("getGoodsDetail",this.$route.query.id)
            })
          }
        }
      })
    },
    handleConfirm1(val){
      this.pickerValue.end = this.formatDate(val)
      this.getDateDiff(this.pickerValue.start,this.pickerValue.end)
      let store = this.$store.goods;
      console.log(this.$route.query,'this.$route.query')
      this.$http({
        url: "/bjyyq/api/setShopDate",
        data: {
          goodsId:this.$route.query.id,
          startdate:this.pickerValue.start,
          enddate:this.pickerValue.end,
          tianshu:this.tianshu
        },
        method: "get",
        success: data => {
          if (data.status == "success") {
            store.dispatch("getCartInfo", { userId:sessionStorage.userId || sessionStorage.userid,goodid: this.$route.query.id}).then(()=>{
              store.dispatch("getGoodsDetail",this.$route.query.id)
            })
          }
        }
      })
    },
    getDateDiff(begin, end) {
      // 在时间Date的原型中定义一个format方法
      Date.prototype.format = function() {
        var s = ""; // 定义一个字符串，目的，要时间格式按照我们的要求拼接
        var month = this.getMonth() + 1;
        var day = this.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (day >= 0 && day <= 9) {
          day = "0" + day;
        }
        s += this.getFullYear() + "-";
        s += month + "-";
        s += day;
        return s; // 得到的格式如 "2018-11-20"
      };

      var ab = begin.split("-"); // 把日期参数分割，注意，如果以'/'连接，则分割'/'
      var ae = end.split("-");
      var db = new Date();
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]); // 返回符合UTC的时间格式
      var de = new Date();
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
      var unixDb = db.getTime();
      var unixDe = de.getTime();
      var arr = [];
      for (var k = unixDb; k <= unixDe; ) {
        arr.push(new Date(parseInt(k)).format());
        k = k + 24 * 60 * 60 * 1000;
      }
      this.tianshu = arr.length
      // return arr;
    },
    getDateDiff1(date1,date2){
      console.log(date1,date2,'date1,date2')
      date1 = date1.replace('年','-')
      date1 = date1.replace('月','-')
      date1 = date1.replace('号','-')
      date2 = date2.replace('年','-')
      date2 = date2.replace('月','-')
      date2 = date2.replace('号','-')
      var arr1=date1.split('-');
      var arr2=date2.split('-');
      var d1=new Date(arr1[0],arr1[1],arr1[2]);
      var d2=new Date(arr2[0],arr2[1],arr2[2]);
      console.log(d2.getTime()/(1000*3600*24),d1.getTime()/(1000*3600*24),((d2.getTime()-d1.getTime())/(1000*3600*24) + 1)<=0,(d2.getTime()-d1.getTime())/(1000*3600*24),'s]]]]')
      // if(((d2.getTime()-d1.getTime())/(1000*3600*24) + 1)<=0){
      //   return true
      // }else{
      this.tianshu = (d2.getTime()-d1.getTime())/(1000*3600*24) + 1
      // }
      
      // console.log(this.tianshu,'this.tianshu')
      // alert((d2.getTime()-d1.getTime())/(1000*3600*24));
    },
    //设置开始时间
    setStartTime(){
      this.$refs.pickerLeft.open();
    },
    setStartTime1(){
      this.$refs.pickerRight.open();
    },
    getGoodsDetail(){
      let store = this.$store.goods;
      let goodsId = this.$route.query.id
      store.dispatch("getGoodsDetail",goodsId).then(()=>{
        console.log(this.$store.goods.state,'this.$store.goods.state')
        if(this.$store.goods.state.goodsDetail.startdate && this.$store.goods.state.goodsDetail.enddate){
          this.pickerValue.start = this.$store.goods.state.goodsDetail.startdate
          this.pickerValue.end = this.$store.goods.state.goodsDetail.enddate
          this.tianshu = this.$store.goods.state.goodsDetail.quantity
        }
      })
    },
    //购物车添加减少
    num(id, temp) {
      let store = this.$store.goods;
      console.log(store,'store')
      store.dispatch("goodNum", {
        goodId: id,
        type: temp,
        userId: sessionStorage.userId || sessionStorage.userid
      }).then(()=>{
        store.dispatch("getCartInfo", { userId:sessionStorage.userId || sessionStorage.userid }).then(()=>{
          store.dispatch("getGoodsDetail",id)
        })
      })
    },
  }
}
</script>
<style lang="less">
.goodsDetail{
  .mint-datetime-action{
    color:#41b396!important;
  }
}

</style>
<style lang="less" scoped>
  .goodsDetail{
    width: 100%;
    box-sizing: border-box;
    background: #F2F2F2;
    font-size: 12px;
    
    .shop{
      padding:0px 15px;
      background: #fff;
      margin-top:10px;
      border-top:1px solid #fff;
      padding-bottom: 5px;
      >div{
        &:first-child{
          margin:15px 0px;
          font-size: 16px;
          border-left: 2px solid #41b396;
          padding-left: 3px;
          // margin-bottom: 10px;
        }
      }
    }
    .goods_detail{
      width: 100%;
      background:#fff;
      .price_box{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding:10px 15px;
      }
      .count_price{
        color:red;
        font-size: 24px;
      }
      >p{
        padding-left: 15px;
        padding-top: 15px;
        padding-bottom: 5px;
        font-size: 18px;
        color: #333333;
        font-weight: bold;
      }
      .keywords{
        padding-right:15px;
        span{
          padding: 4px 10px;
          background: #F2F2F2;
          margin-left: 15px;
          margin-top: 5px;
          margin-bottom: 5px;
          display: inline-block;
        }
      }
    }
    .goods_detail_swiper{
      width: 100%;
      height: 160px;
      img{
        width:100%;
      }
    }
    .add_del{
        // position: absolute;
        // right: 0px;
        // top:5px;
        display: flex;
        align-items: center;
        span:first-child,span:last-child{
            display: inline-block;
            width: 20px;
            height: 20px;
            background: #41b396;
            font-size: 16px;
            color: #fff;
            border-radius: 100%;
            font-weight: bold;
            text-align: center;
            line-height: 20px;
        }
        span:nth-child(2){
            font-size: 14px;
            padding: 10px;
        }
        .none{
            display: none!important;
        }
    }
    .dingcanDate{
      padding:0px 15px;
      background: #fff;
      margin-top:10px;
      border-top:1px solid #fff;
      margin-bottom: 50px;
      >div{
        &:first-child{
          margin:15px 0px;
          font-size: 16px;
          border-left: 2px solid #41b396;
          padding-left: 3px;
        }
      }
      .dingcanDate-xuanze{
        display:flex;
        flex-direction: row;
        justify-content: space-between;
        .shijian{
          font-size: 12px;
          color:#41b396;
          padding:5px 0px;
        }
        .shijian_button{
          font-size: 14px;
          background: #F2F2F2;
          width:140px;
          height:25px;
          line-height:25px;
        }
      }
      .bottom{
        font-size:15px;
        font-family:PingFang SC;
        font-weight:500;
        color:#41b396;
        padding-top: 10px;
        // background:#41b396;
        // color:#fff;
        // line-height: 25px;
        // text-align: center;
        // font-size: 12px;
        // margin-top:20px;
      }
    }
    .none{
      display: none;
    }
    .footer{
      width: 100%;
      height: 50px;
      background: #41b396;
      position: fixed;
      bottom: 0px;
      .price{
        color:#fff;
        font-size: 18px;
        line-height: 50px;
        >span{
          font-size: 14px;
          padding-left:15px;
        }
      }
      .pay{
        position: absolute;
        right: 15px;
        font-size: 16px;
        // line-height: 50px;
        color: #fff;
        top:15px;
        .jiantou{
            display: inline-block;
            width: 9px;
            height: 9px;
            border-top: 2px solid #ffffff;
            border-right: 2px solid #ffffff;
            transform: rotate(45deg);
        }
      }
    }
  }
</style>

