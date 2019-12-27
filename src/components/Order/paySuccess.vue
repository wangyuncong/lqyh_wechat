<template>
  <div class="paySuccess">
    <div v-if="isPaySuccess" class="content">
      <img src='../../../static/images/pay_success.png?1'/>
      <div>您的订单已支付成功</div>
      <p>稍后营养师会与您沟通配餐情况</p>
      <span @click="goMessage">补充个人信息</span>
    </div>
    <div v-if="isPaySuccess" class="footer" @click="goMine">
      完成
    </div>
  </div>
</template>
<script>
export default {
  name:'paySuccess',
  data(){
    return{
      isPaySuccess:false,
      s:null
    }
  },
  created(){
    let orderid = this.$route.query.orderid

    // 每隔  1 秒钟 运行一次，发送一个 ajax 请求
    let _this = this
    function runEvery10Sec() { 
        // 1000 * 10 = 10 秒钟
        _this.s = setTimeout(runEvery10Sec , 1000 * 1 ); 
        _this.getPayStatus(orderid)
    }
    runEvery10Sec()
  },
  methods:{
    goMessage(){
      this.$router.push({
        path:'/imessage'
        
      })
    },
    goMine(){
      this.$router.push({
        path:'/bjyyq/mine'
      })
    },
    async getPayStatus(orderid){
      await this.$http({
        url: "/bjyyq/api/getPayStatus",
        data: {
          orderid
        },
        method: "get",
        success: data => {
          if (data.status == "success") {
            this.isPaySuccess = true
             window.clearTimeout(this.s)
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .paySuccess{
    background: #EEEEEE;
    border-top: 1px solid #eee;
    .content{
      width: 200px;
      margin: 0 auto;
      margin-top:48px;
      text-align: center;
      
      min-height: 90vh;
      img{
        width: 70px;
        height: 80px;
        justify-content: center;
      }
      >div{
        font-size:36px/2;
        font-family:PingFang SC;
        font-weight:600;
        color:rgba(51,51,51,1);
        padding-top: 35px/2;
      }
      >p{
        font-size:26px/2;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        padding-top: 15px/2;
      }
      >span{
        display: block;
        background:#41b396;
        // padding:9px 23px;
        border-radius: 15px;  
        color: #fff;
        font-size: 13px;
        width: 130px;
        text-align: center;
        line-height: 30px;
        margin: 0 auto;
        margin-top: 15px;
      }
    }
    .footer{
      height: 50px;
      color: #fff;
      text-align: center;
      line-height: 50px;
      font-size: 16px;
      background:#41b396;
      position: fixed;
      bottom: 0px;
      width:100%;
    }
  }
</style>