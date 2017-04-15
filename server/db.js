/* mongodb */
const { MongoClient, Server, Db } = require('mongodb');
const server = new Server('localhost', 27017);
const db = new Db('rankoftop', server);

module.exports = db;
