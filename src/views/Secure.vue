<template>
  <div class="secure">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="goback"
    />
    <div class="secure-bg"></div>
    <div class="secure-box">
      <div>
        <van-cell title="修改密码" isLink @click="openPasswordPopup" />
        <van-cell title="注销账号" isLink @click="destroyAccount" />
      </div>
    </div>
    <div class="btn-box">
      <van-button round block color="#5C4033 " @click="logout"
        >退出登录</van-button
      >
    </div>
    <van-popup class="popup-box" closeable v-model="isOpen" position="bottom">
      <div class="popup-item">
        <div class="password-text">修改密码</div>
        <van-form>
          <van-field
            v-for="(item, index) in passwords"
            :key="index"
            :type="item.isPassword ? 'password' : 'text'"
            :label="item.title"
            placeholder="6-16位密码且以字母开头"
            v-model="item.password"
            :right-icon="item.isPassword ? 'closed-eye' : 'eye-o'"
            @click-right-icon="viewPassword(item, index)"
          />
          <div class="login-btn">
            <van-button
              round
              block
              color="#5C4033 "
              native-type="submit"
              @click="confirmPassword"
              >确认修改</van-button
            >
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/secure.less";

import { serail } from "../assets/js/serail.js";
import { utils } from "../assets/js/utils";

export default {
  data() {
    return {
      isOpen: false,
      passwords: {
        old: {
          password: "",
          isPassword: true,
          title: "旧密码",
        },
        new: {
          password: "",
          isPassword: true,
          title: "新密码",
        },
      },
    };
  },

  methods: {
    goback() {
      this.$router.go(-1);
    },

    //查看密码
    viewPassword(item, index) {
      item.isPassword = !item.isPassword;
    },

    //退出登录
    logout() {
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是否确认退出登录!",
          confirmButtonColor: "#5C4033",
        })
        .then(() => {
          let tokenString = localStorage.getItem("tokenString");
          console.log("tokenString ==> ", tokenString);

          if (!tokenString) {
            console.log("浏览器token不存在");
            this.$router.push({ name: "Login" });
          }

          let data = serail.queryString({
            appkey: this.appkey,
            tokenString,
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
            url: this.baseUrl + "/logout",
            data,
          })
            .then((res) => {
              console.log("res logout ==> ", res);
              this.$toast.clear();

              this.$router(res.data.msg);
            })
            .catch((err) => {
              this.$toast.clear();
              console.log("err ==> ", err);
            });
        })
        .catch(() => {});
    },

    //修改密码
    openPasswordPopup() {
      this.isOpen = true;
    },

    //确认密码
    confirmPassword() {
      let tokenString = localStorage.getItem("tokenString");
      console.log("tokenString ==> ", tokenString);

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      let o = {
        oldPassword: {
          value: this.passwords.old.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "旧密码支持字母数字_组合",
        },
        passeord: {
          value: this.passwords.new.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "新密码支持字母数字_组合",
        },
      };

      //验证表单
      if (!utils.validForm(o)) {
        return;
      }

      //发起修改密码请求
      //验证通过
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      let data = serail.queryString({
        appkey: this.appkey,
        tokenString,
        oldPassword: this.passwords.old.passeord,
        passeord: this.passwords.new.passeord,
      });

      this.axios({
        //请求方式
        method: "POST",
        url: this.baseUrl + "/updatePassword",
        data,
      })
        .then((res) => {
          console.log("res confirmPassword ==> ", res);
          this.$toast.clear();

          if (res.data.code == "E001") {
            this.$cookies("tokenString");
            this.$router.push({ name: "Login" });
          } else {
            this.$notify({
              type: "warning",
              message: res.data.msg,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //注销账号
    destroyAccount() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否确认注销账号，一旦确认无法恢复!",
          confirmButtonColor: "#5C4033",
        })
        .then(() => {
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

          let data = serail.queryString({
            appkey: this.appkey,
            tokenString,
          });

          this.axios({
            //请求方式
            method: "POST",
            url: this.baseUrl + "/destroyAccount",
            data,
          })
            .then((res) => {
              console.log("res logout ==> ", res);
              this.$toast.clear();

              this.$toast(res.data.msg);
              if (res.data.code == "G001") {
                this.$cookies("tokenString");
                setTimeout(() => {
                  this.$router.push({ name: "Login" });
                }, 600);
              }
            })
            .catch((err) => {
              this.$toast.clear();
              console.log("err ==> ", err);
            });
        })
        .catch(() => {});
    },
  },
};
</script>

