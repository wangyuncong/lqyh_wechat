<template>
  <div class="consulting">
    <div class="consulting-main-left">
        <div class="tabs">
          <span
            :class="index ==activeIndex?'active':''"
            @click="clickTab(index)"
            v-for="(item,index) in tabs"
            :key="index"
            style="position:relative"
            
          >
            {{item.name}}
            <i v-if="item.num!=null&&item.num!=0" class="jiaobiao" style="position:absolute;right:15px;top:5px">{{item.num}}</i>
          </span>
        </div>
        <div
          class="consulting-main-left-info"
          
          :key="index"
          v-for="(item,index) in tableData"
          
        >
          <img :src="item.img" alt />
          <div class="main-info-div" @click.stop="tableSelect(item)">
            <p style="fontSize:15px;width:80px;">{{item.userinfo ? item.userinfo.datavalue : item.name}}<span v-if="item.repliernum!=null&&item.repliernum!=0" class="jiaobiao">{{item.repliernum}}</span></p>
            <p style="color:#999999">{{item.updatetime}}</p>
            <div>
              <p class="zhaunchuli" @click.stop="zhuanYYS(item)" v-if="userinfoObj.roleid!=3 && userinfoObj.roleid!=9 && activeIndex==0">转营养师</p>
              <p class="zhaunchuli" @click.stop="zhuanKF(item)" v-if="(userinfoObj.roleid==3 || userinfoObj.roleid==9) && activeIndex==0">转客服</p>
              <p class="zhaunchuli" @click.stop="shouli(item)" v-if="activeIndex!=0">受理</p>
              <!-- <p class="zhaunchuli" @click.stop="zhuanKF(item)">转客服</p>  -->
              <!-- <template>
                <el-dropdown
                  v-if="activeIndex==0"
                  trigger="hover"
                  @command="(item1)=>changeShouliren(item,item1)"
                >
                  <p class="zhaunchuli">转处理</p>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(item1,index1) in dietitianList"
                      :command="item1"
                      :key="index1"
                    >{{item1.username}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template> -->
            </div>
          </div>
          <!-- <div class="right" v-if="activeIndex==0">
              <p class="zhaunchuli" @click.stop="popupVisible=!popupVisible">转处理</p>
              <mt-popup
                v-model="popupVisible"
                position="bottom"
                class="zixun_model"
              >
                <div
                  class="zhuanchuliren"
                  v-for="(item1,index1) in dietitianList"
                  @click="(item1)=>changeShouliren(item,item1)"
                  :key="index1"
                >{{(item1.username!=''&&item1.username!=null)?item1.username:item1.name}}
                </div>
              </mt-popup>
          </div> -->
        </div>
      </div>
  </div>
</template>
<script>
import { Popup } from 'mint-ui';
import Vue from 'vue'
Vue.component(Popup.name, Popup);
export default {
  name:'callCenter',
  data() {
    return {
      // tabs: ["已受理咨询", "未受理咨询"],
      tabs:[
        {
          name:'已受理咨询',
          num:0
        },{
          name:'未受理咨询',
          num:0
        }
      ],
      activeIndex: 0,
      tableData: [],
      dietitianList: [],
      infoUserid: "",
      popupVisible:false,
      userinfoObj:{}
    };
  },
  created() {

    this.activeIndex = 0
    new Promise((v, s) => {
      if (
        this._Vuex.state.userInfo.roleid ||
        process.env.NODE_ENV !== "production"
      ) {
        v(this._Vuex.state.userInfo.roleid);
      } else {
        var se = setInterval(() => {
          if (this._Vuex.state.userInfo.roleid) {
            v(this._Vuex.state.userInfo.roleid);
            clearInterval(se);
          }
        }, 10);
      }
    }).then(()=>{
      this.userinfoObj = this._Vuex.state.userInfo
      this.getList(1);
      this.getList(this.activeIndex);
      this.getAllyys();
      let _this = this
      function runEvery10Sec() { 
          // 1000 * 10 = 10 秒钟
          _this.s = setTimeout(runEvery10Sec , 1000 * 60*1 ); 
          
          _this.getList(0);
          _this.getList(1);
          _this.getList(_this.activeIndex)
      }
      runEvery10Sec()
    })
    
    // console.log(this._Vuex.state.userInfo,'this._Vuex.state.userInfo')
    
    
  },
  methods:{
    shouli(msg){
      this.$http({
        url: "/bjyyq/apimg/consultingAction",
        data: { replierid:sessionStorage.userid, chatuserid:msg.userid, id:msg.id },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.getList(this.activeIndex);
            // this.$message({
            //   message: "更改成功",
            //   type: "success",
            //   duration: 1000,
            //   center: true
            // });
            
          }
        }
      })
    },
    zhuanYYS(tableMsg){
      console.log(tableMsg,'tableMsg')
      let userid = tableMsg.userid;
      let id = tableMsg.id;
      this.$http({
        url: "/bjyyq/apimg/userDietitianInfo",
        data: {chatuserid:userid},
        method: "get",
        success: data => {
          if (data.status === "success") {
            let replierid = data.data[0].dietitianid
            this.$http({
              url: "/bjyyq/apimg/consultingAction",
              data: { replierid, chatuserid:userid, id },
              method: "get",
              success: data => {
                if (data.status === "success") {
                  this.getList(this.activeIndex);
                  // this.$message({
                  //   message: "更改成功",
                  //   type: "success",
                  //   duration: 1000,
                  //   center: true
                  // });
                  
                }
              }
            })
          }
        }
      })
    },
    zhuanKF(tableMsg){
      let userid = tableMsg.userid;
      let id = tableMsg.id;
      this.$http({
        url: "/bjyyq/apimg/dietitianList",
        data: { roleid: `'12','7','6'` },
        method: "get",
        success: data => {
          if (data.status === "success") {
            let arr = data.data;
            let replierid = arr[0].id
            this.$http({
              url: "/bjyyq/apimg/consultingAction",
              data: { replierid, chatuserid:userid, id },
              method: "get",
              success: data => {
                if (data.status === "success") {
                  this.getList(this.activeIndex);
                  // this.$message({
                  //   message: "更改成功",
                  //   type: "success",
                  //   duration: 1000,
                  //   center: true
                  // });
                  
                }
              }
            })
          }
        }
      });
    },
    getAllyys() {
      this.$http({
        url: "/bjyyq/apimg/dietitianList",
        data: { roleid: 3 },
        method: "get",
        success: data => {
          if (data.status === "success") {
            let arr = data.data;
            arr.map(item => {
              if (item.id != sessionStorage.userid) {
                this.dietitianList.push(item);
              }
            });
          }
        }
      });
    },
    tableSelect(item) {
      if(this.activeIndex==0){
        this.$router.push({ path: "/callCenterChat",query:{userid:item.userid} });
      }
      
      // this.infoUserid = "";
      // this.$nextTick(() => {
      //   this.infoUserid = item.userid;
      // });
    },
    changeShouliren(tableMsg, itemMsg) {
      let replierid = itemMsg.id;
      let userid = tableMsg.userid;
      let id = tableMsg.id;
      this.popupVisible = false
      this.$http({
        url: "/bjyyq/apimg/consultingAction",
        data: { replierid, userid, id },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.getList(this.activeIndex);
            this.$message({
              message: "更改成功",
              type: "success",
              duration: 1000,
              center: true
            });
          }
        }
      });
    },
    clickTab($index) {
      this.activeIndex = $index;
      this.popupVisible = false
      this.getList(this.activeIndex);
    },
    getList(activeIndex) {
      if (activeIndex == 0) {
        this.$http({
          url: "/bjyyq/apimg/consultingList",
          data: { replierid: sessionStorage.userid },
          method: "get",
          success: data => {
            if (data.status === "success") {
              this.tableData = data.data;
              this.tabs[activeIndex].num = 0
              this.tableData.map((item,index)=>{
                this.tabs[activeIndex].num+=Number(item.repliernum)
              })
              console.log(this.tabs,'this.tabs000000')
            }
          }
        });
      } else {
        this.$http({
          url: "/bjyyq/apimg/consultingList",
          data: {},
          method: "get",
          success: data => {
            if (data.status === "success") {
              this.tableData = data.data;
              this.tabs[activeIndex].num = 0
              this.tableData.map((item,index)=>{
                this.tabs[activeIndex].num+=Number(item.repliernum)
              })
              console.log(this.tabs,'this.tabs11111')
            }
          }
        });
      }
    }
  }
}
</script>
<style lang="less">
.right{
  .v-modal{
    bottom: 0px!important;
  }
  .zixun_model{
    width: 100%;
  }
}
</style>
<style lang="less" scoped>
.consulting {
  width: 100%;
  height: 100%;
  .jiaobiao{
    background: red;
    color: #fff;
    padding:2px 5px;
    // padding:5px;
    border-radius: 10px;
    box-sizing: border-box;
    font-size: 12px;
    margin-left:5px;
  }
  .tabs {
    display: flex;
    span{
      flex: 1;
      text-align: center;
      padding:10px 0px;
      font-weight: bold;
      color:#fff;
      background: #8278CC
    }
    .active {
      // background: #ecf5ff;
      color: #fff;
      background:#5847DD
    }
    .el-button:hover {
      background: #5847DD;
    }
  }
  .consulting-main-left-info{
    display: flex;
    padding:9px 15px;
    border-bottom: 1px solid #F2F2F2;
    .main-info-div{
      flex: 1;
      padding:0px 10px;
      position: relative;
      
    }
    img{
      width: 32px;
      height: 32px;
    }
    .zhaunchuli{
      color:#fff;
      padding:4px 13px;
      border-radius: 15px;
      background: #5847DD;
      align-items: center;
      position: absolute;
      right:5px;
      top:5px;
    }
  }
  .zhuanchuliren{
    display: block;
    background: #fff;
    width: 100%;
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #ccc;
    &:active{
      background: #e8e5e5
    }
  }
}
</style>