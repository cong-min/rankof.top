<template>
  <div>
    <p class="page-note">
      <span class="page-note-left" v-if="total">不完全统计共 {{ total }} 个{{ dataType }}</span>
      <span class="page-note-right" v-if="source">
        爬取数据来源：<a :href="source.url" target="_blank">{{ source.name }}</a>
      </span>
    </p>
    <template v-for="chart in visualData">
      <Chart class="chart" theme="walden" :key="chart.title" :ref="chart.title"
             :options="chart.initOptions"></Chart>
    </template>
  </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/tooltip';
import walden from './echartsPreset/theme';
import echartsPreset from './echartsPreset';
import visualPreset from './visualPreset';

ECharts.registerTheme('walden', walden);

export default {

  // 组件
  components: {
    Chart: ECharts,
  },

  data() {
    return {
      visualData: [],
      total: 0,
      dataType: null,
      source: null,
    };
  },

  watch: {
    // 监听路由
    $route: 'getVisualData',
  },

  mounted() {
    this.getVisualData();
  },

  // 事件
  methods: {
    getVisualData() {
      const { site, page } = this.$root;
      const siteData = visualPreset[site];
      const pageData = siteData[page];
      this.source = siteData.$source;    // 数据来源
      this.dataType = pageData.$dataType;   // 数据类型
      const $charts = pageData.$charts;
      this.visualData = $charts.map(e => ({
        type: e.type,
        title: e.title,
        label:e.label,
        initOptions: echartsPreset[e.type].init(e.title, e.label),    // init options
      }));
      this.$nextTick(() => {
        $charts.forEach((e) => {
          const $chart = this.$refs[e.title][0];    // 实例chart
          const Chart = echartsPreset[e.type];    // Chart预设模块
          Chart.loading($chart);
          this.$http.get(`/api/${site}/${e.requestPath}`).then((res) => {
            if (res.status === 200) {
              const { data, total } = e.processing(res.body, Chart);
              $chart.mergeOptions(data);    // merge options
              if (total) { this.total = total; }
            } else {
              this.$Message.error(`${res.status}: ${res.bodyText}`);
            }
          }).catch(() => {
            this.$Message.error('网络错误');
          }).then(() => {
            $chart.hideLoading();
          });
        });
      });
    },

  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart {
  margin: 0 auto;
  padding: 15px 0;
}
.page-note {
  color: #9ea7b4;
  overflow: hidden;
  margin: -5px auto 10px;
}
.page-note a {
  color: #9ea7b4;
}
.page-note-left {
  float: left;
}
.page-note-right {
  float: right;
}
</style>
