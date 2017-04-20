/* cloud-music api */
module.exports = router => {
  const prefix = '/api/cloud-music';

  // 请求响应
  function response({ req, res, next }, { err, docs }, { db, obj }) {
    if (err) { res.status(500).send(err); } else {
      db.count().then(count => {
        res.status(200).send({
          total: count,
          updateTime: obj.updateTime,
          listData: docs
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
          { db: dbSongs, obj: docs[0].comment }
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
          { db: dbSongs, obj: docs[0].comment }
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
          { db: dbPlaylists, obj: docs[0] }
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
          { db: dbPlaylists, obj: docs[0] }
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
          { db: dbPlaylists, obj: docs[0] }
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
          { db: dbPlaylists, obj: docs[0] }
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
          { db: dbArtists, obj: docs[0] }
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
          { db: dbArtists, obj: docs[0] }
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
          { db: dbArtists, obj: docs[0] }
        );
      });
  });
};
