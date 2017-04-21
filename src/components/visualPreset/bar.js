/* chart bar */
// 初始化
const init = (title, name) => ({
  title: {
    text: title,
  },
  tooltip: {},
  xAxis: {
    data: xAxisData,
    silent: false,
    splitLine: {
      show: false,
    },
  },
  yAxis: {
  },
  series: [{
    name: 'bar',
    type: 'bar',
    data: data1,
    animationDelay: (idx) => idx * 10,
  }],
  animationEasing: 'elasticOut',
  animationDelayUpdate: (idx) => idx * 5,
});
// set data
const update = (data, name) => ({
  series: [{
    name,
    data: data.sort((a, b) => a.value - b.value),
  }],
});
// loading
const loading = (ref) => {
  ref.showLoading({
    text: '',
    color: '#3399ff',
    maskColor: 'rgba(255, 255, 255, 0.75)',
  });
};

export default {
  init,
  update,
  loading,
};
