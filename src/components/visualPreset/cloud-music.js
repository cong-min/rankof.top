// 网易云音乐
export default {
  $source: {
    url: 'http://music.163.com',
    name: '网易云音乐',
  },
  visual: {
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
        title: '热门歌曲Top100',
        label: '评论数',
        size: 'md',
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
      {
        type: 'bar',
        title: '热门歌手Top50',
        label: '歌曲评论总数',
        size: 'md',
        requestPath: 'artist-comment',
        parsing: (result, Chart) => {
          // 解析数据
          const xData = [];
          const yData = [];
          result.listData.forEach((e) => {
            xData.push(e.name);
            yData.push(e.commentSize);
          });
          return {
            data: Chart.update(xData, yData, '歌曲评论总数'),
            total: result.total,
            updateTime: result.updateTime,
          };
        },
      },
      {
        type: 'pie',
        title: '歌单播放、收藏、分享、评论量比例统计',
        label: '%',
        size: 'md',
        requestPath: 'playlist-user-action',
        parsing: (result, Chart) => {
          // 解析数据
          const data = [
            { name: '收藏量/播放量', value: (100 * result.data.subscribedCountTotal / result.data.playCountTotal).toFixed(4)  },
            { name: '分享量/收藏量', value: (100 * result.data.shareCountTotal / result.data.subscribedCountTotal).toFixed(4) },
            { name: '评论量/收藏量', value: (100 * result.data.commentCountTotal / result.data.subscribedCountTotal).toFixed(4) },
          ];
          console.log(data);
          return {
            data: Chart.update(data, '%'),
            total: result.total,
            updateTime: result.updateTime,
          };
        },
      },
      {
        type: 'relation',
        title: '网易云音乐热点图',
        label: '评论总数',
        size: 'lg',
        requestPath: 'hotspot',
        parsing: (result, Chart) => {
          // 解析数据
          const data = [{
            name: '网易云音乐',
            symbolSize: 10,
            draggable: false,
            itemStyle: {
              normal: {
                color: '#ccc',
              },
            },
          }];
          const links = [];
          const categories = [];
          result.data.forEach((e, i) => {
            data.push({
              category: e.name,
              name: e.name,
              symbolSize: 30 - i,
              value: e.commentSize,
              draggable: true,
            });
            links.push({
              source: '网易云音乐',
              target: e.name,
            });
            categories.push({
              name: e.name,
            });
            e.songs.forEach((song) => {
              data.push({
                category: e.name,
                name: song.name,
                symbolSize: Math.ceil((song.comment / 80000) + 6),
                value: song.comment,
                draggable: true,
              });
              links.push({
                source: e.name,
                target: song.name,
              });
            });
          });
          return {
            data: Chart.update(data, links, categories, '评论总数'),
          };
        },
      },
    ],
  },
};
