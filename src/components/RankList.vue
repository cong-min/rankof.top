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
        <span class="table-note-left" v-if="total">共统计 {{ total }} 个{{dataType}}</span>
        <span class="table-note-right" v-if="updateTime">最后更新时间：{{ updateTime | formatTime }}</span>
      </p>
      <Table :columns="listColumn" :data="listData" size="large"></Table>
    </template>
  </div>
</template>

<script>
import rankListColumnData from './rankListColumnData';

export default {

  filters: {
    formatTime(timestamp) {
      if (!timestamp) return null;
      const date = new Date();
      date.setTime(timestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      function formatNumber(num) {  // 格式化数字
        const n = num.toString();
        return n[1] ? n : `0${n}`;
      }
      const formattedDate = [year, month, day].map(formatNumber).join('-');
      const formattedTime = [hour, minute, second].map(formatNumber).join(':');
      return `${formattedDate} ${formattedTime}`;
    },
  },

  data() {
    return {
      loading: true,
      listColumn: [],
      listData: [],
      total: 0,
      dataType: null,
      updateTime: null,
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
      this.listColumn = $column.concat(siteData[pre][suf]); // 合并数据
      this.dataType = $column[1].title;
      // 获取listData
      this.$http.get(`/api/${site}/${page}`).then((res) => {
        if (res.status === 200) {
          this.listData = res.body.listData;
          this.updateTime = res.body.updateTime;
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
.table-note-left {
  float: left;
}
.table-note-right {
  float: right;
}
</style>
