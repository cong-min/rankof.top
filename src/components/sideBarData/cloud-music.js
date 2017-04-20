// 网易云音乐
export default [
  {
    name: 'song',
    title: '歌曲',
    icon: 'music-note',
    children: [
      { name: 'song-comment', title: '评论数最多的歌曲 Top100', pageType: 'rankList' },
    ],
  },
  {
    name: 'comment',
    title: '评论',
    icon: 'chatboxes',
    children: [
      { name: 'comment-like', title: '点赞数最多的歌曲评论 Top50', pageType: 'rankList' },
    ],
  },
  {
    name: 'playlist',
    title: '歌单',
    icon: 'android-list',
    children: [
      { name: 'playlist-play', title: '播放量最高的歌单 Top20', pageType: 'rankList' },
      { name: 'playlist-star', title: '收藏量最高的歌单 Top20', pageType: 'rankList' },
      { name: 'playlist-share', title: '分享量最高的歌单 Top20', pageType: 'rankList' },
      { name: 'playlist-comment', title: '评论数最多的歌单 Top20', pageType: 'rankList' },
    ],
  },
  {
    name: 'artist',
    title: '歌手',
    icon: 'person-stalker',
    children: [
      { name: 'artist-song', title: '单曲最多的歌手 Top50', pageType: 'rankList' },
      { name: 'artist-album', title: '专辑最多的歌手 Top50', pageType: 'rankList' },
      { name: 'artist-mv', title: 'MV最多的歌手 Top50', pageType: 'rankList' },
    ],
  },
];
