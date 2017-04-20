<template>
  <div>
    <!-- 内容 -->
    <div v-if="loading">
      <Spin>
        <Icon type="load-c" size="18" class="loading"></Icon>
        <div>加载中...</div>
      </Spin>
    </div>
    <template v-else>
      <p class="table-note">
        <span class="table-note-left" v-if="total">不完全统计共 {{ total }} 个{{ dataType }}</span>
        <span class="table-note-right" v-if="source">
          数据来源：<a :href="source.url" target="_blank">{{ source.name }}</a>
        </span>
      </p>
      <Table :columns="listColumn" :data="listData" size="large"></Table>
    </template>
  </div>
</template>

<script>
import rankListColumnData from './rankListColumnData';

export default {

  data() {
    return {
      loading: true,
      listColumn: [],
      listData: [],
      total: 0,
      dataType: null,
      source: null,
    };
  },

  watch: {
    // 监听路由
    $route: 'getRankListData',
  },

  mounted() {
    // 获取排行榜数据
    this.getRankListData();
  },

  // 事件
  methods: {
    getRankListData() {
      Object.assign(this.$data, this.$options.data());
      const { site, page } = this.$root;
      // siteData表示该site的column数据
      const siteData = rankListColumnData[site];
      // pre表示大类，suf表示小类
      const [pre, suf] = page.split('-');
      const $column = siteData[pre].$column;
      this.source = siteData.$source;
      this.listColumn = $column.concat(siteData[pre][suf]); // 合并数据
      this.dataType = $column[1].title;
      // 获取listData
      this.$http.get(`/api/${site}/${page}`).then((res) => {
        if (res.status === 200) {
          this.listData = res.body.listData;
          this.total = res.body.total;
        } else {
          this.$Message.error(`${res.status}: ${res.bodyText}`);
        }
      }).catch(() => {
        this.$Message.error('网络错误');
      }).then(() => {
        this.loading = false;
      });
    },

  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading {
  animation: loading 1s linear infinite;
}
@keyframes loading {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
.table-note {
  color: #9ea7b4;
  overflow: hidden;
  margin: -5px auto 10px;
}
.table-note a {
  color: #9ea7b4;
}
.table-note-left {
  float: left;
}
.table-note-right {
  float: right;
}
</style>
