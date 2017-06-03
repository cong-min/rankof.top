/* chart graph relation */
// 初始化
const init = (title, name) => ({
  title: {
    text: title,
    top: 'top',
    left: 'center',
  },
  tooltip: {},
  toolbox: {
    show: true,
    feature: {
      restore: { show: true },
    },
  },
  animationDuration: 15000,
  animationEasingUpdate: 'quinticInOut',
  series: [{
    name,
    type: 'graph',
    layout: 'force',
    force: {
      repulsion: 60,
      gravity: 0.12,
      edgeLength: 45,
    },
    top: 60,
    data: [],
    links: [],
    categories: [],
    focusNodeAdjacency: true,
    label: {
      normal: {
        show: false,
        position: 'top',
        formatter: '{b}',
      },
    },
    lineStyle: {
      normal: {
        color: 'source',
        curveness: 0,
        type: 'solid',
      },
    },
  }],
});
// set data
const update = (data, links, categories, name) => ({
  series: [{
    name,
    type: 'graph',
    data,
    links,
    categories,
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
