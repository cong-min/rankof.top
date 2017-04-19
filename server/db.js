/* mongodb */
const { MongoClient, Server, Db } = require('mongodb');
const config = {
  ip: '192.168.2.108',
  port: 27017,
  database: 'rankoftop',
};

// 打开连接
function connect(callback) {
  MongoClient.connect(`mongodb://${config.ip}:${config.port}/${config.database}`, (err, db) => {
    err ? callback(err) : callback(null, db);
  });
}

module.exports = {
  connect,
};
