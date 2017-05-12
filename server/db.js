/* mongodb */
const { MongoClient, Server, Db } = require('mongodb');
const config = require('./db.config');

// 打开连接
function connect(callback) {
  MongoClient.connect(`mongodb://${config.user}:${config.passwd}@${config.ip}:${config.port}/${config.database}`, (err, db) => {
    err ? callback(err) : callback(null, db);
  });
}

module.exports = {
  connect,
};
