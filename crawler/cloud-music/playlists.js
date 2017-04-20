/* crawler - cloud-music - playlists
 * 获取所有的热门歌单及其内歌曲
 * @ Cong Min */
const request = require('superagent');
const cheerio = require('cheerio');
const async = require('async');
const db = require('../../server/db.js');

const { getHeader, postHeader, authentication } = require('./config.js');

// 获取歌单列表
function getPlaylistList(page) {
  return new Promise((resolve, reject) => {
    request.get('http://music.163.com/api/playlist/list')
      .query({ order: 'hot', cat: '全部', limit: 35, offset: 35*page })
      .set(getHeader)
      .retry()
      .end((err, res) => {
        if (err) { reject({ hint: `🔥获取第 <${page+1}> 页歌单列表失败`, err }); return; }
        if (res.text) {
          const { playlists } = JSON.parse(res.text);
          if (!playlists.length) { reject({ hint: `无第 <${page+1}> 页歌单列表` }); return; }
          resolve(playlists);
        }
      });
  });
}

// 获取歌单信息
function getPlaylist(id) {
  return new Promise((resolve, reject) => {
    request.get('http://music.163.com/api/playlist/detail')
      .query({ id, csrf_token: '' })
      .set(getHeader)
      .retry()
      .end((err, res) => {
        if (err) { reject({ hint: `🔥获取 <${id}> 歌单信息失败`, err }); return; }
        if (res.text) {
          const { result } = JSON.parse(res.text);
          if (!result) { reject({ hint: `📑无歌单<${id}>` }); return; }
          resolve(result);
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

// 保存歌单
function savePlaylist({ id, name, commentCount, shareCount, playCount, subscribedCount, tracks }, dbPlaylists) {
  return new Promise((resolve, reject) => {
    const playlist = {
      _id: id,                              // 歌单id
      name,                                 // 歌单名
      commentCount,                         // 歌单评论数
      shareCount,                           // 歌单分享量
      playCount,                            // 歌单播放量
      subscribedCount,                      // 歌单收藏量
      updateTime: new Date().getTime()
    };
    // 保存歌单
    dbPlaylists.save(playlist, function(err, res) {
      if (err) { console.error(`🔥歌单 <${id}:${playlist.name}> 录入数据库失败`, err); }
      else { console.info(`📑歌单 <${id}:${playlist.name}> 录入成功`); }
      console.info(`\t📑本歌单共有 [${tracks.length}] 首歌曲`);
      resolve();
    });
  });
}

// 保存歌单中的歌曲
function saveSong(track, dbSongs) {
  return new Promise((resolve, reject) => {
    const song = {
      _id: track.id,                      // 歌曲id
      name: track.name,                   // 歌曲名
      artist: {
        id: track.artists[0].id,          // 歌手id
        name: track.artists[0].name       // 歌手名
      },
      comment: {
        id: track.commentThreadId         // 评论区id
      }
    };
    // 保存歌曲
    dbSongs.insert(song, function(err, res) {
      if (err) { console.error(`\t🔥歌曲 <${song._id}:${song.name}> 录入数据库失败`, err); }
      else { console.info(`\t💿歌曲 <${song._id}:${song.name}> 录入成功`); }
      resolve();
    });
  });
}

// 保存歌曲中的歌手
function saveArtist(artists, dbArtists) {
  return new Promise((resolve, reject) => {
    const artist = {
      _id: artists[0].id,         // 歌手id
      name: artists[0].name       // 歌手名
    };
    if (artist._id) {
      // 保存歌手
      dbArtists.insert(artist, function(err, res) {
        if (err) { console.error(`\t\t🔥歌手 <${artist._id}:${artist.name}> 录入数据库失败`, err); }
        else { console.info(`\t\t🎤歌手 <${artist._id}:${artist.name}> 录入成功`); }
        resolve();
      });
    } else {
      // 无歌手id
      console.info(`\t\t🎤歌手id为空`);
      resolve();
    }
  });
}

// 运行爬取歌单列表
function runPlaylistList(...params) {
  const [page, pageNext, dbPlaylists, dbSongs, dbArtists, {
        start, pageStart, endPage
      }] = params;
  getPlaylistList(page).then(playlists => {

    // 异步并发获取歌单详情
    let playlistIndex = 0;  // 以下歌单所位于本页的序号
    async.mapLimit(playlists, 1, (playlist, playlistNext) => {

      // 爬取单个歌单开始时间
      const playlistStart = new Date().getTime();
      runPlaylist(playlist, playlistNext, dbPlaylists, dbSongs, dbArtists, (playlistDetail) => {
        // 爬取单个歌单结束时间
        const playlistEnd = new Date().getTime();
        if (playlistDetail) {   // 有此歌单
          console.info(`📑歌单 <${playlistDetail.id}:${playlistDetail.name}> 抓取完毕！`);
        }
        console.info(`🕓本歌单耗时: ${(playlistEnd-playlistStart)/1000}s`,
          `总耗时: ${(playlistEnd-start.getTime())/1000}s`);
        console.info(`⏳进度: [${page+1}/${endPage+1}页]`,
          `[${playlistIndex+1}/${playlists.length}歌单]\n`);
        playlistIndex++;
      });

    }, (err, res) => {
      if (err) { console.error(err); } else {
        // 爬取本页歌单结束时间
        const pageEnd = new Date().getTime();
        console.info(`📑第 [${page+1}/${endPage+1}] 页歌单抓取完毕！`);
        console.info(`🕓本页歌单耗时: ${(pageEnd-pageStart)/1000}s`,
          `总耗时: ${(pageEnd-start.getTime())/1000}s`);
      }
      pageNext();
    });

  }).catch(error => {
    catchPromiseError(error);
    pageNext();
  });

}

// 运行爬取歌单
function runPlaylist(...params) {
  const [playlist, playlistNext, dbPlaylists, dbSongs, dbArtists, cb] = params;
  getPlaylist(playlist.id).then(playlistDetail => {

    // 保存歌单
    savePlaylist(playlistDetail, dbPlaylists).then(() => {
      const { tracks } = playlistDetail;
      async.mapLimit(tracks, 5, (track, songNext) => {
        // 保存歌曲
        saveSong(track, dbSongs).then(() => {
          // 保存歌手
          saveArtist(track.artists, dbArtists).then(songNext);
        });
      }, (err, res) => {
        if (err) { console.error(err); } else {
          typeof cb === 'function' && cb(playlistDetail);
          playlistNext();
        }
      });
    });

  }).catch(error => {
    catchPromiseError(error);
    if (!error.err) {
      typeof cb === 'function' && cb();
      playlistNext();
    }
  });
}

// 运行爬虫
function run(db) {
  const dbPlaylists = db.collection('cloud-music:playlists');
  const dbSongs = db.collection('cloud-music:songs');
  const dbArtists = db.collection('cloud-music:artists');
  dbPlaylists.createIndex({ 'commentCount': 1 });
  dbPlaylists.createIndex({ 'shareCount': 1 });
  dbPlaylists.createIndex({ 'playCount': 1 });
  dbPlaylists.createIndex({ 'subscribedCount': 1 });
  const [beginPage, endPage] = [0, 43];   // 歌单分页开始页数, 结束页数
  const pages = new Array(endPage-beginPage+1).fill(beginPage).map((e, i) => i + e);
  // 爬取所有歌单开始时间
  const start = new Date();
  // 异步并发获取歌单列表
  async.mapLimit(pages, 1, (page, pageNext) => {

    // 爬取本页歌单开始时间
    const pageStart = new Date().getTime();
    runPlaylistList(page, pageNext, dbPlaylists, dbSongs, dbArtists, {
      start, pageStart, endPage
    });

  }, (err, res) => {
    if (err) { console.error(err); } else {
      db.close();   // 关闭数据库连接
      // 爬取所有歌单结束时间
      const end = new Date();
      console.info(`\n📑所有歌单全部抓取完毕！`);
      console.info(`开始时间: ${start}`);
      console.info(`结束时间: ${end}`);
      console.info(`🕓耗时: ${(end.getTime()-start.getTime())/1000}s\n`);
    }
  });

}

// 打开数据库，开启运行
db.connect((err, db) => {
  if (err) { console.error(err); } else {
    run(db);
  }
});
