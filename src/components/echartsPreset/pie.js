/* chart pie */
// 初始化
const init = (title, name) => ({
  title: {
    text: title,
    left: 'center',
    top: 0,
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} <br/>{c} ({a})',
  },
  series: [
    {
      name,
      type: 'pie',
      radius: '55%',
      center: ['50%', '50%'],
      data: [],
      roseType: 'angle',
      label: {
        normal: {
          textStyle: {
            color: '#9ea7b4',
          },
        },
      },
      labelLine: {
        normal: {
          lineStyle: {
            color: '#c3cbd6',
          },
          smooth: 0.2,
          length: 10,
          length2: 20,
        },
      },
      itemStyle: {
        normal: {
          color: '#5cadff',
          shadowBlur: 100,
          shadowColor: 'rgba(0,0,0,.1)',
        },
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: () => Math.random() * 200,
    },
  ],
});
// set data
const update = (data, name) => ({
  series: [{
    name,
    type: 'pie',
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
