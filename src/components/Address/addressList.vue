<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zhang Zi Fang
 * @Date: 2019-09-24 15:32:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-19 13:57:24
 -->
<template>
  <div class="addressList">
    <div v-wechat-title="$route.meta.title"></div>
    <!-- <div class="header">
      <mt-header title="收货地址">
        <router-link to slot="left">
          <mt-button icon="back" @click.native="Isrouter"></mt-button>
        </router-link>
      </mt-header>
    </div>-->
    <div class="ZANWSHOU" v-if="list.length == 0">
      <img src="static/images/zanwushou.png" alt />
      <p>暂无收货地址</p>
    </div>
    <div class="content">
      <div class="item" v-for="(item,index) in list" @click="listIndexClick(index)" :key="index">
        <div class="one">
          <p style="color:#333333;font-size:15px;font-weight:600;">{{item.custname}}</p>
          <p>{{item.phonenum}}</p>
        </div>
        <div class="two">
          <img src="../../../static/images/address.png?1" style="width:13px;height:17px;marginRight:7px;"/>
          <span style="color:#666666;vertical-align: top;position:relative;">{{item.addrinfo}}</span>
        </div>
        <div>
          <div class="edit">
            <!-- <mt-radio
              v-model="value"
              @change="defaultChange(item)"
              :options="[{
                label: '设为默认',
                value: item.id
              }]"
            ></mt-radio> -->
            <div @click="defaultChange(item)">
              <p :class="item.id==value?'xuanzhong':'noxuanzhong'"><span v-if="item.id==value" class="check-style-unequal-width"></span></p>
              <span style="fontSize:12px;color:#999;marginLeft:7px;">{{item.id==value?'默认地址':'设为默认'}}</span>
            </div>
            <div class="editButton">
              <p @click.stop="editAddr(item)">
                <span>
                  <img src="../../../static/images/addredit.png" />
                </span>
                <span style="fontSize:12px;color:#999">编辑</span>
              </p>
              <p @click.stop="deleteAddr(item)">
                <span>
                  <img src="../../../static/images/addrdel.png" />
                </span>
                <span style="fontSize:12px;color:#999">删除</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer" @click="addAddress">新增收货地址</div>
  </div>
</template>
<script>
import { Radio, Toast, MessageBox } from "mint-ui";
export default {
  name: "addressList",
  data() {
    return {
      list: [],
      value: "",
      name: "" //判断类型用
    };
  },
  created() {
    this.getList();
    this.name = this.$route.query.name;
  },
  components: {
    Radio
  },
  methods: {
    listIndexClick(index) {
      // 订单更改用户地址
      if (this.name === "gengxin") {
        MessageBox.confirm("确认需要更改此地址？").then(action => {
          this.$http({
            url: "/bjyyq/api/updatesite",
            data: {
              id: this.$route.query.orderid,
              addId: this.list[index].id
            },
            success: res => {
              this.$router.back(-1);
            }
          });
        });
        return;
      }

      if (this.$route.query.info) {
        return;
      }
      sessionStorage.takeINdex = index;
      this.$router.back(-1);
    },
    Isrouter() {
      this.$router.back(-1);
    },
    addAddress() {
      this.$router.push({ path: "/bjyyq/editAddress" });
    },
    editAddr(item) {
      this.$router.push({
        path: "/bjyyq/editAddress",
        query: { message: JSON.stringify(item) }
      });
    },
    deleteAddr(item) {
      MessageBox.confirm("确认删除此地址？").then(action => {
        this.$http({
          url: "/bjyyq/api/editAdress",
          data: {
            id: item.id,
            type: "delete"
          },
          method: "get",
          success: data => {
            if (data.status == "success") {
              this.getList();
              Toast({
                message: "操作成功",
                iconClass: "icon icon-success"
              });
            }
          }
        });
      });
    },
    defaultChange(item) {
      this.$http({
        url: "/bjyyq/api/editAdress",
        data: {
          id: item.id,
          custname: item.custname,
          addrinfo: item.addrinfo,
          phonenum: item.phonenum,
          area: item.area,
          isdefault: "1"
        },
        method: "get",
        success: data => {
          if (data.status == "success") {
            this.getList();
            Toast({
              message: "操作成功",
              iconClass: "icon icon-success"
            });
            // this.$router.push({path:'/bjyyq/addressList'})
          }
        }
      });
    },
    getList() {
      this.$http({
        url: "/bjyyq/api/addressList",
        data: {},
        method: "get",
        success: data => {
          if (data.status == "success") {
            this.list = data.data;
            this.list.map(item => {
              if (item.isdefault == "1") {
                this.value = item.id;
              }
            });
            // this.$router.push({path:'/bjyyq/addressList'})
          }
        }
      });
    }
  }
};
</script>
<style lang="less">
.addressList {
  background: #eeeeee;
  font-size: 14px;
  .ZANWSHOU {
    text-align: center;
    margin-top: 0.266667rem;
    height: 100vh;
    background: #eee;
    img {
      width: 28%;
    }
  }
  .mint-header-title {
    overflow: unset;
    color: #2c2c2c !important;
    font-size: 18px;
    font-weight: bold;
  }
  .mint-radiolist {
    .mint-cell {
      background: none;
      .mint-cell-wrapper {
        background: none;
        font-size: 14px;
      }
    }
  }
  .mint-radio-core {
    width: 15px;
    height: 15px;
  }
  .mint-radio-core::after {
    width: 7px;
    height: 7px;
    left: 3px;
    top: 3px;
  }
}
</style>
<style lang="less" scoped>
.addressList {
  background: #eeeeee;
  border-top: 1px solid #eeeeee;
  height: 100vh;
  .mint-header {
    background: #fff;
    color: #ccc;
  }
  .content {
    margin-bottom: 50px;
  }
  .item {
    padding: 0px 15px;
    background: #fff;
    margin-top: 15px;
    &:first-child {
      margin: 0px;
    }
  }
  .one {
    display: flex;
    justify-content: space-between;
    padding: 15px 0px;
    color: #333333;
  }
  .two {
    color: #666666;
    padding-bottom: 10px;
    vertical-align: top;
  }
  .edit {
    display: flex;
    justify-content: space-between;
    vertical-align: top;
    border-top: 1px solid #eeeeee;
    line-height: 45px;
    .noxuanzhong{
      width: 13px;
      height: 13px;
      display: inline-block;
      border:1px solid #999999;
      border-radius: 100%;
      vertical-align: text-bottom;
    }
    .xuanzhong{
      vertical-align: text-bottom;
      width: 15px;
      height: 15px;
      display: inline-block;
      // border:1px solid #999999;
      border-radius: 100%;
      background: red;
      position: relative;
      .check-style-unequal-width{
        position: absolute;
        top:1px;
        left:5px;
        display: inline-block;
        width: 4px;
        height: 8px;
        border-color: #fff;
        border-style: solid;
        border-width: 0 1.5px 1.5px 0;
        transform: rotate(45deg);
      }

    }
    .mint-radio-core {
      width: 15px;
      height: 15px;
    }

    .editButton {
      display: flex;
      > p {
        margin-left: 20px;
        // line-height: 56px;
      }
      img {
        width: 12px;
        height: 12px;
        margin-right: 3px;
        position: relative;
        top: 1px;
      }
    }
  }
  .footer {
    background: #41b396;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    position: fixed;
    bottom: 0px;
    width: 100%;
    color: #fff;
  }
}
</style>