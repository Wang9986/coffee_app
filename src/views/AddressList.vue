<template>
  <div class="address-list">
    <van-nav-bar
      title="地址管理"
      left-text="返回"
      left-arrow
      @click-left="goback"
    />
    <Bg>
      <van-address-list
        :list="list"
        default-tag-text="默认"
        :switchable="false"
        @add="addAddress"
        @edit="editAddress"
      />
    </Bg>
  </div>
</template>

<script>
import "../assets/less/addresslist.less";
import Bg from "../components/Bg";
export default {
  name: "AddressList",

  data() {
    return {
      //地址列表数据
      list: [],
    };
  },

  components: {
    Bg,
  },

  created() {
    this.getAddressListData();
  },

  methods: {
    goback() {
      this.$router.go(-1);
    },

    //新增
    addAddress() {
      this.$router.push({ name: "Address" });
    },

    //编辑
    editAddress({ aid }) {
      this.$router.push({ name: "Address", params: { aid } });
    },

    //查询用户地址列表
    getAddressListData() {
      let tokenString = localStorage.getItem("tokenString");

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
        url: this.baseUrl + "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          console.log("res getAddressListData ==> ", res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
              loadingType: "spinner",
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 20000) {
            //添加address属性
            res.data.result.forEach((v) => {
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
              v.isDefault = Boolean(v.isDefault);
            });

            this.list = res.data.result;

          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
              loadingType: "spinner",
            });
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
