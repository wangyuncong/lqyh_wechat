<template>
  <div class="myAdvice">
    <template v-for="(item,index) in list">
      <div v-if="item.replierid" :key="index">
        <div class="myAdvice-left">
          <img :src="item.msg.img || img" @errοr="img" alt />
          <span>{{item.value}}</span>
        </div>
        <p style="transform: scale(0.8);text-indent: 28px;color: #999;margin-top: 4px;">{{item.createtime}}</p>
      </div>
      <div v-if="!item.replierid" :key="index">
        <div class="myAdvice-right">
          <span>{{item.value}}</span>
          <img :src="item.msg.img || img" alt />
        </div>
        <p style="transform: scale(0.8);float: right;margin-right: 49px;color: #999;margin-top: 2px;">{{item.createtime}}</p>
      </div>
    </template>
    <div class="myAdvice-bottom">
      <input type="text" v-model="value" />
      <button @click="send">发送</button>
    </div>
  </div>
</template>
<script>
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
    list() {
      this.$nextTick(() => {
        setTimeout(() => {
          window.scrollBy(0, 50000);
        }, 10);
      });
    }
  },
  computed: {},
  destroyed() {
    ws.close();
  },
  mounted() {
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
      this.userid = sessionStorage.userid;
      ws.onopen = function() {
        ws.send(
          JSON.stringify({
            userid: _this.userid,
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
                createtime:element.createtime,
                replierid: element.replierid
              });
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
    send() {
      var data = {
        userid: this.userid,
        value: this.value,
        sender: this.sender,
        msg: {
          id: this.userid
        },
        type: "ADD"
      };
      ws.send(JSON.stringify(data));
      this.value = "";
    }
  }
};
</script>
<style lang='less' src='./index.less' scoped>
</style>


