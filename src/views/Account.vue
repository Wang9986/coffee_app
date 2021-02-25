<template>
  <div class="account">
    <van-nav-bar
      title="个人资料"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="goback"
    />

    <div class="account-bg"></div>

    <div class="list-box">
      <van-cell title="头像">
        <div class="avatar fr">
          <img class="auto-img" :src="userInfo.userImg" alt="" />
          <van-uploader class="uploader-box" :after-read="uploadUserImg" />
        </div>
      </van-cell>
      <van-cell title="用户id">
        <div class="fr">{{ userInfo.userId }}</div>
      </van-cell>
      <van-cell title="手机号">
        <div class="fr">{{ userInfo.phone }}</div>
      </van-cell>
      <van-cell title="昵称">
        <div class="fr">
          <input
            class="nickname"
            type="text"
            v-model="userInfo.nickName"
            @change="modifyUserInfo('nickName', '/updateNickName')"
          />
        </div>
      </van-cell>

      <div class="desc-box">
        <div class="desc-title">简介</div>
        <div>
          <textarea
            v-model="userInfo.desc"
            class="text-area"
            placeholder="这家伙很懒，什么都没有留下"
            @change="modifyUserInfo('desc', '/updateDesc')"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/account.less";
import { serail } from "../assets/js/serail.js";

export default {
  data() {
    return {
      userInfo: {},
      maxSize: 1 * 1024 * 1024,
    };
  },

  created() {
    this.getUserInfo();
  },

  methods: {
    goback() {
      this.$router.go(-1);
    },

    //获取个人资料
    getUserInfo() {
      let tokenString = localStorage.getItem("tokenString");
      console.log("tokenString ==> ", tokenString);

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
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
        url: this.baseUrl + "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          console.log("res getUserInfo ==> ", res);
          this.$toast.clear();

          if (res.data.code == "B001") {
            this.userInfo = res.data.result[0];
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //上传头像
    uploadUserImg(file) {
      let tokenString = localStorage.getItem("tokenString");
      console.log("tokenString ==> ", tokenString);

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
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
        url: this.baseUrl + "/updateAvatar",
        data,
      })
        .then((res) => {
          console.log("res uploadUserImg ==> ", res);
          this.$toast.clear();

          if (res.data.code == "H001") {
            this.userInfo.userImg = res.data.userImg;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //修改用户信息
    modifyUserInfo(key, url) {
      let tokenString = localStorage.getItem("tokenString");
      console.log("tokenString ==> ", tokenString);

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      
      let data = serail.queryString({
        appkey: this.appkey,
        tokenString,
        [key]:this.userInfo[key]
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
        url, 
        data,
      })
        .then((res) => {
          console.log("res modifyUserInfo ==> ", res);
          this.$toast.clear();

          if (res.data.code == "H001") {
            this.userInfo.userImg = res.data.userImg;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

  },
};
</script>

