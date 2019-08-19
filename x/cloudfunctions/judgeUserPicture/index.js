const cloud = require('wx-server-sdk')// 云函数入口文件
const tencentcloud = require("tencentcloud-sdk-nodejs"); //腾讯云API 3.0 SDK

cloud.init() // 云开发初始化

var synDetectFace = function (url1,url2) { //调用人脸识别API函数
  const IaiClient = tencentcloud.iai.v20180301.Client;
  const models = tencentcloud.iai.v20180301.Models;

  const Credential = tencentcloud.common.Credential;
  const ClientProfile = tencentcloud.common.ClientProfile;
  const HttpProfile = tencentcloud.common.HttpProfile;

  let f = url1.indexOf("upload/");
  let e = url1.indexOf(".jpg");
  let s = url1.substring(f + 7, e);
  var w = "https://www.swxhx.xyz/swxhx/upload/" + encodeURI(s) + ".jpg";

  let cred = new Credential("AKIDnOPAj4ACTUFm2oadgSyGMGExToulAehd", "rWv5yhbATacQErFj0kLCoBKH2YZN1Row");
  let httpProfile = new HttpProfile();
  httpProfile.endpoint = "iai.tencentcloudapi.com";
  let clientProfile = new ClientProfile();
  clientProfile.httpProfile = httpProfile;
  let client = new IaiClient(cred, "", clientProfile);

  let req = new models.CompareFaceRequest();
  let params = '{"UrlA":"' + w + '","UrlB":"'+url2+'"}'
  req.from_json_string(params);

  return new Promise(function (resolve, reject) { //构造异步函数
    client.CompareFace(req, function (errMsg, response) {
      if (errMsg) {
        reject(errMsg)
      } else {
        resolve(response);
      }
    })
  })

  // client.CompareFace(req, function (errMsg, response) {
  //   if (errMsg) {
  //     console.log(errMsg);
  //     return;
  //   }
  //   console.log(response.to_json_string());
  // });

}
// const url = "https://7067-pg-fe78f3-1258245399.tcb.qcloud.la/1561017371617.png?sign=bdfcebc121049d8696a6218c444aab5d&t=1561111127"
// synDetectFace(url)
// 云函数入口函数
exports.main = async (event, context) => {
  
  const data = event
 // let fileID = event.fileID2;
  const fileList = [data.fileID2]; //读取来自客户端的fileID
  const result = await cloud.getTempFileURL({
    fileList, //向云存储发起读取文件临时地址请求
  })
  
  //const url1 = result.fileList[0].tempFileURL;//原数据库的自拍
  const url2 = result.fileList[0].tempFileURL;//用户新拍的自拍
console.log(result);
  console.log("  xxxxx   "+url2);
  console.log("22222222");
  let url1 = data.url1;
  datas = await synDetectFace(url1,url2) //调用异步函数，向腾讯云API发起请求
  return datas
}
