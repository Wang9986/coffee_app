<template>
  <div class="home">
    <van-nav-bar>
      <template #left>
        <div class="home-title">
          <div class="home-time">{{ timeText }}</div>
          <div class="username one-text" v-if="isLogin">
            {{ userInfo.nickName }}
          </div>
        </div>
      </template>
      <template #right>
        <van-search
          placeholder="输入商品名称"
          shape="round"
          @focus="goSearch"
        />
      </template>
    </van-nav-bar>

    <div class="banner-box">
      <van-swipe @change="changeCurrentIndex" :autoplay="5000">
        <van-swipe-item v-for="(item, index) in bannerData" :key="index">
          <img
            @click="viewProduct(item.pid)"
            class="auto-img"
            :src="item.bannerImg"
            alt=""
          />
          <div class="pro-info-banner one-text">{{ item.name }}</div>
        </van-swipe-item>

        <template #indicator>
          <div class="indicator-box">
            <div
              class="indicator-item"
              :class="{ active: currentIndex === i }"
              v-for="(v, i) in bannerData.length"
              :key="i"
            ></div>
          </div>
        </template>
      </van-swipe>
    </div>

    <div class="product-box">
      <div class="hot-product-title">热门推荐</div>
      <div class="product-items">
        <Product
          class="product-item"
          v-for="(item, index) in hotProduct"
          :key="index"
          :product="item"
        >
          <!-- <template #hot>
            <div class="hot-box">hot</div>
          </template> -->
        </Product>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/home.less";

import Product from "../components/Product";

export default {
  name: "Home",

  data() {
    return {
      currentIndex: 0,

      //轮播图数据
      bannerData: [],

      //热卖商品数据
      hotProduct: [],

      timeText:'',

      isLogin:false,
      
      userInfo:{}
    };
  },

  created() {
    this.getTime();

    //生成data
    this.getBannerData();

    this.getHotProduct();

    this.getUserInfo();
  },

  components: {
    Product,
  },

  methods: {
    getTime() {
      let hours = new Date().getHours();
      if (hours >= 6 && hours < 12) {
        this.timeText = "早上好";
      } else if (hours >= 12 && hours < 18) {
        this.timeText = "下午好";
      } else if (hours >= 18 && hours < 24) {
        this.timeText = "晚上好";
      } else {
        this.timeText = "深夜好";
      }
    },

    //进入搜索界面
    goSearch() {
      this.$router.push({ name: "Search" });
    },

    //切换轮播图
    changeCurrentIndex(index) {
      this.currentIndex = index;
    },

    //获取轮播图数据
    getBannerData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        //请求方式
        method: "GET",
        url: this.baseUrl + "/banner",
        params: {
          appkey: this.appkey,
        },
      })
        .then((res) => {
          console.log("res getBannerData ==> ", res);
          this.$toast.clear();

          if (res.data.code === 300) {
            this.bannerData = res.data.result;
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

    //获取首页热卖推荐商品
    getHotProduct() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        //请求方式
        method: "GET",
        url: this.baseUrl + "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      })
        .then((res) => {
          console.log("res getHotProduct ==> ", res);
          this.$toast.clear();

          if (res.data.code === 500) {
            this.hotProduct = res.data.result;
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

    //查看商品详情
    viewProduct(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },

    //获取用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("tokenString");
      console.log("tokenString ==> ", tokenString);

      if (!tokenString) {
        console.log("浏览器token不存在");
        // return this.$router.push({ name: "Login" });
        return
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
          tokenString
        },
      })
        .then((res) => {
          console.log("res getUserInfo ==> ", res);
          this.$toast.clear();

          if (res.data.code == 'A001') {
            if(res.data.result.length > 0){
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
  },
};
</script>