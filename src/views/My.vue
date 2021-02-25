<template>
  <div class="my">
    <div class="my-bg" :style="{ backgroundImage: `url(${userInfo.userBg})` }">
      <div class="my-bg-info" v-if="isLogin">
        <div class="bg-change clearfix">
          <p>
            更换背景
            <van-uploader
              v-if="isLogin"
              class="uploader-box"
              :after-read="upload"
            />
          </p>
        </div>
        <div class="my-bg-content">
          <div class="head-img clearfix fl">
            <img
              src="../assets/images/海绵宝宝.jpg"
              alt
            />
          </div>
          <div class="my-info fl clearfix">
            <div class="nickname">{{ userInfo.nickName }}</div>
            <div class="desc">
              {{
                userInfo.desc == ""
                  ? "这个家伙很懒，什么都没留下"
                  : userInfo.desc
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="not-login" v-else>
        <span @click="goLogin">请先登录</span>
      </div>
    </div>
    <div class="my-content">
      <div class="lists">
        <van-cell
          :title="item.title"
          :to="item.to"
          size="large"
          is-link
          v-for="(item, index) in lists"
          :key="index"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/my.less";
import { serail } from "../assets/js/serail.js";
export default {
  name: "My",
  data() {
    return {
      lists: [
        { title: "个人资料", to: { name: "Account" } },
        { title: "我的订单", to: { name: "Order" } },
        { title: "我的收藏", to: { name: "Like" } },
        { title: "收货地址", to: { name: "AddressList" } },
        { title: "安全中心", to: { name: "Secure" } },
      ],
      isLogin: false,
      userInfo: {},
      maxSize: 1 * 1024 * 1024,
    };
  },

  created() {
    this.getUserInfo();
  },

  methods: {
    goLogin() {
      this.$router.push({ name: "Login" });
    },

    //查询用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("tokenString");
      console.log("tokenString ==> ", tokenString);

      if (!tokenString) {
        console.log("浏览器token不存在");
        // return this.$router.push({ name: "Login" });
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        //请求方式
        method: "GET",
        url: this.baseUrl + "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          console.log("res getUserInfo ==> ", res);
          this.$toast.clear();

          if (res.data.code == "A001") {
            if (res.data.result.length > 0) {
              this.isLogin = true;
              this.userInfo = res.data.result[0];
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //上传背景
    upload(file){
      let tokenString = localStorage.getItem("tokenString");
      console.log("tokenString ==> ", tokenString);

      if (!tokenString) {
        console.log("浏览器token不存在");
        // return this.$router.push({ name: "Login" });
        return;
      }

      let type = file.file.type.split("/")[1];
      let imgTypes = ["png", "gif", "jpg", "jpeg"];
      if (imgTypes.indexOf(type) === -1) {
        this.$notify({
          message: "图片类型只支持" + imgTypes.join(","),
          color: "#fff",
          background: "#5C4033",
        });
        return;
      }

      //大小
      if (this.maxSize < file.file.size) {
        this.$notify({
          message: "上传文件大小不能超过" + this.maxSize / 1024 + "KB",
          color: "#fff",
          background: "#5C4033",
        });
        return;
      }

      //获取base64
      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");

      let data = serail.queryString({
        appkey: this.appkey,
        tokenString,
        imgType: type,
        serverBase64Img: base64,
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        //请求方式
        method: "POST",
        url: this.baseUrl + "/updateUserBg",
        data,
      })
        .then((res) => {
          console.log("res upload ==> ", res);
          this.$toast.clear();

          if (res.data.code == "H001") {
            this.userInfo.userBg = res.data.userBg;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    }
  },
};
</script>