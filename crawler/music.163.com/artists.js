/* crawler - music.163.com - playlists
 * 获取所有的热门歌手及其热门歌曲
 * @ Cong Min */
const request = require('superagent');
const cheerio = require('cheerio');
const async = require('async');
const db = require('../../server/db.js');
const { getHeader, postHeader, authentication } = require('./config.js');

// 获取歌手具体信息&热门歌曲
function getArtist(id) {
  return new Promise((resolve, reject) => {
    request.get(`http://music.163.com/api/artist/${id}`)
      .set(getHeader)
      .retry()
      .end((err, res) => {
        if (err) { reject({ hint: `获取歌手 <${id}> 信息失败`, err }); return; }
        if (res.text) {
          const { artist, hotSongs } = JSON.parse(res.text);
          resolve({ artist, hotSongs });
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

// 保存歌手信息
function saveArtist(artist, dbArtists) {
  return new Promise((resolve, reject) => {
    const iArtist = {
      _id: artist.id,                 // 歌手id
      name: artist.name,              // 歌手名
      albumSize: artist.albumSize,    // 歌手专辑数
      musicSize: artist.musicSize,    // 歌手音乐数
      mvSize: artist.mvSize           // 歌手MV数
    };
    // 保存歌手
    dbArtists.update({ _id: iArtist._id }, iArtist, function(err, res) {
      if (err) { console.error(`🔥歌手 <${iArtist._id}:${iArtist.name}> 录入数据库失败`, err); }
      else { console.info(`🎤歌手 <${iArtist._id}:${iArtist.name}> 录入成功`); }
      resolve();
    });
  });
}

// 保存歌手热门歌曲
function saveSong(hotSong, dbSongs) {
  return new Promise((resolve, reject) => {
    const song = {
      _id: hotSong.id,                      // 歌曲id
      name: hotSong.name,                   // 歌曲名
      artist: {
        id: hotSong.artists[0].id,          // 歌手id
        name: hotSong.artists[0].name       // 歌手名
      },
      comment: {
        id: `R_SO_4_${hotSong.id}`          // 评论区id
      }
    };
    // 保存歌曲
    dbSongs.save(song, function(err, res) {
      if (err) { console.error(`\t🔥歌曲 <${song._id}:${song.name}> 录入数据库失败`, err); }
      else { console.info(`\t💿歌曲 <${song._id}:${song.name}> 录入成功`); }
      resolve();
    });
  });
}

// 运行爬取歌曲评论
function runArtist(...params) {
  const [record, recordNext, dbArtists, dbSongs, cb] = params;
  dbArtists.find({ _id: record._id }).toArray((err, docs) => {
    if (docs[0].updateTime && new Date().getTime() - docs[0].updateTime < 24*60*60*1000) {
      // 如果歌手有updateTime，并且updateTime距今相差小于24小时，则跳过此歌手的爬取
      typeof cb === 'function' && cb('skip');
      recordNext();
      return;
    }
    getArtist(record._id).then(({ artist, hotSongs }) => {

      // 保存歌手信息
      saveArtist(artist, dbArtists).then(() => {

        async.mapLimit(hotSongs, 5, (hotSong, songNext) => {
          // 保存歌手热门歌曲
          saveSong(hotSong, dbSongs).then(songNext);
        }, (err, res) => {
          if (err) { console.error(err); } else {
            typeof cb === 'function' && cb();
            recordNext();
          }
        });
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
  const dbArtists = db.collection('music.163.com:artists');
  const dbSongs = db.collection('music.163.com:songs');
  // 爬取所有歌手信息开始时间
  const start = new Date();
  let artistIndex = 0;  // 歌手所位于数据库中的序号
  let artistCount;
  dbArtists.count().then(count => {
    artistCount = count;
  });

  // 利用stream读取大量数据
  const stream = dbArtists.find().stream();
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
    console.info(`\n📑🎤所有歌手信息全部抓取完毕！`);
    console.info(`开始时间: ${start}`);
    console.info(`结束时间: ${end}`);
    console.info(`🕓耗时: ${(end.getTime()-start.getTime())/1000}s\n`);
  });
  stream.on('close', () => { console.log('query closed'); });

  // 每读取10个数据执行一次toDo
  function toDo(records, callback) {
    // 异步并发获取歌手信息
    async.mapLimit(records, 1, (record, recordNext) => {

      // 爬取歌手信息开始时间
      const artistStart = new Date().getTime();
      runArtist(record, recordNext, dbArtists, dbSongs, (status) => {
        // 爬取歌手信息结束时间
        const artistEnd = new Date().getTime();
        if (status === 'skip') {
          console.info(`🎤歌手 <${record._id}:${record.name}> 信息最近已完成抓取，此次将跳过！`);
        } else {
          console.info(`🎤歌手 <${record._id}:${record.name}> 信息抓取完毕！`);
          console.info(`🕓该歌手信息耗时: ${(artistEnd-artistStart)/1000}s`,
            `总耗时: ${(artistEnd-start.getTime())/1000}s`);
        }
        console.info(`⏳进度: [${artistIndex+1}/${artistCount}歌手]\n`);
        artistIndex++;
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