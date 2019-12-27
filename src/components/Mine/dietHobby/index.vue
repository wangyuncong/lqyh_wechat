<!--
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2019-09-10 17:49:49
 * @LastEditors: 
 * @LastEditTime: 2019-12-02 16:16:30
 -->
<template>
  <div class="dietHobby">
    <p class="dietHobby-title">对自己的偏好食物做出选择</p>
    <p class="imgDuoxu">
      <img src="/static/images/nanguo.png" alt />不喜欢（多选）
    </p>
    <div class="dietHobby-main">
      <span
        v-for="(item,index) in list"
        @click="xihuanCLIk(item)"
        :key="index"
        :class="clssSelect(item)"
      >{{item.paramvalue}}</span>
    </div>
    <p class="dietHobby-main-title">
      其他
      <input type="text" v-model="likeElse" placeholder="请输入您不喜欢的食物" />
    </p>
    <p class="imgDuoxu" style="margin-top:30px;">
      <img src="/static/images/984acc90fd15243c151e055eb81c47f.png" alt />会过敏（多选）
    </p>
    <div class="dietHobby-main">
      <span
        v-for="(item,index) in dislike"
        @click="xihuanCLIk(item)"
        :key="index"
        :class="clssSelect1(item)"
      >{{item.paramvalue}}</span>
    </div>
    <p class="dietHobby-main-title">
      其他
      <input type="text" v-model="dislikeElse" placeholder="请输入食用后有过敏反应的食物" />
    </p>
    <button class="dietHobby-go" @click="dietHobbyAdd">保存</button>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
export default {
  name: "Discounts",
  data() {
    return {
      list: [],
      dislike: [],
      likeElse: "",
      dislikeElse: ""
    };
  },
  methods: {
    xihuanCLIk(item) {
      if (item.jinyon && item != "kon") {
        return;
      }
      if (item !== "kon") {
        item.select = !item.select;
      }
      // this.list.forEach(s => {
      //   this.dislike.forEach(v => {
      //     if (v.paramvalue === s.paramvalue) {
      //       v.jinyon = s.select;
      //     }
      //   });
      // });
      // this.dislike.forEach(s => {
      //   this.list.forEach(v => {
      //     if (v.paramvalue === s.paramvalue) {
      //       v.jinyon = s.select;
      //     }
      //   });
      // });
      this.dislike = JSON.parse(JSON.stringify(this.dislike));
    },
    clssSelect(item) {
      if (item.jinyon) {
        return "jinyon";
      }
      if (item.select) {
        return "spanSelect";
      }
    },
    clssSelect1(item) {
      if (item.jinyon) {
        return "jinyon";
      }
      if (item.select) {
        return "spanSelect1";
      }
    },
    dietHobbyAdd() {
      var like = [];
      this.list
        .filter(s => s.select)
        .forEach(s => {
          like.push(s.paramvalue);
        });
      var dislike = [];
      this.dislike
        .filter(s => s.select)
        .forEach(s => {
          dislike.push(s.paramvalue);
        });
      this.$http({
        url: "/bjyyq/api/dietHobbyAdd",
        data: {
          like: like.toString(),
          dislike: dislike.toString(),
          dislikeElse: this.dislikeElse,
          likeElse: this.likeElse
        },
        success: res => {
          if (res.status === 0) {
            this.$router.go(-1)
            return MessageBox.alert("已保存成功！");
          }
        }
      });
    }
  },
  async mounted() {
    this.$http({
      url: "/bjyyq/api/dietHobby",
      data: {},
      success: res => {
        res.data.like.filter(s => (s.select = false));
        res.data.dislike.filter(s => (s.select = false));
        if (res.data.queryList[0].length != 0) {
          var like = res.data.queryList[0][0].datavalue;
          like.split(",").forEach(s => {
            res.data.like.filter(v => {
              if (v.paramvalue === s) {
                v.select = true;
              }
              return s;
            });
          });
          var dislike = res.data.queryList[1][0].datavalue;
          dislike.split(",").forEach(s => {
            res.data.dislike.filter(v => {
              if (v.paramvalue === s) {
                v.select = true;
              }
              return s;
            });
          });
          this.likeElse = res.data.queryList[2][0].datavalue;
          this.dislikeElse = res.data.queryList[3][0].datavalue;
        }
        this.list = res.data.like;
        this.dislike = res.data.dislike;
        this.xihuanCLIk("kon");
      }
    });
  }
};
</script> 
<style lang='less' src='./index.less' scoped>
</style>
