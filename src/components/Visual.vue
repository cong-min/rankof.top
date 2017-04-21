<template>
  <div>
    <template v-for="chart in visualData">
      <Chart class="chart" theme="walden" :key="chart.name" :ref="chart.name"
             :options="echartsOptions[chart.type].init(chart.name, chart.label)"></Chart>
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
      echartsOptions: echartsPreset,
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
      this.visualData = visualPreset[site][page];
      this.$nextTick(() => {
        this.visualData.forEach((e) => {
          const $chart = this.$refs[e.name][0];    // 实例chart
          const Chart = echartsPreset[e.type];  // Chart预设模块
          Chart.loading($chart);
          this.$http.get('/api/cloud-music/song-comment').then((res) => {
            if (res.status === 200) {
              const data = e.processing(res.body, Chart);
              $chart.mergeOptions(data);
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
</style>
