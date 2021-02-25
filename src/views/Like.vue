<template>
  <div class="like">
    <van-nav-bar
      title="我的收藏"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="goback"
    />
    <div class="like-bg"></div>
    <div class="like-box">
      <div class="product-box clearfix" v-if="likeData.length > 0">
        <div
          class="product-item fl"
          :class="[index % 2 == 0 ? 'p-left' : 'p-right']"
          v-for="(item, index) in likeData"
          :key="index"
        >
          <div class="p-img" @click="viewProductInfo(item.pid)">
            <img class="auto-img" :src="item.smallImg" alt />
          </div>
          <div class="pro-name one-text">{{ item.name }}</div>
          <div class="clearfix">
            <div class="pro-price fl">￥{{ item.price }}</div>
            <div class="pro-remove fr" @click="removeLike(item.pid, index)">
              <van-icon name="like" color="#e4393c"/>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <van-empty description="收藏商品空空如也，去逛一逛!">
          <van-button
            round
            color="#5C4033 "
            class="bottom-button"
            @click="goMenu"
          >
            去逛一逛
          </van-button>
        </van-empty>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/like.less";
import { serail } from "../assets/js/serail.js";

export default {
  data() {
    return {
      likeData: [],
    };
  },

  created() {
    this.getAllLikeData();
  },

  methods: {
    goMenu() {
      return this.$router.push({ name: "Menu" });
    },

    goback() {
      this.$router.go(-1);
    },

    //获取我的收藏商品数据
    getAllLikeData() {
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
        url: this.baseUrl + "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          console.log("res getUserInfo ==> ", res);
          this.$toast.clear();

          if (res.data.code == "2000") {
            this.likeData = res.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //查看商品详情
    viewProductInfo(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },

    //删除收藏商品数据
    removeLike(pid, index) {
      let tokenString = localStorage.getItem("tokenString");
      console.log("tokenString ==> ", tokenString);

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      let data = serail.queryString({
          appkey:this.appkey,
          tokenString,
          pid
      })

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        //请求方式
        method: "POST",
        url: this.baseUrl + "/notlike",
        data,
      })
        .then((res) => {
          console.log("res getUserInfo ==> ", res);
          this.$toast.clear();

          if (res.data.code == "700") {
            return this.$router.push({name:"Login"});
          }

          if(res.data.code == 900){
              this.likeData.splice(index,1);
              this.$toast('删除收藏商品成功')
          }else {
              this.$toast('删除商品失败')
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

