<template>
  <div class="home">
    <h1 class="home-title">Rank of<span class="home-title-dot">.</span>Top</h1>
    <p class="home-mark">这里不仅仅有您最想知道的排行榜</p>
    <div class="home-list">
      <!-- 列表 -->
      <template v-for="item in navList">
        <router-link class="home-item" v-if="item.enable" :key="item.name" :name="item.title" :to="`/${item.name}`">
          <img class="home-item-logo" :src="require(`../assets/logos/${item.name}.png`)">
        </router-link>
        <Tooltip class="home-item disable" v-else :content="`${item.title} · 敬请期待`" :key="item.name" :name="item.title" placement="bottom">
          <img class="home-item-logo" :src="require(`../assets/logos/${item.name}.png`)">
        </Tooltip>
      </template>
      <!-- 更多 -->
      <Tooltip class="home-item-more" content="更多 · 敬请期待" placement="bottom">
        <img class="home-item-logo" src="../assets/logos/more.png">
      </Tooltip>
    </div>
  </div>
</template>

<script>
import navList from './navBarPreset/list';

export default {

  data() {
    return {
      // navList在NavBar.Vue中已随机排序
      navList,
    };
  },

  ready() {
  },

  mounted() {
  },

  methods: {
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  text-align: center;
  min-height: 480px;
}
.home-title {
  position: relative;
  color: #5f6878;
  font-size: 50px;
  width: 500px;
  margin: 60px auto 0;
}
.home-title-dot {
  color: #5cadff;
}
.home-mark {
  color: #7e8c9b;
  font-size: 13px;
  margin: 10px auto;
}
.home-list {
  margin: 40px auto 30px;
  width: 500px;
}
.home-item,
.home-item-more {
  display: inline-block;
  height: 55px;
  padding: 10px 15px;
  margin: 5px 0;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
}
.home-item.disable img {
  filter: grayscale(100%);
  opacity: 0.66;
}
.home-item:hover {
  box-shadow: none;
  border-color: #5cadff;
  background: rgba(92,173,255,.06);
}
.home-item-logo {
  height: 33px;
}
</style>
