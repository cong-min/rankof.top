// 网易云音乐
/* eslint-disable no-unused-vars */
import { Poptip } from 'iview';
import formatTimer from '@/filters/formatTimer';

function updateTimeRender(h, updateTime, value) {
  return (
    <Poptip trigger="hover" content={ formatTimer('time')(updateTime, '更新时间：') } placement="bottom-end">{value}</Poptip>
  );
}

export default {
  $source: {
    url: 'http://music.163.com',
    name: '网易云音乐',
  },
  /* 歌曲 */
  song: {
    $dataType: '歌曲',
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
        render(h, { row }) {
          return (
            <a href={`http://music.163.com/#/song?id=${row._id}`} target="_blank">{row.name}</a>
          );
        },
      },
      {
        title: '歌手',
        key: 'artist',
        render(h, { row }) {
          return (
            <a href={`http://music.163.com/#/artist?id=${row.artist.id}`} target="_blank">{row.artist.name}</a>
          );
        },
      },
    ],
    // 评论数最多的歌曲
    comment: [{
      title: '评论数',
      key: 'comment',
      align: 'center',
      render(h, { row }) {
        return updateTimeRender(h, row.comment.updateTime, row.comment.total);
      },
    }],
  },
  /* 评论 */
  comment: {
    $dataType: '歌曲',
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
        render(h, { row }) {
          return (
            <a href={`http://music.163.com/#/song?id=${row._id}`} target="_blank">{row.name} - {row.artist.name}</a>
          );
        },
      },
      {
        title: '评论内容',
        key: 'comment',
        render(h, { row }) {
          return (
            <span>
              <strong>@{row.comment.hottest.nickname}</strong>：{row.comment.hottest.content}
            </span>
          );
        },
      },
    ],
    // 点赞数最多的歌曲评论
    like: [{
      title: '评论赞数',
      key: 'comment',
      align: 'center',
      width: 100,
      render(h, { row }) {
        return updateTimeRender(h, row.comment.updateTime, row.comment.hottest.count);
      },
    }],
  },
  /* 歌单 */
  playlist: {
    $dataType: '歌单',
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
        render(h, { row }) {
          return (
            <a href={`http://music.163.com/#/playlist?id=${row._id}`} target="_blank">{row.name}</a>
          );
        },
      },
    ],
    // 播放最多的歌单
    play: [{
      title: '播放量',
      key: 'playCount',
      align: 'center',
      render(h, { row }) {
        return updateTimeRender(h, row.updateTime, row.playCount);
      },
    }],
    // 收藏最多的歌单
    star: [{
      title: '收藏量',
      key: 'subscribedCount',
      align: 'center',
      render(h, { row }) {
        return updateTimeRender(h, row.updateTime, row.subscribedCount);
      },
    }],
    // 播放最多的歌单
    share: [{
      title: '分享量',
      key: 'shareCount',
      align: 'center',
      render(h, { row }) {
        return updateTimeRender(h, row.updateTime, row.shareCount);
      },
    }],
    // 评论最多的歌单
    comment: [{
      title: '评论数',
      key: 'commentCount',
      align: 'center',
      render(h, { row }) {
        return updateTimeRender(h, row.updateTime, row.commentCount);
      },
    }],
  },
  /* 歌手 */
  artist: {
    $dataType: '歌手',
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
        render(h, { row }) {
          return (
            <a href={`http://music.163.com/#/artist?id=${row._id}`} target="_blank">{row.name}</a>
          );
        },
      },
    ],
    // 单曲最多的歌手
    song: [{
      title: '单曲数',
      key: 'musicSize',
      align: 'center',
      render(h, { row }) {
        return updateTimeRender(h, row.updateTime, row.musicSize);
      },
    }],
    // 专辑最多的歌手
    album: [{
      title: '专辑数',
      key: 'albumSize',
      align: 'center',
      render(h, { row }) {
        return updateTimeRender(h, row.updateTime, row.albumSize);
      },
    }],
    // MV最多的歌手
    mv: [{
      title: 'MV数',
      key: 'mvSize',
      align: 'center',
      render(h, { row }) {
        return updateTimeRender(h, row.updateTime, row.mvSize);
      },
    }],
  },
};
