//   /**
//  * 将本地资源上传到开发者服务器，客户端发起一个 HTTPS POST 请求
//  * @param {string} url 开发者服务器 url
//  * @param {string} filePath 要上传文件资源的路径
//  * @param {string} name 
//  * @param {object} formData HTTP 请求中其他额外的 form data
//  */
//   static uploadFile(url, filePath, name, formData = { openid: "test" }) {
//   return new Promise((resolve, reject) => {
//     let opts = { url, filePath, name, formData, header: { 'Content-Type': "multipart/form-data" }, success: resolve, fail: reject };
//     wx.uploadFile(opts);
//   });
// }
