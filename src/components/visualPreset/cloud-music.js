// 网易云音乐
export default {
  'song-comment-visual': [
    {
      type: 'bar',
      name: '歌曲评论数Top100',
      label: '评论数',
      processing: (result, Chart) => {
        // 处理数据
        const xData = [];
        const yData = [];
        result.listData.forEach((e) => {
          xData.push(`${e.name} - ${e.artist.name}`);
          yData.push(e.comment.total);
        });
        return Chart.update(xData, yData, '评论数');
      },
    },
  ],
};
