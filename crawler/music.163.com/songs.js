/* crawler - music.163.com - songs
 * 获取所有的歌曲及其评论
 * @ Cong Min */
const request = require('superagent');
const cheerio = require('cheerio');
const async = require('async');
const db = require('../../server/db.js');

const { getHeader, postHeader, authentication } = require('./config.js');

// 获取歌曲信息
function getSong(id) {
  return new Promise((resolve, reject) => {
    request.get('http://music.163.com/api/song/detail')
      .query({ id, ids: `[${id}]` })
      .set(getHeader)
      .retry()
      .end((err, res) => {
        if (err) { reject({ hint: `🔥获取歌曲 <${id}> 信息失败`, err }); return; }
        if (res.text) {
          const { songs } = JSON.parse(res.text);
          if (!songs[0]) { reject({ hint: `💿无歌曲<${id}>` }); return; }
          resolve(songs[0]);
        }
      });
  });
}

// 获取歌曲评论
function getSongComment({ _id, name, comment }) {
  return new Promise((resolve, reject) => {
    request.post(`http://music.163.com/weapi/v1/resource/comments/${comment.id}/`)
      .set(postHeader)
      .send(authentication)
      .retry()
      .end((err, res) => {
        if (err) { reject({ hint: `🔥获取 <${_id}:${name}> 评论失败`, err }); return; }
        if (res.text) {
          const { total, hotComments } = JSON.parse(res.text);
          if (!total) { reject({ hint: `💿歌曲 <${_id}:${name}> 无评论\n` }); return; }
          resolve({ commentId: comment.id, total, hotComment: hotComments[0] });
        }
      });
  });
}

// 捕捉错误
function catchPromiseError(error) {
  if (!error.hint) { console.error(error); }
  else if (!error.err) { console.error(error.hint); }
  else { console.error(error.hint, error.err.status || error.err); }
}

// 保存歌曲
function saveSongComment(song, { commentId, total, hotComment }, dbSongs) {
  return new Promise((resolve, reject) => {
    const songComment = {
      id: commentId,                                   // 评论区id
      total,                                // 评论总数
      hottest: !hotComment ? {} : {
        count: hotComment.likedCount,       // 最火热评点赞总数
        nickname: hotComment.user.nickname, // 最火热评作者
        content: hotComment.content         // 最火热评内容
      },
      updateTime: new Date().getTime()
    };
    // 保存歌曲
    dbSongs.update({ _id: song._id }, { $set: { comment: songComment } }, function(err, res) {
      if (err) { console.error(`🔥歌曲 <${song._id}:${song.name}> 录入数据库失败`, err); }
      else { console.info(`💿歌曲 <${song._id}:${song.name}> 录入成功`); }
      resolve();
    });
  });
}

// 运行爬取歌曲评论
function runSongComment(...params) {
  const [record, recordNext, dbSongs, cb] = params;
  dbSongs.find({ _id: record._id }).toArray((err, docs) => {
    if (docs[0].comment.updateTime && new Date().getTime() - docs[0].comment.updateTime < 24*60*60*1000) {
      // 如果评论有updateTime，并且updateTime距今相差小于24小时，则跳过此歌曲评论的爬取
      typeof cb === 'function' && cb('skip');
      recordNext();
      return;
    }
    getSongComment(record).then(comment => {

      // 保存歌曲评论
      saveSongComment(record, comment, dbSongs).then(() => {
        typeof cb === 'function' && cb();
        recordNext();
      });

    }).catch(error => {
      catchPromiseError(error);
      if (!error.err) {
        typeof cb === 'function' && cb();
        recordNext();
      }
    });
  });
}

// 运行爬虫
function run(db) {
  const dbSongs = db.collection('music.163.com:songs');
  // 爬取所有歌曲评论开始时间
  const start = new Date();
  let songIndex = 0;  // 歌曲所位于数据库中的序号
  let songCount;
  dbSongs.count().then(count => {
    songCount = count
  });

  // 利用stream读取大量数据
  const stream = dbSongs.find().stream();
  let cache = [];
  stream.on('data', item => {
    cache.push(item);
    if (cache.length === 10) {
      stream.pause();
      process.nextTick(() => {
        toDo(cache, () => {
          cache = [];
          stream.resume();  // fetch next
        });
      });
    }
  });
  stream.on('end', () => {
    db.close();
    // 爬取所有歌单结束时间
    const end = new Date();
    console.info(`\n📑💿所有歌曲评论全部抓取完毕！`);
    console.info(`开始时间: ${start}`);
    console.info(`结束时间: ${end}`);
    console.info(`🕓耗时: ${(end.getTime()-start.getTime())/1000}s\n`);
  });
  stream.on('close', () => { console.log('query closed'); });

  // 每读取10个数据执行一次toDo
  function toDo(records, callback) {
    // 异步并发获取歌曲评论
    async.mapLimit(records, 2, (record, recordNext) => {

      // 爬取歌曲评论开始时间
      const songStart = new Date().getTime();
      runSongComment(record, recordNext, dbSongs, (status) => {
        // 爬取歌曲评论结束时间
        const songEnd = new Date().getTime();
        if (status === 'skip') {
          console.info(`💿歌曲 <${record._id}:${record.name}> 评论最近已完成抓取，此次将跳过！`);
        } else {
          console.info(`💿歌曲 <${record._id}:${record.name}> 评论抓取完毕！`);
          console.info(`🕓本歌曲评论耗时: ${(songEnd-songStart)/1000}s`,
            `总耗时: ${(songEnd-start.getTime())/1000}s`);
        }
        console.info(`⏳进度: [${songIndex+1}/${songCount}歌曲]\n`);
        songIndex++;
      });

    }, (err, res) => {
      if (err) { console.error(err); } else {
        process.nextTick(callback);   // next
      }
    });
  }

}

// 打开数据库，开启运行
db.open((err, db) => {
  if (err) { console.error(err); } else {
    run(db);
  }
});
