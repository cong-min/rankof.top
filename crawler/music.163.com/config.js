/* crawler - music.163.com - config 配置
 * @ Cong Min */
const Crypto = require('./Crypto.js');

// 请求头
const getHeader = {
  'Accept': '*/*',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
  'Connection': 'keep-alive',
  'Referer': 'http://music.163.com',
  'Origin': 'http://music.163.com',
  'Host': 'music.163.com',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.1 Safari/603.1.30',
  'Cookie': 'appver=2.0.2'
};
const postHeader = Object.assign({}, getHeader, {
  'Content-Type': 'application/x-www-form-urlencoded'
});

// 加密认证
const authentication = Crypto.aesRsaEncrypt(JSON.stringify({
  'username': '',
  'password': '',
  'rememberLogin': 'true'
}));

module.exports = {
  getHeader,
  postHeader,
  authentication
};
