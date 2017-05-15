<template>
  <div>
    <p class="page-note">
      <span class="page-note-left" v-if="total">不完全统计共 {{ total }} 个{{ dataType }}，最后更新时间：{{ updateTime | formatDate }}</span>
      <span class="page-note-right" v-if="source">
        爬取数据来源：<a :href="source.url" target="_blank">{{ source.name }}</a>
      </span>
    </p>
    <Row class="valuesBox" type="flex" justify="space-around">
      <Col span="6" v-for="value in valueData" :key="value.title">
        <Card class="valuesCard" dis-hover>
          <p slot="title">
            {{ value.title }}
          </p>
          <i-circle class="i-circle" :percent="value.percent || 1">
            <animated-integer :value="value.data || 0" class="i-circle-value"></animated-integer>
            <span class="i-circle-unit">{{ value.unit }}</span>
          </i-circle>
        </Card>
      </Col>
    </Row>
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
      valueData: {},    // 数值数据
      visualData: [],   // 可视数据
      total: 0,
      dataType: null,
      updateTime: null,
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
      const vm = this;
      const { site, page } = vm.$root;
      const siteData = visualPreset[site];
      const pageData = siteData[page];
      vm.source = siteData.$source;    // 数据来源
      vm.dataType = pageData.$dataType;   // 数据类型
      const $values = pageData.$values;     // 统计数值
      const $charts = pageData.$charts;     // 图表
      // 数值数据 初始化
      $values.forEach((e) => {
        Object.assign(vm.valueData, e.label);
      });
      // 数值数据 请求
      $values.forEach((e) => {
        this.$http.get(`/api/${site}/${e.requestPath}`).then((res) => {
          if (res.status < 400) {
            const dataset = e.parsing(res.body);
            Object.keys(dataset).forEach((key) => {
              Object.assign(vm.valueData[key], dataset[key]);
            });
          } else {
            this.$Message.error(`${res.status}: ${res.bodyText}`);
          }
        }).catch(() => {
          this.$Message.error('网络错误');
        });
      });
      // 可视数据 初始化
      this.visualData = $charts.map(e => ({
        type: e.type,
        title: e.title,
        label: e.label,
        initOptions: echartsPreset[e.type].init(e.title, e.label),    // init options
      }));
      // 可视数据 请求
      this.$nextTick(() => {
        $charts.forEach((e) => {
          const $chart = this.$refs[e.title][0];    // 实例chart
          const Chart = echartsPreset[e.type];    // Chart预设模块
          Chart.loading($chart);
          this.$http.get(`/api/${site}/${e.requestPath}`).then((res) => {
            if (res.status < 400) {
              // 处理解析数据
              const { data, total, updateTime } = e.parsing(res.body, Chart);
              $chart.mergeOptions(data);    // merge options
              if (total) { this.total = total; }
              if (updateTime) { this.updateTime = updateTime; }
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
.valuesBox {
  margin: 30px;
  text-align: center;
}
.valuesCard {
  box-shadow: 3px 5px 10px rgba(0,0,0,.05);
}
.i-circle-value {
  font-size: 26px;
}
.i-circle-unit {
  color: #9ea7b4;
  font-size: 12px;
}
</style>
