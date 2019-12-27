<!--
 * @Descripttion: 
 * @version: 
 * @Author: Zhang Zi Fang
 * @Date: 2019-09-10 17:49:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-04 17:13:26
 -->
<template>
  <div class="register">
    <div class="register-title">
      <div :style="fileList.length < 4 ? 'padding-top: 32px;' : 'padding-top: 10px;'">
        <van-uploader multiple :before-delete="shanchu" v-model="fileList" :after-read="afterRead" />
      </div>
      <p style=" font-size: 15px;">上传检验报告</p>
    </div>
    <p class="register-p">
      <span>上传要求</span>
      <br />
      <span>
        1.体成分
        <br />2.血生化
        <br />3.血常规
        <br />4.糖耐量
        <br />如果是女生还需要：+1雌激素6项、+2子宫彩超
      </span>
    </p>
    <button @click="baocun">保存</button>
  </div>
</template>
<script>
import { MessageBox, Indicator } from "mint-ui";
import { Uploader } from "vant";
export default {
  name: "register",
  data() {
    return {
      fileList: [],
      img: []
    };
  },
  components: {
    ["van-uploader"]: Uploader
  },
  methods: {
    afterRead(res) {
      if (res.length == undefined) {
        this.imgAdd(res, res.file.name);
      } else {
        res.forEach((element, index) => {
          this.imgAdd(element, element.file.name, index);
        });
      }
    },
    shanchu(res) {
      this.fileList.forEach((s, index) => {
        if (res.url === s.url) {
          this.img.splice(index, 1);
        }
      });
      return true;
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
          if (index) {
            this.img[index] = res.url;
          } else {
            this.img.push(res.url);
          }
          Indicator.close();
        }
      });
    },
    baocun() {
      var {
        name,
        sex,
        stature,
        weight,
        BMI,
        age,
        phone,
        gestation
      } = JSON.parse(sessionStorage.linshi);
      this.$http({
        url: "/bjyyq/api/infoAdd",
        data: {
          name,
          sex,
          stature,
          weight,
          BMI,
          age,
          img: this.img,
          phone,
          gestation
        },
        success: res => {
          MessageBox.alert("已保存成功！");
          if (this.$route.query.go) {
            this.$router.push({
              path: "/svg"
            });
            return;
          }
          this.$router.push({
            path: "/bjyyq/mine"
          });
        }
      });
    }
  },
  async mounted() {
    this.$http({
      url: "/bjyyq/api/keyUserInfo",
      data: {
        element: ["img"]
      },
      success: res => {
        var img = JSON.parse(res.data[0].datavalue);
        img.forEach(s => {
          this.fileList.push({
            url: sessionStorage.img + s
          });
          this.img.push(s);
        });
      }
    });
  }
};
</script>
<style lang='less' src='./index.less' scoped>
</style>
