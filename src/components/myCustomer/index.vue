<template>
  <div class="zhuanyiMycustomer">
    <div class="middlebox">
      <span style="marginRight:5px;">选择:</span>
      <el-select v-model="dietitianid" placeholder="请选择">
        <el-option
          v-for="item in allYYS"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      
    </div>
    <div class="buttonbox" style="marginTop:30px">
      <el-button type="primary" @click="zhuanyi">
        确定
      </el-button>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { DatetimePicker,Toast } from 'mint-ui';
Vue.component(Toast.name, Toast);

export default {
  name:'zhuanyiMycustomer',
  data(){
    return {
      allYYS:[],
      dietitianid:''
    }
  },
  created(){
    this.getallYYS()
  },
  methods:{
    getallYYS(){
      this.$http({
        url: "/bjyyq/apimg/dietitianList",
        data: { roleid: `'3'` },
        method: "get",
        success: data => {
          if (data.status === "success") {
            // let arr = data.data;
            this.allYYS = data.data
          }
        }
      });
    },
    zhuanyi(){
      this.$http({
        url: "/bjyyq/apimg/setDietitian?time="+new Date().getTime(),
        data: { userid: this.$route.query.zhuanyiuserid,dietitianid:this.dietitianid },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.sendtemplate()
          }
        }
      });
    },
    sendtemplate(){
      this.$http({
        url: "/bjyyq/apimg/sendtemplate?time="+new Date().getTime(),
        data: { userid: this.$route.query.zhuanyiuserid,dietitianid:this.dietitianid },
        method: "get",
        success: data => {
          if (data.status === "success") {
            Toast({
              message: "转移成功"
            });
          }
        }
      });
    },
  }
}
</script>
<style lang="less" scoped>
.zhuanyiMycustomer{
  // display: flex;
  height: 100vh;
  justify-content: center;
  padding-top: 150px;
  .middlebox,.buttonbox{
    align-items: center;
    justify-content: center;
    // position: relative;
    // top:50%;
    // left:50%;
    // transform: translate(-50%,0)
    // margin: 50px auto;
    display: flex;
  }
}
</style>
