<template>
  <div class="myAdvice" id="kefuzhongxin">
    <div class="back">
      <span>
        <img @click="toBack" src="../../../../static/images/zuojiantou.png" />
      </span>
      <span>
        <i class="lineh40" @click="toBack">返回会话列表</i>
      </span>
    </div>
    <div class="bottom" id="bottom">
      <template v-for="(item,index) in list">
        <div v-if="!item.replierid" :key="index">
          <div class="myAdvice-left">
            <img :src="item.msg.img || img" @errοr="img" alt />
            <span :id="`id${index}`" @click="imgClick" class="imgbox">
              <span></span>
            </span>
          </div>
          <p
            style="transform: scale(0.8);text-indent: 28px;color: #999;margin-top: 4px;"
          >{{item.createtime}}</p>
        </div>
        <div v-if="item.replierid" :key="index">
          <div class="myAdvice-right">
            <span :id="`id${index}`" @click="imgClick" class="imgbox">
              <span></span>
            </span>
            <img :src="img" alt />
          </div>
          <p
            style="transform: scale(0.8);float: right;margin-right: 49px;color: #999;margin-top: 2px;"
          >{{item.createtime}}</p>
        </div>
      </template>
      <div class="myAdvice-bottom">
        <div style="display:inline-block">
          <van-uploader :after-read="afterRead" />
        </div>
        <input type="text" v-model="value" />
        <button @click="send">发送</button>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast, Indicator } from "mint-ui";
import { Lazyload, Uploader } from "vant";
import Vue from "vue";
Vue.use(Lazyload, {
  preLoad: 1.3,
  loading: "http://bjyyq.zhaoshuikan.com.cn/static/images/timg.gif?1",
  attempt: 1
});
var ip =
  process.env.NODE_ENV === "production"
    ? `${location.hostname}:8001`
    : "localhost:8001";
