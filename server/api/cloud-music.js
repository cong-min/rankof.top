/* cloud-music api */
module.exports = router => {
  const prefix = '/api/cloud-music';

  // 评论数最多的歌曲 Top100
  router.get(`${prefix}/song-comment`, (req, res, next) => {
    global.db.collection('cloud-music:songs')
      .find({ 'comment.updateTime': { $ne: null } })
      .sort({ 'comment.total': -1}).limit(100)
      .toArray((err, docs) => {
        if (err) { res.send(err); } else {
          res.send(docs);
        }
      });
  });

  // 点赞数最多的歌曲评论 Top50
  router.get(`${prefix}/comment-like`, (req, res, next) => {
    global.db.collection('cloud-music:songs')
      .find({ 'comment.hottest.count': { $ne: null } })
      .sort({ 'comment.hottest.count': -1}).limit(50)
      .toArray((err, docs) => {
        if (err) { res.send(err); } else {
          res.send(docs);
        }
      });
  });

  // 播放量最高的歌单 Top20
  router.get(`${prefix}/playlist-play`, (req, res, next) => {
    global.db.collection('cloud-music:playlists')
      .find({ 'playCount': { $nin: [ null, 0 ] } })
      .sort({ 'playCount': -1}).limit(20)
      .toArray((err, docs) => {
        if (err) { res.send(err); } else {
          res.send(docs);
        }
      });
  });
  // 收藏量最高的歌单 Top20
  router.get(`${prefix}/playlist-star`, (req, res, next) => {
    global.db.collection('cloud-music:playlists')
      .find({ 'subscribedCount': { $nin: [ null, 0 ] } })
      .sort({ 'subscribedCount': -1}).limit(20)
      .toArray((err, docs) => {
        if (err) { res.send(err); } else {
          res.send(docs);
        }
      });
  });
  // 分享量最高的歌单 Top20
  router.get(`${prefix}/playlist-share`, (req, res, next) => {
    global.db.collection('cloud-music:playlists')
      .find({ 'shareCount': { $nin: [ null, 0 ] } })
      .sort({ 'shareCount': -1}).limit(20)
      .toArray((err, docs) => {
        if (err) { res.send(err); } else {
          res.send(docs);
        }
      });
  });
  // 评论数最多的歌单 Top20
  router.get(`${prefix}/playlist-comment`, (req, res, next) => {
    global.db.collection('cloud-music:playlists')
      .find({ 'commentCount': { $nin: [ null, 0 ] } })
      .sort({ 'commentCount': -1}).limit(20)
      .toArray((err, docs) => {
        if (err) { res.send(err); } else {
          res.send(docs);
        }
      });
  });

  // 单曲最多的歌手 Top50
  router.get(`${prefix}/artist-song`, (req, res, next) => {
    global.db.collection('cloud-music:artists')
      .find({ 'musicSize': { $nin: [ null, 0 ] } })
      .sort({ 'musicSize': -1}).limit(50)
      .toArray((err, docs) => {
        if (err) { res.send(err); } else {
          res.send(docs);
        }
      });
  });
  // 专辑最多的歌手 Top50
  router.get(`${prefix}/artist-album`, (req, res, next) => {
    global.db.collection('cloud-music:artists')
      .find({ 'albumSize': { $nin: [ null, 0 ] } })
      .sort({ 'albumSize': -1}).limit(50)
      .toArray((err, docs) => {
        if (err) { res.send(err); } else {
          res.send(docs);
        }
      });
  });
  // MV最多的歌手 Top50
  router.get(`${prefix}/artist-mv`, (req, res, next) => {
    global.db.collection('cloud-music:artists')
      .find({ 'mvSize': { $nin: [ null, 0 ] } })
      .sort({ 'mvSize': -1}).limit(50)
      .toArray((err, docs) => {
        if (err) { res.send(err); } else {
          res.send(docs);
        }
      });
  });
};
