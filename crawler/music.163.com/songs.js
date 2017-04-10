/* crawler */
const request = require('superagent');
const cheerio = require('cheerio');
const async = require('async');
const Crypto = require('./Crypto.js');
const db = require('../../server/db.js');

// 请求头
const getHeader = {
  'Accept': '*/*',
  'Referer': 'http://music.163.com/',
  'Origin': 'http://music.163.com',
  'Host': 'music.163.com',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.1 Safari/603.1.30',
  'Cookie': '_ntes_nnid=03139688b8dba6ef0980fc7da1bc5ce9,1491734404984; _ntes_nuid=03139688b8dba6ef0980fc7da1bc5ce9; JSESSIONID-WYYY=tmnKElJyBCKyxajzJQxJShgsbs0vi6rkx1fxOp61ETD15GPyHEh9tm6H33ldgWBGmqnJxt5yp%2BgClg%2B0TN1wEH4UqnSdqaVtjwl6vRJ74ZEp5N%2F5Vzwg9XVGzgZ48d4kCIwM3Bi70Nxa8OgZpbpYBbyhKDhRcXVUjvAb%2FEeD9gFyr2Uo%3A1491816035530; _iuqxldmzr_=32; __utma=94650624.2032956978.1491734408.1491807812.1491814236.6; __utmb=94650624.2.10.1491814236; __utmc=94650624; __utmz=94650624.1491734408.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)'
};
const postHeader = Object.assign({}, getHeader, {
  'Content-Type': 'application/x-www-form-urlencoded'
});

// 加密算法
const authentication = Crypto.aesRsaEncrypt(JSON.stringify({
  'username': '',
  'password': '',
  'rememberLogin': 'true'
}));


// 获取歌单列表
function getPlaylists (page) {
  return new Promise((resolve, reject) => {
    request.get('http://music.163.com/api/playlist/list')
      .query({ order: 'hot', cat: '全部', limit: 35, offset: 35*page })
      .set(getHeader)
      .end((err, res) => {
        if (err) { reject({ hint: `获取第<${page+1}>页歌单列表失败`, err }); return; }
        if (res.text) {
          const { playlists } = JSON.parse(res.text);
          if (!playlists.length) { reject({ hint: `无第<${page+1}>页歌单列表` }); return; }
          resolve(playlists);
        }
      });
  });
}

// 获取歌单信息
function getPlaylist (id) {
  return new Promise((resolve, reject) => {
    request.get('http://music.163.com/api/playlist/detail')
      .query({ id })
      .set(getHeader)
      .end((err, res) => {
        if (err) { reject({ hint: `🔥获取<${id}>歌单信息失败`, err }); return; }
        if (res.text) {
          const { result } = JSON.parse(res.text);
          if (!result) { reject({ hint: `📑无歌单<${id}>` }); return; }
          resolve(result);
        }
      });
  });
}

// 获取歌曲信息
function getSong (id) {
  return new Promise((resolve, reject) => {
    request.get('http://music.163.com/api/song/detail')
      .query({ id, ids: `[${id}]` })
      .set(getHeader)
      .end((err, res) => {
        if (err) { reject({ hint: `🔥获取歌曲<${id}>信息失败`, err }); return; }
        if (res.text) {
          const { songs } = JSON.parse(res.text);
          if (!songs[0]) { reject({ hint: `💿无歌曲<${id}>` }); return; }
          resolve(songs[0]);
        }
      });
  });
}

// 获取歌曲评论
function getSongComment ({ id, name, comment }) {
  return new Promise((resolve, reject) => {
    request.post(`http://music.163.com/weapi/v1/resource/comments/${comment.id}`)
      .set(postHeader)
      .send(authentication)
      .end((err, res) => {
        if (err) { reject({ hint: `🔥获取<${id}-${name}>评论失败`, err }); return; }
        if (res.text) {
          const { total, hotComments } = JSON.parse(res.text);
          if (!total) { reject({ hint: `💿歌曲<${id}-${name}>无评论` }); return; }
          resolve({ total, hotComment: hotComments[0] });
        }
      });
  });
}

// 捕捉错误
function catchPromiseError (error) {
  if (!error.hint) { console.error(error); }
  else if (!error.err) { console.error(error.hint); }
  else { console.error(error.hint, error.err.status || error.err); }
}

