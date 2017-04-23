<template>
  <Row class="container">
    <Col span="6">
      <!-- 侧边栏 -->
      <side-bar @pageChange="setPageType"></side-bar>
    </Col>
    <Col span="18">
      <router-view :name="pageType" class="content"></router-view>
    </Col>
  </Row>
</template>

<script>
import SideBar from '@/components/SideBar';
import RankList from '@/components/RankList';

export default {

  // 组件
  components: {
    SideBar,
    RankList,
  },

  data() {
    return {
      pageType: null,
    };
  },

  methods: {
    setPageType(pageType) {
      this.pageType = pageType;
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
