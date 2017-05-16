<template>
  <div id="app" class="wrapper">
    <!-- 导航栏 -->
    <nav-bar></nav-bar>
    <!-- 路由正文 -->
    <router-view class="wrapper-view"></router-view>
    <!-- 返回顶部 -->
    <Back-top>
      <div class="back-top">
        <Icon type="chevron-up"></Icon>
      </div>
    </Back-top>
    <!-- 版权 -->
    <router-link to="/about" class="copy">2017 &copy; Cong Min.</router-link>
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
html {
  height: 100%;
}
body {
  position: relative;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #657180;
}
.wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
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
.content:after {
  content: "";
  display: block;
  width: 1px;
  background: #d7dde4;
  position: absolute;
  top: 0;
  bottom: 0;
  left: -1px;
}
.wrapper-view{
  flex: 1;
}
.back-top {
  background: rgba(0, 153, 229, .7);
  font-size: 24px;
  color: #fff;
  text-align: center;
  border-radius: 3px;
}
.back-top:hover {
  background: rgba(0, 153, 229, .8);
}
.copy {
  width: 200px;
  display: block;
  text-align: center;
  margin: 0 auto;
  padding: 10px 0 20px;
  color: #9ea7b4;
}
</style>
