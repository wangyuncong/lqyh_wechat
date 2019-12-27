<!--
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2019-11-08 17:51:03
 * @LastEditors: 
 * @LastEditTime: 2019-11-11 17:55:16
 -->

<template>
  <div class="seniority">
    <div class="inputDi">
      <span>姓名</span>
      <input type="text" v-model="name" placeholder="请输入您的姓名" />
    </div>
    <div class="inputDi">
      <span>机构</span>
      <input type="text" v-model="jigou" placeholder="请输入您的机构" />
    </div>
    <div class="br"></div>
    <div class="img" v-if="!imgUrl" @click="file">
      <img src="/static/images/wfewl.png" alt />
      <p>上传资质文件</p>
    </div>
    <div class="img" v-else @click="file">
      <img :src="imgUrl" style="width:100%;height:100%;margin-bottom: 0px;" alt />
    </div>
    <van-uploader
      v-model="img"
      :before-read="donhua"
      ref="refUp"
      style="margin-top:10px;display:none;"
      :after-read="afterRead"
    />
    <p style="text-indent: 15px;margin-top: 0.5rem;font-size: 14px;">审核状态：{{statusVal}}</p>
    <button @click="go" v-if="userinfo.seniorityauditstate != 2">保存</button>
  </div>
</template>
<script>
import { Indicator, MessageBox } from "mint-ui";
import { Uploader } from "vant";
export default {
  name: "seniority",
  data() {
    return {
      jigou: "",
      name: "",
      imgUrl: "",
      userinfo: {},
      img: [],
      verificationValue: [
        {
          name: "name",
          msg: "请输入姓名",
          test: true
        },
        {
          name: "jigou",
          msg: "请输入机构",
          test: true
        },
        {
          name: "imgUrl",
          msg: "请上传图片",
          test: true
        }
      ]
    };
  },
  computed: {
    statusVal() {
      if (this.userinfo.seniorityauditstate === 0) {
        return "待审核";
      } else if (this.userinfo.seniorityauditstate === 1) {
        return "审核失败";
      } else if (this.userinfo.seniorityauditstate === 2) {
        return "审核成功";
      } else {
        return "待提交";
      }
    }
  },
  filters: {},
  components: {
    [Uploader.name]: Uploader
  },

  async mounted() {
    var _this = this;
    new Promise((v, s) => {
      if (sessionStorage.userid) {
        v(sessionStorage.userid);
      } else {
        var se = setInterval(() => {
          if (sessionStorage.userid) {
            v(sessionStorage.userid);
            clearInterval(se);
          }
        }, 10);
      }
    }).then(s => {
      this.$http({
        url: "/bjyyq/api/seniority",
        data: {
          name: _this.name,
          type: "get"
        },
        success: res => {
          var { ifp, userinfo } = res.data;
          if (ifp.length != 0) {
            _this.name = ifp[0].name;
            _this.jigou = ifp[0].organization;
            _this.imgUrl = ifp[0].img;
          }
          _this.userinfo = userinfo && userinfo[0];
        }
      });
    });
  },
  watch: {},
  methods: {
    go() {
      if (!this.msgVerify(this.verificationValue)) {
        this.$http({
          url: "/bjyyq/api/seniority",
          data: {
            name: this.name,
            jigou: this.jigou,
            imgUrl: this.imgUrl
          },
          success: res => {
            if (res.status === 0) {
              MessageBox(
                "提示",
                "您的资料已经上传，请等待系统管理员审核。"
              ).then(s => {
                wx.closeWindow();
              });
            } else {
              MessageBox("提示", "添加失败");
            }
          }
        });
      }
    },
    donhua(res) {
      Indicator.open({
        text: "上传中...",
        spinnerType: "fading-circle"
      });
      return true;
    },

    msgVerify(list) {
      var b = [];
      list.forEach(res => {
        // 验证是否不存在
        if (typeof res.test === "boolean") {
          // 为true就是验证存在
          if (res.test === true) {
            if (!this[res.name] && this[res.name] !== 0) {
              b.push(res);
            }
            // 验证不存在
          } else {
            if (this[res.name] || this[res.name] === 0) {
              b.push(res);
            }
          }
        }
        // if (typeof res.test === 'object' && !this[res.name]) {
        //   b.push(res);
        // }
      });
      var v = false;
      if (b.length != 0) {
        v = b;
        MessageBox("提示", b[0].msg);
      }
      return v;
    },
    afterRead(res) {
      if (res.length == undefined) {
        this.compressImg(res.content, 0.3, base64 => {
          res.content = base64;
          this.imgAdd(res, res.file.name);
        });
      } else {
        res.forEach((element, index) => {
          this.compressImg(res.content, 0.3, base64 => {
            res.content = base64;
            this.imgAdd(element, element.file.name, index);
          });
        });
      }
    },
    compressImg(base64, scale, callback) {
      const img = new Image();
      img.src = base64;
      img.onload = function() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.setAttribute("width", this.width);
        canvas.setAttribute("height", this.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 转成base64 文件
        let base64 = canvas.toDataURL("image/jpeg");
        // 根据自己需求填写大小 我的目标是小于3兆
        base64 = canvas.toDataURL("image/jpeg", scale);
        // baser64 TO blob 这一块如果不懂可以自行百度，我就不加注释了
        const arr = base64.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bytes = atob(arr[1]);
        const bytesLength = bytes.length;
        const u8arr = new Uint8Array(bytesLength);
        for (let i = 0; i < bytes.length; i++) {
          u8arr[i] = bytes.charCodeAt(i);
        }
        const blob = new Blob([u8arr], { type: mime });
        // 回调函数 根据需求返回二进制数据或者base64数据，我的项目都给返回了
        callback(base64);
      };
    },
    imgAdd(res, name, index) {
      this.$http({
        url: "/bjyyq/api/imgAdd",
        data: {
          base_64: res.content,
          name: name.split(",")
        },
        success: resCl => {
          // 获取当前是哪个图片 根据base64判断
          this.img.splice(0, 1);
          this.imgUrl = sessionStorage.img + resCl.url;
          Indicator.close();
        }
      });
    },
    file() {
      if (this.userinfo.seniorityauditstate === 2) {
        return;
      }
      var input = document.querySelector('[type="file"]');
      input.click();
    }
  }
};
</script>
<style lang='less' src='./index.less' scoped>
</style>