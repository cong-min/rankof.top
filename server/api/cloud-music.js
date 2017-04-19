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
