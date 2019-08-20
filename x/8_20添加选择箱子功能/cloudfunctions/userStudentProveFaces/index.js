const cloud = require('wx-server-sdk') //小程序云开发SDK
const tencentcloud = require("tencentcloud-sdk-nodejs"); //腾讯云API 3.0 SDK
cloud.init() //云开发初始化
var synDetectFace = function (url) { //人脸识别API
  const IaiClient = tencentcloud.iai.v20180301.Client; //API版本
  const models = tencentcloud.iai.v20180301.Models; //API版本

  const Credential = tencentcloud.common.Credential;
  const ClientProfile = tencentcloud.common.ClientProfile;
  const HttpProfile = tencentcloud.common.HttpProfile;
  let cred = new Credential("AKIDnOPAj4ACTUFm2oadgSyGMGExToulAehd", "rWv5yhbATacQErFj0kLCoBKH2YZN1Row"); //腾讯云的SecretId和SecretKey
  let httpProfile = new HttpProfile();
  httpProfile.endpoint = "iai.tencentcloudapi.com"; //腾讯云人脸识别API接口
  let clientProfile = new ClientProfile();
  clientProfile.httpProfile = httpProfile;
  let client = new IaiClient(cred, "", clientProfile); //调用就近地域

  let req = new models.DetectFaceRequest();
  let params = '{"Url":"' + url + '"}' //拼接参数
  req.from_json_string(params);
  return new Promise(function (resolve, reject) { //构造异步函数
    client.DetectLiveFace(req, function (errMsg, response) {

      if (errMsg) {
        console.log(errMsg);
        reject(errMsg);
      }else{
        resolve(response.to_json_string());
      }

      console.log(response.to_json_string());
    });
  })
}


exports.main = async (event, context) => {
  const data = event;
  const fileList = [data.fileID] //读取来自客户端的fileID
  const result = await cloud.getTempFileURL({
    fileList, //向云存储发起读取文件临时地址请求
  })
  const url = result.fileList[0].tempFileURL
  datas = await synDetectFace(url) //调用异步函数，向腾讯云API发起请求
  return datas;
}