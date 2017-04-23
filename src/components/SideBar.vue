<template>
  <Menu ref="sideBarMenu" :open-names="menu.openNames" :active-name="menu.activeName" width="auto" @on-select="selectLink">
    <Submenu v-for="item in menu.list" :key="item.name" :name="item.name">
      <template slot="title">
        <Icon :type="item.icon"></Icon>
        {{ item.title }}
      </template>
      <Menu-item class="menu-item" v-for="child in item.children" :key="child.name" :name="child.name">
        <Icon class="right-icon" :type="child.icon || 'arrow-graph-up-right'"></Icon>
        {{ child.title }}
      </Menu-item>
    </Submenu>
  </Menu>
</template>

<script>
import sideBarPreset from './sideBarPreset';  // 侧边栏数据

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
    },

    getSideBarData() {
      // site改变
      const { site, page } = this.$route.params;
      const data = sideBarPreset[site];
      if (site !== this.site) {
        this.site = site;
        this.menu.list = data;
        this.menu.openNames = data.map(e => e.name);
      }
      this.pageChange(page || data[0].children[0].name);
    },

    pageChange(page) {
      // page改变
      const target = sideBarPreset[this.site]
        .find(e => e.name === page.split('-')[0])
        .children.find(e => e.name === page);
      this.$root.pageType = target.pageType;
      this.$emit('pageChange', target.pageType);  // 向父级组件Site.vue触发事件
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
.menu-item {
  padding-left: 42px !important;
}
.right-icon {
  float: right;
  position: relative;
  top: 4px;
  color: #d7dde4;
}
.ivu-menu-item-selected .right-icon {
  color: #39f;
}
</style>
