// 网易云音乐
export default {
  $source: {
    url: 'http://music.163.com',
    name: '网易云音乐',
  },
  'song-visual': {
    $dataType: '歌曲',
    $charts: [
      {
        type: 'bar',
        title: '歌曲评论数Top100',
        label: '评论数',
        requestPath: 'song-comment',
        processing: (result, Chart) => {
          // 处理数据
          const xData = [];
          const yData = [];
          result.listData.forEach((e) => {
            xData.push(`${e.name} - ${e.artist.name}`);
            yData.push(e.comment.total);
          });
          return {
            data: Chart.update(xData, yData, '评论数'),
            total: result.total,
          };
        },
      },
    ],
  },
};
