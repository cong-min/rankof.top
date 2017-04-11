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
  'Cookie': '_ntes_nnid=03139688b8dba6ef0980fc7da1bc5ce9,1491734404984; _ntes_nuid=03139688b8dba6ef0980fc7da1bc5ce9; JSESSIONID-WYYY=tmnKElJyBCKyxajzJQxJShgsbs0vi6rkx1fxOp61ETD15GPyHEh9tm6H33ldgWBGmqnJxt5yp%2BgClg%2B0TN1wEH4UqnSdqaVtjwl6vRJ74ZEp5N%2F5Vzwg9XVGzgZ48d4kCIwM3Bi70Nxa8OgZpbpYBbyhKDhRcXVUjvAb%2FEeD9gFyr2Uo%3A1491816035530; _iuqxldmzr_=32; __utma=94650624.2032956978.1491734408.1491807812.1491814236.6; __utmb=94650624.2.10.1491814236; __utmc=94650624; __utmz=94650624.1491734408.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)'
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