var ws;
export default {
  name: "myAdvice",
  data() {
    return {
      ws: "",
      userid: "",
      value: "",
      list: [],
      sender: "",
      img: "static/images/bdc3ca4109f57e78846eb74ab664015.png"
    };
  },
  watch: {
    list(res) {
      this.$nextTick(() => {
        res.forEach((v, i) => {
          var img = document.querySelector(`#id${i} span`);
          if (v.value.match(/src\=(.+?)\/\>/)) {
            v.value = v.value.replace(
              "<img",
              `<img :loading="'http://bjyyq.zhaoshuikan.com.cn/static/images/timg.gif'" v-lazy="'${
                v.value.match(/src\=(.+?)\/\>/)[1]
              }'"`
            );
          }
          var se = Vue.extend({
            template: `<div class="divsafew">${v.value}</div>`
          });
          new se({ el: img });
        });
        let bottom = document.getElementById("bottom");
        // let kefuzhongxin = document.getElementById('kefuzhongxin')
        // console.log(window.screen.availHeight)
        if (bottom.clientHeight > window.screen.availHeight) {
          setTimeout(() => {
            window.scrollBy(0, 50000);
          }, 10);
        }
        // console.log(bottom.clientHeight)
        // setTimeout(() => {
        //   window.scrollBy(0, 0);
        // }, 10);
      });
    }
  },
  components: {
    ["van-uploader"]: Uploader
  },
  computed: {},
  destroyed() {
    var _this = this;
    var data = {
      userid: this.userid,
      value: this.value,
      restUserId: this.restUserId,
      msg: {
        id: this.userid
      },
      type: "QKYD"
    };
    ws.close(1000, JSON.stringify(data));
  },
  mounted() {
    // let str = decodeURI(window.location.href)
    // if(str.split('?')[1]){
    //   this.userid = str.split('?')[1].split('=')[1]
    // }

    this.userid = this.$route.query.userid;
    // 获取自己的id
    ws = new WebSocket(`ws://${ip}/`);
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
      if (!sessionStorage.userid) {
        return;
      }
      this.restUserId = sessionStorage.userid;
      ws.onopen = function() {
        ws.send(
          JSON.stringify({
            userid: _this.userid,
            restUserId: _this.restUserId,
            type: "ACQUIRE"
          })
        );
      };

      ws.onmessage = function(e) {
        // 全局的replierid判断 均是发送人id 如果id存在的话 需要存到sender上面去
        if (e.data !== "{}") {
          var data = JSON.parse(e.data);
          if (data.type === "ACQUIRE") {
            data.inquire.forEach(element => {
              if (element.replierid) {
                _this.sender = element.replierid;
              }
              _this.list.push({
                userid: element.userid,
                value: element.content,
                msg: element.msg,
                createtime: element.createtime,
                replierid: element.replierid
              });
              console.log(_this.list, "_this.list");
            });
            // 添加
          } else if (data.type === "ADD") {
            _this.list.push(data);
            if (data.replierid) {
              _this.sender = element.replierid;
            }
          } else if (data.type === "success") {
            _this.list.push(data);
          }
        }
      };
    });
  },
  methods: {
    imgClick(res) {
      // 图片的话显示
      if (res.target && res.target.src) {
        // 所有图片
        var list = [res.target.src];
        // var imgbox = document.querySelectorAll(".imgbox img");
        var index = 0;
        // imgbox.forEach((e, ind) => {
        //   list.push(e.src);
        //   if (e.src === res.target.src) {
        //     index = ind;
        //   }
        // });
        ImagePreview({
          images: list,
          startPosition: index
        });
      }
    },
    afterRead(res) {
      if (res.length == undefined) {
        this.imgAdd(res, res.file.name);
      } else {
        res.forEach((element, index) => {
          this.imgAdd(element, element.file.name, index);
        });
      }
    },
    imgAdd(res, name, index) {
      Indicator.open({
        text: "上传中...",
        spinnerType: "fading-circle"
      });
      this.$http({
        url: "/bjyyq/api/imgAdd",
        data: {
          base_64: res.content,
          name: name.split(",")
        },
        success: res => {
          // console.log(res,'res///')
          // this.value = `<img src='${sessionStorage.img}${res.url}'/>`
          this.value = `<img src=http://bjyyq.zhaoshuikan.com.cn/static/${res.url} />`;
          var data = {
            userid: this.userid,
            value: this.value,
            restUserId: this.restUserId,
            msg: {
              id: this.userid
            },
            type: "ADD"
          };
          console.log(data, ws, "data");
          ws.send(JSON.stringify(data));
          this.value = "";
          // if (index) {
          //   // this.img[index] = res.url;
          // } else {
          //   // this.img.push(res.url);
          // }
          Indicator.close();
        }
      });
    },
    toBack() {
      this.$router.push({ path: "/callCenter" });
    },
    //判断用户是不是输入的表情
    isEmojiCharacter(substring) {
      for (var i = 0; i < substring.length; i++) {
        var hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
          if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1);
            var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
            if (0x1d000 <= uc && uc <= 0x1f77f) {
              return true;
            }
          }
        } else if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          if (ls == 0x20e3) {
            return true;
          }
        } else {
          if (0x2100 <= hs && hs <= 0x27ff) {
            return true;
          } else if (0x2b05 <= hs && hs <= 0x2b07) {
            return true;
          } else if (0x2934 <= hs && hs <= 0x2935) {
            return true;
          } else if (0x3297 <= hs && hs <= 0x3299) {
            return true;
          } else if (
            hs == 0xa9 ||
            hs == 0xae ||
            hs == 0x303d ||
            hs == 0x3030 ||
            hs == 0x2b55 ||
            hs == 0x2b1c ||
            hs == 0x2b1b ||
            hs == 0x2b50
          ) {
            return true;
          }
        }
      }
    },
    //编码表情
    utf16toEntities(str) {
      var patt = /[\ud800-\udbff][\udc00-\udfff]/g;
      // 检测utf16字符正则
      str = str.replace(patt, function(char) {
        var H, L, code;
        if (char.length === 2) {
          H = char.charCodeAt(0);
          // 取出高位
          L = char.charCodeAt(1);
          // 取出低位
          code = (H - 0xd800) * 0x400 + 0x10000 + L - 0xdc00;
          // 转换算法
          return "&#" + code + ";";
        } else {
          return char;
        }
      });
      return str;
    },
    send() {
      var reg = /\S/;
      console.log(this.value, "this.value");
      // if(this.value.length===0){

      //   Toast({
      //     message: "输入不能为空",

      //   });
      //   this.value = "";
      // }else{
      //   this.value = this.value.replace(new RegExp(/( )/g), '&nbsp;')
      //   var data = {
      //     userid: this.userid,
      //     value: this.value,
      //     restUserId: this.restUserId,
      //     msg: {
      //       id: this.userid
      //     },
      //     type: "ADD"
      //   };
      //   ws.send(JSON.stringify(data));
      //   this.value = "";
      // }
      if (!reg.test(this.value)) {
        Toast({
          message: "不能只输入空格"
        });
        this.value = "";
      } else {
        if (this.isEmojiCharacter(this.value)) {
          this.value = this.utf16toEntities(this.value);
          var data = {
            userid: this.userid,
            value: this.value,
            restUserId: this.restUserId,
            msg: {
              id: this.userid
            },
            type: "ADD"
          };
          ws.send(JSON.stringify(data));
          this.value = "";
        } else {
          this.value = this.value.replace(new RegExp(/( )/g), "&nbsp;");
          var data = {
            userid: this.userid,
            value: this.value,
            restUserId: this.restUserId,
            msg: {
              id: this.userid
            },
            type: "ADD"
          };
          ws.send(JSON.stringify(data));
          this.value = "";
        }
      }
      //
      // console.log(this.value,reg.test(this.value),'this.value')
    }
  }
};
</script>
<style lang='less' scoped>
.myAdvice {
  min-height: 90vh;
  background: #eee;
  width: 100%;
  padding-bottom: 72px;
  .back {
    width: 100%;
    height: 40px;
    font-size: 15px;
    background: #41b396;
    color: #fff;
    padding-left: 10px;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 1000;
    .lineh40 {
      line-height: 40px;
    }
    > span:first-child {
      position: absolute;
      top: 50%;
      transform: translate(-0%, -50%);
    }
    span {
      display: inline-block;

      img {
        width: 18px;
        display: inline-block;
        align-items: center;
      }
    }
    > span:last-child {
      width: 100%;
      margin-left: 25px;
      line-height: 40px;
      background: #41b396;
    }
  }
  .bottom {
    margin-top: 40px;
  }
  .myAdvice-bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    box-shadow: 3px 4px 5px 2px #999;
    height: 47px;
    background: white;
    input {
      width: 66%;
      height: 64%;
      margin-top: 6px;
      margin-left: 8px;
    }
    button {
      margin-left: 5px;
      width: 17%;
      height: 73%;
    }
  }
  .myAdvice-left {
    display: flex;
    justify-content: stretch;
    align-items: center;
    padding-top: 10px;
    width: 90%;
    margin: 0 auto;
    img {
      background: white;
      width: 31px;
    }
    span {
      background: white;
      display: inline-block;
      line-height: 29px;
      margin-left: 9px;
      padding: 0 10px;
      border-radius: 0px 11px;
    }
  }
  .myAdvice-right {
    display: flex;
    align-items: center;
    padding-top: 10px;
    width: 90%;
    margin: 0 auto;
    justify-content: flex-end;
    img {
      background: white;
      width: 31px;
    }
    span {
      background: white;
      display: inline-block;
      line-height: 29px;
      margin-right: 9px;
      padding: 0 13px;
      border-radius: 0px 11px;
    }
  }
}
</style>
<style lang="less">
.myAdvice {
  .van-uploader__upload {
    width: 30px;
    height: 25px !important;
    border: none;
    background-repeat: no-repeat;
    position: relative;
    top: 8px;
    left: 5px;
    padding: 0px;
    margin: 0px;
    background-image: url(../../../../static/images/sendimage.png?1);
    .van-uploader__upload-icon {
      display: none;
    }
    // background: red;
  }
  .imgbox {
    img {
      display: inline-block;
      width: 200px;
    }
  }
}
</style>


