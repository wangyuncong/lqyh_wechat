<template>
  <div class="editAddress">
    <div v-wechat-title="$route.meta.title"></div>
    <div class="header">
      <mt-header title="新增收货地址">
        <router-link to slot="left">
          <mt-button icon="back" @click.native="$router.back(-1)"></mt-button>
        </router-link>
      </mt-header>
    </div>
    <div class="shuru">
      <mt-field label="收货人" placeholder="请输入收货人姓名" v-model="custname"></mt-field>
      <mt-field label="联系电话" placeholder="请输入手机号" v-model="phonenum"></mt-field>
      <div @click="setPopupVisible">
        <mt-cell class="area" title="收货地址" is-link>
          <span style="color:#333333">{{myAddressProvince}}{{myAddressCity}}{{myAddresscounty}}</span>
        </mt-cell>
      </div>
      <mt-field type="textarea" rows="1" label="详细地址" placeholder="请输入详细地址" v-model="addrinfo"></mt-field>
    </div>
    <div class="footer" @click="saveAddress">保存</div>
    <mt-popup class="editModal" v-model="popupVisible" position="center">
      <mt-picker :slots="myAddressSlots" valueKey="name" @change="onMyAddressChange"></mt-picker>
      <div class="button">
        <mt-button size="small" type="primary" @click="popupVisible = false">确定</mt-button>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import { Field, Picker, Popup, MessageBox, Toast } from "mint-ui";
import myaddress from "./area.json";
import { setTimeout } from "timers";
export default {
  name: "editAddress",
  data() {
    return {
      custname: "",
      addrinfo: "",
      phonenum: "",
      popupVisible: false,
      addrId: undefined,
      myAddressSlots: [
        {
          flex: 1,
          defaultIndex: 1,
          values: myaddress, //省份数组
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot2"
        },
        {
          flex: 1,
          values: myaddress[0].children,
          className: "slot3",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot4"
        },
        {
          flex: 1,
          values: myaddress[0].children[0].children,
          className: "slot5",
          textAlign: "center"
        }
      ],
      myAddressProvince: "省",
      myAddressCity: "市",
      myAddresscounty: "区/县"
    };
  },
  components: {
    Field,
    "mt-picker": Picker,
    Popup
  },
  mounted() {
    this.$nextTick(() => {
      //vue里面全部加载好了再执行的函数 （类似于setTimeout）
      this.myAddressSlots[0].defaultIndex = 0;
      // 这里的值需要和 data里面 defaultIndex 的值不一样才能够初始化
      //因为我没有看过源码（我猜测是因为数据没有改变，不会触发更新）
      let message = JSON.parse(this.$route.query.message);
      if (message) {
        this.addrId = message.id;
        this.custname = message.custname;
        this.addrinfo = message.addrinfo;
        this.phonenum = message.phonenum;
        console.log(message.area.split("/"), message.area.split("/")[2]);
        setTimeout(() => {
          this.myAddressProvince = message.area.split("/")[0];
          this.myAddressCity = message.area.split("/")[1];
          this.myAddresscounty = message.area.split("/")[2];
        }, 0);
      }
    });
  },
  methods: {
    saveAddress() {
      if (
        this.custname == "" ||
        this.addrinfo == "" ||
        this.phonenum == "" ||
        this.myAddressProvince == "" ||
        this.myAddressCity == "" ||
        this.myAddresscounty == ""
      ) {
        MessageBox({
          title: "提示",
          message: "请检查是否全部输入",
          showCancelButton: true
        });
        return;
      }
      if (this.phonenum.length !== 11) {
        return MessageBox({
          title: "提示",
          message: "请输入正确手机号"
        });
      }
      this.$http({
        url: "/bjyyq/api/editAdress",
        data: {
          id: this.addrId,
          custname: this.custname,
          addrinfo: this.addrinfo,
          phonenum: this.phonenum,
          area: `${this.myAddressProvince}/${this.myAddressCity}/${this.myAddresscounty}`,
          isdefault: "1"
        },
        method: "get",
        success: data => {
          if (data.status == "success") {
            Toast({
              message: "操作成功",
              iconClass: "icon icon-success"
            });
            this.$router.go(-1);
          }
        }
      });
    },
    setPopupVisible() {
      console.log("000");
      this.popupVisible = true;
    },
    onMyAddressChange(picker, values) {
      console.log(picker, values, "picker, values");
      picker.setSlotValues(1, values[0].children);
      picker.setSlotValues(2, values[1].children);
      myaddress.map((item, index) => {
        if (item.code == values[0].code) {
          picker.setSlotValues(2, item.children[0].children);
        }
      });
      this.myAddressProvince = values[0].name;
      this.myAddressCity = values[1].name;
      this.myAddresscounty = values[2].name;
    }
  }
};
</script>
<style lang="less">
.editAddress {
  .mint-header-title {
    overflow: unset;
    color: #2c2c2c !important;
    font-size: 18px;
    font-weight: bold;
  }
  .shuru {
    color: #333333;
    .area {
      .mint-cell-title {
        flex: none;
        width: 2.8rem;
      }

      // width: 250px;
      // display: inline-block;
    }
  }
}
</style>
<style lang="less" scoped>
.editAddress {
  .mint-header {
    background: #fff;
    color: #ccc;
  }
  .mint-header-title {
    overflow: unset;
    color: #2c2c2c !important;
    font-size: 18px;
  }
  .shuru {
    .area {
      .mint-cell-title {
        flex: none;
      }

      // width: 250px;
      // display: inline-block;
    }
  }
  .editModal {
    width: 345px;
    .button {
      text-align: center;
      padding: 15px 0px;
      button {
        margin-left: 50px;
        &:nth-child(1) {
          margin-left: 0px;
        }
      }
    }
  }
  .footer {
    background: #41b497;
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