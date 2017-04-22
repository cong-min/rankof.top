/* cloud-music api */
module.exports = router => {
  const prefix = '/api/cloud-music';

  // 请求响应
  function response({ req, res, next }, { err, docs }, db, updateTime) {
    if (err) { res.status(500).send(err); } else {
      db.count().then(count => {
        res.status(200).send({
          total: count,
          listData: docs,
          updateTime
        });
      });
    }
  }
  // 评论数最多的歌曲 Top100
  router.get(`${prefix}/song-comment`, (req, res, next) => {
    const dbSongs = global.db.collection('cloud-music:songs');
    dbSongs.find({ 'comment.updateTime': { $ne: null } })
      .sort({ 'comment.total': -1}).limit(100)
      .toArray((err, docs) => {
        response(
          { req, res, next },
          { err, docs },
          dbSongs,
          docs[0].comment.updateTime  // updateTime
        );
      });
  });

  // 点赞数最多的歌曲评论 Top50
  router.get(`${prefix}/comment-like`, (req, res, next) => {
    const dbSongs = global.db.collection('cloud-music:songs');
    dbSongs.find({ 'comment.hottest.count': { $ne: null } })
      .sort({ 'comment.hottest.count': -1}).limit(50)
      .toArray((err, docs) => {
        response(
          { req, res, next },
          { err, docs },
          dbSongs,
          docs[0].comment.updateTime  // updateTime
        );
      });
  });

  // 播放量最高的歌单 Top20
  router.get(`${prefix}/playlist-play`, (req, res, next) => {
    const dbPlaylists = global.db.collection('cloud-music:playlists');
    dbPlaylists.find({ 'playCount': { $nin: [ null, 0 ] } })
      .sort({ 'playCount': -1}).limit(20)
      .toArray((err, docs) => {
        response(
          { req, res, next },
          { err, docs },
          dbPlaylists,
          docs[0].updateTime  // updateTime
        );
      });
  });
  // 收藏量最高的歌单 Top20
  router.get(`${prefix}/playlist-star`, (req, res, next) => {
    const dbPlaylists = global.db.collection('cloud-music:playlists');
    dbPlaylists.find({ 'subscribedCount': { $nin: [ null, 0 ] } })
      .sort({ 'subscribedCount': -1}).limit(20)
      .toArray((err, docs) => {
        response(
          { req, res, next },
          { err, docs },
          dbPlaylists,
          docs[0].updateTime  // updateTime
        );
      });
  });
  // 分享量最高的歌单 Top20
  router.get(`${prefix}/playlist-share`, (req, res, next) => {
    const dbPlaylists = global.db.collection('cloud-music:playlists');
    dbPlaylists.find({ 'shareCount': { $nin: [ null, 0 ] } })
      .sort({ 'shareCount': -1}).limit(20)
      .toArray((err, docs) => {
        response(
          { req, res, next },
          { err, docs },
          dbPlaylists,
          docs[0].updateTime  // updateTime
        );
      });
  });
  // 评论数最多的歌单 Top20
  router.get(`${prefix}/playlist-comment`, (req, res, next) => {
    const dbPlaylists = global.db.collection('cloud-music:playlists');
    dbPlaylists.find({ 'commentCount': { $nin: [ null, 0 ] } })
      .sort({ 'commentCount': -1}).limit(20)
      .toArray((err, docs) => {
        response(
          { req, res, next },
          { err, docs },
          dbPlaylists,
          docs[0].updateTime  // updateTime
        );
      });
  });

  // 单曲最多的歌手 Top50
  router.get(`${prefix}/artist-song`, (req, res, next) => {
    const dbArtists = global.db.collection('cloud-music:artists');
    dbArtists.find({ 'musicSize': { $nin: [ null, 0 ] } })
      .sort({ 'musicSize': -1}).limit(50)
      .toArray((err, docs) => {
        response(
          { req, res, next },
          { err, docs },
          dbArtists,
          docs[0].updateTime  // updateTime
        );
      });
  });
  // 专辑最多的歌手 Top50
  router.get(`${prefix}/artist-album`, (req, res, next) => {
    const dbArtists = global.db.collection('cloud-music:artists');
    dbArtists.find({ 'albumSize': { $nin: [ null, 0 ] } })
      .sort({ 'albumSize': -1}).limit(50)
      .toArray((err, docs) => {
        response(
          { req, res, next },
          { err, docs },
          dbArtists,
          docs[0].updateTime  // updateTime
        );
      });
  });
  // MV最多的歌手 Top50
  router.get(`${prefix}/artist-mv`, (req, res, next) => {
    const dbArtists = global.db.collection('cloud-music:artists');
    dbArtists.find({ 'mvSize': { $nin: [ null, 0 ] } })
      .sort({ 'mvSize': -1}).limit(50)
      .toArray((err, docs) => {
        response(
          { req, res, next },
          { err, docs },
          dbArtists,
          docs[0].updateTime  // updateTime
        );
      });
  });
};