// 保存歌单
function savePlaylist ({ id, name, commentCount, shareCount, playCount, subscribedCount }, dbPlaylists) {
  const playlist = {
    id,                                   // 歌单id
    name,                                 // 歌单名
    commentCount,                         // 歌单评论数
    shareCount,                           // 歌单分享量
    playCount,                            // 歌单播放量
    subscribedCount                       // 歌单收藏量
  };
  // 保存歌单
  dbPlaylists.update({ id }, playlist, { upsert: true }, function(err, res) {
    if (err) { console.error(`🔥歌单<${playlist.id}-${playlist.name}>录入数据库失败`, err); return; }
    console.info(`📑歌单<${playlist.id}-${playlist.name}>获取成功`);
  });
}

// 保存歌曲
function saveSong (track, dbSongs, cb) {
  const song = {
    id: track.id,                       // 歌曲id
    name: track.name,                   // 歌曲名
    artist: {
      id: track.artists[0].id,          // 歌手id
      name: track.artists[0].name       // 歌手名
    },
    comment: {
      id: track.commentThreadId,        // 评论区id
      total: 0,
      hottest: {}
    }
  };
  // 同时获取歌曲评论
  getSongComment(song).then(({ total, hotComment }) => {
    Object.assign(song.comment, {
      total,                                // 评论总数
      hottest: !hotComment ? {} : {
        count: hotComment.likedCount,       // 最火热评点赞总数
        nickname: hotComment.user.nickname, // 最火热评作者
        content: hotComment.content         // 最火热评内容
      }
    });
  }).catch(catchPromiseError).then(() => {
    // 保存歌曲
    dbSongs.update({ id: song.id }, song, { upsert: true }, function(err, res) {
      if (err) {
        console.error(`🔥歌曲<${song.id}-${song.name}>录入数据库失败`, err);
        typeof cb === "function" && cb();
        return;
      }
      console.info(`💿歌曲<${song.id}-${song.name}>抓取成功`);
      typeof cb === "function" && cb();
    });
  });
}

// 运行爬虫
function run (db) {
  const dbPlaylists = db.collection('music.163.com:playlists');
  const dbSongs = db.collection('music.163.com:songs');
  const beginPage = 0;     // 开始页数
  const endPage = 42;       // 结束页数
  const pages = new Array(endPage-beginPage+1).fill(0).map((e, i) => i + beginPage);
  // 爬取所有歌单开始时间
  const start = new Date();
  // 异步并发获取歌单列表
  async.mapLimit(pages, 1, (page, pageNext) => {
    getPlaylists(page).then(playlists => {

      // 异步并发获取歌单详情
      // 爬取本页歌单开始时间
      let playlistIndex = 0;
      const pageStart = new Date().getTime();
      async.mapLimit(playlists, 1, (playlist, playlistNext) => {
        getPlaylist(playlist.id).then(playlistDetail => {
          savePlaylist(playlistDetail, dbPlaylists);

          // 异步并发获取歌曲信息
          // 爬取歌单开始时间
          const playlistStart = new Date().getTime();
          async.mapLimit(playlistDetail.tracks, 2, (track, trackNext) => {
            saveSong(track, dbSongs, trackNext);
          }, (err, res) => {
            if (err) { console.error(err); } else {
              // 爬取歌单结束时间
              const playlistEnd = new Date().getTime();
              console.info(`📑歌单<${playlistDetail.id}-${playlistDetail.name}>抓取完毕！`);
              console.info(`🕓本歌单耗时: ${(playlistEnd-playlistStart)/1000}s`,
                `总耗时: ${(playlistEnd-start.getTime())/1000}s`);
              console.info(`⏳进度: ${page+1}/${endPage}页`,
                `${playlistIndex+1}/${playlists.length}歌单\n`);
            }
            playlistIndex++;
            playlistNext();
          });

        }).catch(catchPromiseError);
      }, (err, res) => {
        if (err) { console.error(err); } else {
          // 爬取本页歌单结束时间
          const pageEnd = new Date().getTime();
          console.info(`📑第${page+1}页歌单抓取完毕！`);
          console.info(`🕓本页歌单耗时: ${(pageEnd-pageStart)/1000}s`,
            `总耗时: ${(pageEnd-start.getTime())/1000}s`);
          console.info(`⏳进度: ${page}/${endPage}页\n`);
        }
        pageNext();
      });

    }).catch(catchPromiseError);
  }, (err, res) => {
    if (err) { console.error(err); } else {
      db.close();
      // 爬取所有歌单结束时间
      const end = new Date();
      console.info(`\n📑💿所有歌单及歌曲全部抓取完毕！`);
      console.info(`开始时间: ${start}`);
      console.info(`结束时间: ${end}`);
      console.info(`🕓耗时: ${(end.getTime()-start.getTime())/1000}s\n`);
    }
  });
}

db.open((err, db) => {
  if (err) { console.error(err); } else {
    run(db);
  }
});
