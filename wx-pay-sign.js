const Url  = require('url');
const crypto = require('crypto');
const { configure } = require('./config/index');
const config = configure();
 
//时间戳
function createTimestamp() {
  return parseInt(new Date().getTime() / 1000) + ''
}
//随机字符串
function createNonceStr() {
  return Math.random().toString(36).substr(2, 15)
}
//sha256
function sha256(str) {
  let sign = crypto.createSign("sha256");
  sign.update(str,'utf8');
  sign.end();
   
  const signature = sign.sign(config.wxpay.mchPrivateKey,'base64');
  console.log('WxPaySign Orgin = ' + str + ',Sign = ' + signature);
  return signature
}
//签名
function sign(_Array){
  let _Msg = '';
  _Array.forEach( Param =>{
    _Msg += Param + '\n';
  })
  return sha256(_Msg);
}

//auth 验证信息
function getAuth(method,url,body){
  let _Method = method.toUpperCase() ;
  let _Url = Url.parse(url).path;
  let _TimeStamp = createTimestamp();
  let _NoncesStr = createNonceStr();
  let _Data = JSON.stringify(body);
  let _Array = [_Method,_Url,_TimeStamp,_NoncesStr,_Data]
  let _Sign = sign(_Array);
  return `WECHATPAY2-SHA256-RSA2048 mchid="${config.wxpay.mchID}",serial_no="${config.wxpay.mchCertificateSerialNumber}",nonce_str="${_NoncesStr}",timestamp="${_TimeStamp}",signature="${_Sign}"`;
}

/**
 * 使用AEAD_AES_256_GCM解密数据
 * @param cipherText 密文
 * @param key API V3密钥
 * @param iv nonce字符串
 * @param add associated_data字符串
 */
function decode( cipherText,nonce,associated_data) {
  cipherText = Buffer.from(cipherText, 'base64');
  associated_data = Buffer.from(associated_data);
  let authTag = cipherText.slice(cipherText.length - 16);
  let data = cipherText.slice(0, cipherText.length - 16);
  let decipher = crypto.createDecipheriv('aes-256-gcm', config.wxpay.mchAPIv3Key, nonce);

  decipher.setAuthTag(authTag);
  decipher.setAAD(associated_data);
  let rst = decipher.update(data, 'binary', 'utf8');
  try {
    rst += decipher.final('utf-8');
  } catch (e) {
    console.error(e.toString());
  }
  return rst;
}

module.exports = {
  sign,  
  decode,
  getAuth,
  createNonceStr,
  createTimestamp
}