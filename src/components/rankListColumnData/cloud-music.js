// 网易云音乐
export default {
  /* 歌曲 */
  song: {
    $column: [
      {
        type: 'index',
        title: '排行',
        align: 'center',
        width: 80,
      },
      {
        title: '歌曲',
        key: 'name',
        render(row) {
          return `<a href="http://music.163.com/#/song?id=${row._id}" target="_blank">${row.name}</a>`;
        },
      },
      {
        title: '歌手',
        key: 'artist',
        render(row) {
          return `<a href="http://music.163.com/#/artist?id=${row.artist.id}" target="_blank">${row.artist.name}</a>`;
        },
      },
    ],
    // 评论数最多的歌曲
    comment: [{
      title: '评论数',
      key: 'comment',
      align: 'center',
      render(row) {
        return row.comment.total;
      },
    }],
  },
  /* 评论 */
  comment: {
    $column: [
      {
        type: 'index',
        title: '排行',
        align: 'center',
        width: 80,
      },
      {
        title: '歌曲',
        key: 'name',
        width: 180,
        render(row) {
          return `<a href="http://music.163.com/#/song?id=${row._id}" target="_blank">${row.name} - ${row.artist.name}</a>`;
        },
      },
      {
        title: '评论内容',
        key: 'comment',
        render(row) {
          return `<strong>@${row.comment.hottest.nickname}</strong>：${row.comment.hottest.content}`;
        },
      },
    ],
    // 点赞数最多的歌曲评论
    like: [{
      title: '评论赞数',
      key: 'comment',
      align: 'center',
      width: 100,
      render(row) {
        return row.comment.hottest.count;
      },
    }],
  },
  /* 歌单 */
  playlist: {
    $column: [
      {
        type: 'index',
        title: '排行',
        align: 'center',
        width: 80,
      },
      {
        title: '歌单',
        key: 'name',
        render(row) {
          return `<a href="http://music.163.com/#/playlist?id=${row._id}" target="_blank">${row.name}</a>`;
        },
      },
    ],
    // 播放最多的歌单
    play: [{
      title: '播放量',
      key: 'playCount',
      align: 'center',
    }],
    // 收藏最多的歌单
    star: [{
      title: '收藏量',
      key: 'subscribedCount',
      align: 'center',
    }],
    // 播放最多的歌单
    share: [{
      title: '分享量',
      key: 'shareCount',
      align: 'center',
    }],
    // 评论最多的歌单
    comment: [{
      title: '评论数',
      key: 'commentCount',
      align: 'center',
    }],
  },
  /* 歌手 */
  artist: {
    $column: [
      {
        type: 'index',
        title: '排行',
        align: 'center',
        width: 80,
      },
      {
        title: '歌手',
        key: 'name',
        render(row) {
          return `<a href="http://music.163.com/#/artist?id=${row._id}" target="_blank">${row.name}</a>`;
        },
      },
    ],
    // 单曲最多的歌手
    song: [{
      title: '单曲数',
      key: 'musicSize',
      align: 'center',
    }],
    // 专辑最多的歌手
    album: [{
      title: '专辑数',
      key: 'albumSize',
      align: 'center',
    }],
    // MV最多的歌手
    mv: [{
      title: 'MV数',
      key: 'mvSize',
      align: 'center',
    }],
  },
};
