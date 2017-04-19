export default {
  // 网易云音乐
  'cloud-music': [
    {
      name: 'song',
      title: '歌曲',
      icon: 'music-note',
      children: [
        { name: 'song-comment', title: '评论数最多的歌曲 Top100' },
      ],
    },
    {
      name: 'comment',
      title: '评论',
      icon: 'chatboxes',
      children: [
        { name: 'comment-like', title: '点赞数最多的歌曲评论 Top50' },
      ],
    },
    {
      name: 'playlist',
      title: '歌单',
      icon: 'android-list',
      children: [
        { name: 'playlist-play', title: '播放量最高的歌单 Top20' },
        { name: 'playlist-star', title: '收藏量最高的歌单 Top20' },
        { name: 'playlist-share', title: '分享量最高的歌单 Top20' },
        { name: 'playlist-comment', title: '评论数最多的歌单 Top20' },
      ],
    },
    {
      name: 'artist',
      title: '歌手',
      icon: 'person-stalker',
      children: [
        { name: 'artist-song', title: '单曲最多的歌手 Top50' },
        { name: 'artist-album', title: '专辑最多的歌手 Top50' },
        { name: 'artist-mv', title: 'MV最多的歌手 Top50' },
      ],
    },
  ],

  // 知乎
  zhihu: [
    {
      name: 'song',
      title: '知乎',
      icon: 'music-note',
      children: [
        { name: 'song-comment', title: '评论数最多的歌曲 Top100' },
      ],
    },
  ],

};
