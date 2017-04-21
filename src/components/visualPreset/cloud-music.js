// 网易云音乐
export default {
  'song-comment-visual': [
    {
      type: 'bar',
      name: '歌曲评论数Top100',
      processing: function(result, Chart) {
        // 处理数据
        const listData = result.listData;
        const pieData = listData.slice(0, 10).map(e => ({
          name: `${e.name} - ${e.artist.name}`,
          value: e.comment.total,
        }));
        const barXData = [];
        const barYData = [];
        listData.forEach((e) => {
          barXData.push(`${e.name} - ${e.artist.name}`);
          barYData.push(e.comment.total);
        });
        return Chart.update(pieData, '评论数')
      }
    },
  ],
};
