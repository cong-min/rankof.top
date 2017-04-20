<template>
  <Menu ref="sideBarMenu" :open-names="menu.openNames" :active-name="menu.activeName" width="auto" @on-select="selectLink">
    <Submenu v-for="item in menu.list" :key="item.name" :name="item.name">
      <template slot="title">
        <Icon :type="item.icon"></Icon>
        {{ item.title }}
      </template>
      <Menu-item v-for="child in item.children" :key="child.name" :name="child.name">{{ child.title }}</Menu-item>
    </Submenu>
  </Menu>
</template>

<script>
import sideBarData from './sideBarData';  // 侧边栏数据

export default {

  data() {
    return {
      site: null,
      menu: {
        activeName: null,
        openNames: [],
        list: [],
      },
    };
  },

  watch: {
    // 监听路由
    $route: 'getSideBarData',
  },

  created() {
    // 获取侧边栏数据
    this.getSideBarData();
  },

  // 事件
  methods: {
    selectLink(name) {
      this.$router.push({
        name: 'page',
        params: {
          page: name,
        },
      });
      this.pageChange(name);
    },

    getSideBarData() {
      // site改变
      const { site, page } = this.$route.params;
      if (site !== this.site) {
        const data = sideBarData[site];
        this.site = site;
        this.menu.list = data;
        this.menu.openNames = data.map(e => e.name);
        this.pageChange(page || data[0].children[0].name);
      }
    },

    pageChange(page) {
      // page改变
      const target = sideBarData[this.site]
        .find(e => e.name === page.split('-')[0])
        .children.find(e => e.name === page);
      this.$root.pageType = target.pageType;
      this.$root.page = page;
      this.menu.activeName = page;
      this.$nextTick(() => {
        this.$refs.sideBarMenu.updateActiveName();
        this.$refs.sideBarMenu.updateOpened();
      });
    },

  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
