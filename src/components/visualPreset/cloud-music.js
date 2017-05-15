// 网易云音乐
export default {
  $source: {
    url: 'http://music.163.com',
    name: '网易云音乐',
  },
  'song-visual': {
    $dataType: '歌曲',
    $values: [
      {
        label: {
          gte100000: { title: '评论数超10万的歌曲数' },
          gte50000: { title: '评论数超5万的歌曲数' },
          gte10000: { title: '评论数超1万的歌曲数' },
        },
        requestPath: 'song-comment/statistic',
        parsing: (result) => {
          const percents = {
            gte100000: 90, gte50000: 50, gte10000: 10,
          };
          const dataset = {};
          Object.keys(result).forEach((key) => {
            dataset[key] = {
              percent: percents[key],
              data: result[key],
              unit: '首',
            };
          });
          return dataset;
        },
      },
    ],
    $charts: [
      {
        type: 'bar',
        title: '歌曲评论数Top100',
        label: '评论数',
        requestPath: 'song-comment',
        parsing: (result, Chart) => {
          // 解析数据
          const xData = [];
          const yData = [];
          result.listData.forEach((e) => {
            xData.push(`${e.name} - ${e.artist.name}`);
            yData.push(e.comment.total);
          });
          return {
            data: Chart.update(xData, yData, '评论数'),
            total: result.total,
            updateTime: result.updateTime,
          };
        },
      },
    ],
  },
};
