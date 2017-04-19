<template>
  <div id="app" class="wrapper">
    <!-- 导航栏 -->
    <nav-bar></nav-bar>
    <router-view></router-view>
    <div class="copy">
      2017 &copy; Cong Min.
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';

export default {
  // 组件
  components: {
    NavBar,
  },

};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #657180;
}
.wrapper {
  min-height: 100%;
  background: #e3e8ee;
}
.container {
  min-height: 200px;
  background: #fff;
  width: 90%;
  margin: 30px auto 20px;
  border-radius: 6px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .1);
  overflow: hidden;
}
.content {
  margin: 30px;
}
.copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}
</style>
