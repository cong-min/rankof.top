export default {
  // 网易云音乐
  'cloud-music': {
    // 评论数最多的歌曲
    'song-comment': [
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
      {
        title: '评论数',
        key: 'comment',
        align: 'center',
        render(row) {
          return row.comment.total;
        },
      },
    ],

    // 点赞数最多的歌曲评论
    'comment-like': [
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
      {
        title: '评论赞数',
        key: 'comment',
        align: 'center',
        width: 100,
        render(row) {
          return row.comment.hottest.count;
        },
      },
    ],

    // 单曲最多的歌手
    'artist-song': [
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
      {
        title: '单曲数',
        key: 'musicSize',
        align: 'center',
      },
    ],

    // 专辑最多的歌手
    'artist-album': [
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
      {
        title: '专辑数',
        key: 'albumSize',
        align: 'center',
      },
    ],
    // MV最多的歌手
    'artist-mv': [
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
      {
        title: 'MV数',
        key: 'mvSize',
        align: 'center',
      },
    ],
  },


};
