// 配置文件
const fs = require('fs');
const path = require('path');
const defaultConfig = {
    wx_appId: 'xxxx',//公众号appid
    wxpay: {
      mchID:'16xxxxx',//商户号id
      mchCertificateSerialNumber:'xxxx',// 商户证书 对应的序列号
      mchAPIv3Key:'xxx',//apikey 
      mchPrivateKey: fs.readFileSync(path.join(__dirname, 'ssl.pem'), 'utf8'), //证书秘钥 
    }
  };
  //重载配置
  function configure(userConfig) {
    const mergedConfig = { ...defaultConfig, ...userConfig };
    return mergedConfig;
  }

  module.exports = {
    defaultConfig,
    configure,
  };
  