<template>
  <div class="rx-nav">
    <van-nav-bar left-arrow>
      <template #left>
        <div class="left-title">
          <div class="logo">
            <img class="auto-img" src="../assets/images/logo1.png" />
          </div>
          <div class="logo-title">剑龙咖啡</div>
        </div>
      </template>

      <template #right>
        <div class="right-title" @click="goHome">
          暂时不登
        </div>
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
  import "../assets/less/rxnav.less";
  export default {
    name: 'RXnav',

    methods: {
      goHome() {
        this.$router.push({name:'Home'});
      }
    }
  }
</script>