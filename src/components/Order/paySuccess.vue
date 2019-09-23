<template>
  <div class="paySuccess">
    <div v-if="isPaySuccess" class="content">
      <img src='../../../static/images/pay_success.png'/>
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
      isPaySuccess:true,
      s:null
    }
  },
  created(){
    let orderid = this.$route.query.orderid
    var num = 0;
    var max = 10;
    var intervalId = null;

    // function incrementNumber(){
    //   num++;
    //   if(num == max){
    //       clearInterval(innervalId);
    //       console.log('done');
    //   }
    // }

    // intervalId = 
    // window.setInterval(console.log('11'),500);
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
            window.clearInterval(this.s)
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
        background:#41B396;
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
      background:rgba(65,180,151,1);
      position: fixed;
      bottom: 0px;
      width:100%;
    }
  }
</style>