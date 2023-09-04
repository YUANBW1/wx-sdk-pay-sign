
const fs = require('fs');
const wxsdksign = require('./wx-sdk-sign');
const wxpaysign = require('./wx-pay-sign');
const {configure} = require('./config');
//自定义配置参数 示例
const userConfig = {
    wx_appId: 'appid',
    wxpay: {
        mchID:'16xxxxx',//商户号id
        mchCertificateSerialNumber:'aaaa',// 商户证书 对应的序列号
        mchAPIv3Key:'aaaaa',//apikey 
        mchPrivateKey: fs.readFileSync(('./config/ssl.pem'), 'utf8'), //证书秘钥 
      }
  };
  
 configure(userConfig);

// ticket  微信授权验证ticket 
// url 公众号授权url
// let sdk_data = wxsdksign({ ticket, url });  //前端唤醒wx-sdk支付配置
 
//微信支付权限字符串 
  let auth_data = wxpaysign.getAuth('POST','http://qq.com',{});
  


