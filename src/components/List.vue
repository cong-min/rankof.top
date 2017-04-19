<template>
  <Row class="container">
    <Col span="6">
      <!-- 侧边栏 -->
      <side-bar></side-bar>
    </Col>
    <Col span="18">
      <div class="content">
        <!-- 内容 -->
        <Spin v-if="loading">
          <Icon type="load-c" size="18" class="loading"></Icon>
          <div>加载中...</div>
        </Spin>
        <Table v-else :columns="listColumn" :data="listData" size="large"></Table>
      </div>
    </Col>
  </Row>
</template>

<script>
import SideBar from '@/components/SideBar';
import listColumnData from './listColumnData';

export default {
  // 组件
  components: {
    SideBar,
  },

  data() {
    return {
      loading: true,
      listColumn: [],
      listData: [],
    };
  },

  watch: {
    // 监听路由
    $route: 'getListData',
  },

  mounted() {
    // 获取排行榜数据
    this.getListData();
  },

  // 事件
  methods: {
    getListData() {
      this.loading = true;
      const { site, list } = this.$root;
      this.listColumn = listColumnData[site][list];
      this.listData = [];
      this.$http.get(`/api/${site}/${list}`).then((res) => {
        this.loading = false;
        this.listData = res.body;
      }).catch((err) => {
        console.log(err);
      });
    },

  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loading{
    animation: loading 1s linear infinite;
  }
  @keyframes loading {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
</style>
