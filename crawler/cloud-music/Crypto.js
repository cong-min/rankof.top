/* 网页云音乐加密算法 */
const crypto = require('crypto');
const bigInt = require('big-integer');

function addPadding(encText, modulus) {
  let ml = modulus.length;
  for (let i = 0; ml > 0 && modulus[i] === '0'; i++) ml--;
  const num = ml - encText.length;
  let prefix = '';
  for (let i = 0; i < num; i++) {
    prefix += '0';
  }
  return prefix + encText;
}

function aesEncrypt(text, secKey) {
  const cipher = crypto.createCipheriv('AES-128-CBC', secKey, '0102030405060708');
  return cipher.update(text, 'utf-8', 'base64') + cipher.final('base64');
}

function rsaEncrypt(text, exponent, modulus) {
  let rText = '';
  const radix = 16;
  for (let i = text.length - 1; i >= 0; i--) rText += text[i];
  const biText = bigInt(new Buffer(rText).toString('hex'), radix),
    biEx = bigInt(exponent, radix),
    biMod = bigInt(modulus, radix),
    biRet = biText.modPow(biEx, biMod);
  return addPadding(biRet.toString(radix), modulus);
}

function createSecretKey(size) {
  const keys = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < size; i++) {
    let pos = Math.random() * keys.length;
    pos = Math.floor(pos);
    key = key + keys.charAt(pos)
  }
  return key;
}
const modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
const nonce = '0CoJUm6Qyw8W8jud';
const pubKey = '010001';
const Crypto = {
  MD5: function (text) {
    return crypto.createHash('md5').update(text).digest('hex');
  },
  aesRsaEncrypt: function (text) {
    const secKey = createSecretKey(16);
    return {
      params: aesEncrypt(aesEncrypt(text, nonce), secKey),
      encSecKey: rsaEncrypt(secKey, pubKey, modulus)
    }
  }
};

module.exports = Crypto;
