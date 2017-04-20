<template>
  <Menu ref="navBarMenu" mode="horizontal" theme="primary" :active-name="menu.activeName" width="auto" @on-select="selectLink">
    <menu-item class="logo" name="home">Rank of Top</menu-item>
    <Menu-item v-for="item in menu.list" :key="item.name" :name="item.name">
      <Icon :type="item.icon"></Icon>
      {{ item.title }}
    </Menu-item>
    <menu-item class="about" name="about">About</menu-item>
  </Menu>
</template>

<script>
export default {

  data() {
    return {
      menu: {
        activeName: this.$route.params.site || 'home',
        list: [
          { name: 'cloud-music', title: '网易云音乐', icon: 'music-note' },
          { name: 'zhihu', title: '知乎', icon: 'chatbox-working' },
          { name: 'weibo', title: '微博', icon: 'social-rss' },
        ],
      },
    };
  },

  watch: {
    // 监听路由
    '$route.params.site': 'siteChange',
  },

  created() {
    // 获取侧边栏数据
    this.siteChange(this.$route.params.site);
  },

  // 事件
  methods: {
    selectLink(name) {
      // 改变路由
      this.$router.push(`/${name}`);
      this.siteChange(name);
    },

    siteChange(name) {
      const site = name || this.$route.name;
      // site改变
      this.$root.site = site;
      this.menu.activeName = site;
      this.$nextTick(() => {
        this.$refs.navBarMenu.updateActiveName();
      });
    },

  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logo {
  width: 200px;
  font-size: 24px;
  font-weight: 100;
  color: #fff;
  text-align: center;
}
.about {
  float: right;
}
</style>
