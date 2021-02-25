<template>
  <div class="main">
    <div>
      <!-- 二级路由 -->
      <router-view></router-view>
    </div>

    <van-tabbar
      v-model="activeIndex"
      active-color="#5C4033"
      inactive-color="#646566"
      route
    >
      <van-tabbar-item
        v-for="(item, index) in tabbarData"
        :key="index"
        :to="item.to"
      >
        <span>{{ item.title }}</span>
        <template #icon="props">
          <img :src="props.active ? item.icon.active : item.icon.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      isLogin: false,
      tabbarData: [
        {
          title: "首页",
          icon: {
            active: require("../assets/images/首页-选中.png"),
            inactive: require("../assets/images/首页-未选中.png"),
          },
          to: "/home",
        },
        {
          title: "菜单",
          icon: {
            active: require("../assets/images/菜单-选中.png"),
            inactive: require("../assets/images/菜单-未选中.png"),
          },
          to: "/menu",
        },
        {
          title: "购物袋",
          icon: {
            active: require("../assets/images/购物袋-选中.png"),
            inactive: require("../assets/images/购物袋-未选中.png"),
          },
          to: "/shopbag",
        },
        {
          title: "我的",
          icon: {
            active: require("../assets/images/用户-选中.png"),
            inactive: require("../assets/images/用户-未选中.png"),
          },
          dot: false,
          to: "/my",
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.main {
  padding-bottom: 50px;
}
</style>