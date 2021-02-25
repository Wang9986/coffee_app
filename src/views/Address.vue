<template>
  <div class="address">
    <van-nav-bar
      :title="aid ? '编辑地址' : '新增地址'"
      left-text="返回"
      left-arrow
      @click-left="goback"
    />
    <Bg>
      <van-address-edit
        :area-list="areaList"
        show-postal
        :show-delete="!!aid"
        show-set-default
        show-search-result
        :detail-maxlength="30"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        :address-info="originAddressInfo"
        @save="saveAddress"
        @delete="removeAddress"
      />
    </Bg>
  </div>
</template>

<script>
import "../assets/less/address.less";
import Bg from "../components/Bg";
import areaList from "../assets/js/area";

export default {
  name: "Address",

  data() {
    return {
      //省市区数据
      areaList,

      //编辑地址的aid
      aid: "",

      //编辑地址初始值
      originAddressInfo: {},
    };
  },

  components: {
    Bg,
  },

  created() {
    //截取路由参数
    this.aid = this.$route.params.aid;

    console.log("this.aid ==> ", this.aid);

    //如果存在aid,则根据aid查询地址数据
    if (this.aid) {
      this.getAddressDataByAid();
    }
  },

  methods: {
    goback() {
      this.$router.go(-1);
    },

    //新增地址
    addAddress(value) {
      let tokenString = localStorage.getItem("tokenString");

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      //复制value
      let data = {
        ...value,
        tokenString,
        appkey: this.appkey,
      };

      data.isDefault = Number(data.isDefault);
      delete data.country;

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        //请求方式
        method: "POST",
        url: this.baseUrl + "/addAddress",
        data,
      })
        .then((res) => {
          console.log("res addAddress ==> ", res);
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

          if (res.data.code === 9000) {
            this.$router.push({ name: "AddressList" });
          }

          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
            loadingType: "spinner",
          });
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //编辑地址
    editAddress(value) {
      let isEdit = false;

      for (let key in this.originAddressInfo) {
        if (this.originAddressInfo[key] !== value[key]) {
          isEdit = true;
          break;
        }
      }

      if (isEdit) {
        console.log("发送编辑地址请求");

        let tokenString = localStorage.getItem("tokenString");

        if (!tokenString) {
          console.log("浏览器token不存在");
          return this.$router.push({ name: "Login" });
        }

        //复制value
        let address = {};
        address.aid = this.aid;
        address.name = value.name;
        address.tel = value.tel;
        address.province = value.province;
        address.city = value.city;
        address.county = value.county;
        address.addressDetail = value.addressDetail;
        address.areaCode = value.areaCode;
        address.postalCode = value.postalCode;
        address.isDefault = Number(value.isDefault);
        console.log("address ==> ", address);

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
          loadingType: "spinner",
        });

        this.axios({
          //请求方式
          method: "POST",
          url: this.baseUrl + "/editAddress",
          data: {
            appkey: this.appkey,
            tokenString,
            ...address,
          },
        })
          .then((res) => {
            console.log("res editAddress ==> ", res);
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

            if (res.data.code === 30000) {
              this.$router.push({ name: "AddressList" });
            }

            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
              loadingType: "spinner",
            });
          })
          .catch((err) => {
            this.$toast.clear();
            console.log("err ==> ", err);
          });
      } else {
        console.log("未编辑");
        this.$router.push({ name: "AddressList" });
      }
    },

    //保存地址
    saveAddress(value) {
      if (this.aid) {
        //编辑地址
        this.editAddress(value);
      } else {
        //新增地址
        this.addAddress(value);
      }
    },

    //删除地址
    removeAddress(value) {
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
        method: "POST",
        url: this.baseUrl + "/deleteAddress",
        data:{
          tokenString,
          appkey:this.appkey,
          aid:value.aid,
        }
      })
        .then((res) => {
          console.log("res removeAddress ==> ", res);
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

          if (res.data.code === 10000) {
            this.$router.push({ name: "AddressList" });
          }

          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
            loadingType: "spinner",
          });
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //根据aid获取地址数据
    getAddressDataByAid() {
      //查询地址数据
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
        url: this.baseUrl + "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
        },
      })
        .then((res) => {
          console.log("res getAddressDataByAid ==> ", res);
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

          if (res.data.code === 40000) {
            let data = res.data.result[0];
            data.isDefault = !!data.isDefault;
            
            this.originAddressInfo = data;
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
