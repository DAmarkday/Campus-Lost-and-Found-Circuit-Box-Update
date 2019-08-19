// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
var getAccessToken = function () { //人脸识别API
  var https = require('https');
  var qs = require('querystring');

  const param = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': 'mlFnvtOvwXfzjeUnZ28GzNzG',
    'client_secret': 'VSH6Zkj9QrW101pIahCGjenfmri8G5LC'
  });
  var access_token;
 return new Promise((resolve,reject) => {
   let body =[];
  https.get(
    {
      hostname: 'aip.baidubce.com',
      path: '/oauth/2.0/token?' + param,
      agent: false
    },
    function (res) {
      // 在标准输出中查看运行结果
      //res.pipe(process.stdout);
      // console.log("23333     "+res)
      // console.log(res.access_token);
      // console.log(res);
      res.on('data',(chunk) => {
        body.push(chunk);
        
       
      }); 
      res.on('end', () =>{
        let data = Buffer.concat(body).toString();
        let getData = JSON.parse(data);
         access_token = getData.access_token;
        console.log(access_token);
        resolve(access_token);
      }); 

    }
  );
}).then(res =>{
  return access_token;
  
});
  
 
}




exports.main = (event, context) => {
 let datas = getAccessToken(); //调用异步函数，向baidu云API发起请求
  return datas;

}