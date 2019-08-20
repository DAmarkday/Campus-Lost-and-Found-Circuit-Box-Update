// pages/logon_user_picture/logon_user_picture.js
//用户学生认证时上传的自拍
// 
//       该页面可删除
Page({

  /**
   * 页面的初始数据
   */
  data: {
    devicePosition1: true,
    camera1: false,
    cameraContext1: {},
    tempImagePicturePath: '',
    fileIDC: ''

  },
  open1: function() {
    this.setData({
      camera1: true,
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      camera1: true,
      cameraContext1: wx.createCameraContext(),
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 关闭模拟的相机界面
  close1() {
    console.log("关闭相机");
    this.setData({
      camera1: false
    })
  },
  camera1() {
    let {
      cameraContext1
    } = this.data;
    // 拍照
    // if (type == "takePhoto") {
    console.log("拍照");
    cameraContext1.takePhoto({
      quality: "high",
      success: (res) => {
        // console.log(res);
        this.setData({
          tempImagePicturePath: res.tempImagePath,
          camera1: false,
        });
        // wechat.uploadFile("https://xx.xxxxxx.cn/api/upload", res.tempImagePath, "upload")
        //   .then(d => {
        //     console.log(d);
        //   })
        //   .catch(e => {
        //     console.log(e);
        //   })
      },
      fail: (e) => {
        console.log(e);
      }
    })
  },

  getPictureFilePath() { //获取文件本地路径后转给上一层页面,作用是上传学生认证照片到云服务端
    let that = this;
    let allPages = getCurrentPages();
    let prevAllPage = allPages[allPages.length - 2];
    prevAllPage.setData({
      tempImagePictureFileID: that.data.fileIDC,
    });
    wx.navigateBack({
      url: '../logon/logon',
    });



  },
  devicePosition1() {
    this.setData({
      devicePosition1: !this.data.devicePosition1,
    })
    console.log("当前相机摄像头为:", this.data.devicePosition1 ? "后置" : "前置");
  },


  uploadUserPicture() {
    wx.showModal({
      title: '提示',
      content: '是否确认上传',
      success: x => {
        if (x.confirm) {
          console.log('用户点击确定');

          wx.showLoading({
            title: '上传中',
          });
          // console.log('上传');
          let timestamp = Date.parse(new Date());
          //获取当前时间  
          let n = timestamp;
          let date = new Date(n);
          //年  
          let Y = date.getFullYear();
          //月  
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
          //日  
          let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
          //时  
          let h = date.getHours();
          //分  
          let m = date.getMinutes();
          //秒  
          let s = date.getSeconds();

          let nowTimeName = Y + M + D + "_" + h + "_" + m + "_" + s; //获取当前时间来命名

          let that = this; //上传用户照片到未认证的表里接受认证
          //  console.log(that.data.tempImagePicturePath);
          if (that.data.tempImagePicturePath != '') {
            return new Promise((resolve, reject) => {
              wx.cloud.uploadFile({
                cloudPath: 'judgepersonface/' + nowTimeName + '.jpg', // 上传至云端的路径
                filePath: that.data.tempImagePicturePath, // 小程序临时文件路径
                success: resx => {
                  // 返回文件 ID
                  console.log(resx.fileID);
                  that.setData({
                    fileIDC: resx.fileID
                  });
                  wx.cloud.callFunction({
                    name: 'userStudentProveFaces',
                    data: {
                      fileID: resx.fileID
                    },
                    success: resy => {

                      // console.log(resy.result);
                     // console.log("类型是8877"+typeof(resy.result));
                     // console.log(resy);
                      //console.log("类型是"+typeof(resy));
                      resolve(resy.result);
                    },
                    fail: resy => {
                      wx.hideLoading();
                      setTimeout(function() {
                        wx.showToast({
                          title: '图片错误',
                          image: '/images/x.png'
                        });
                      }, 500);
                      wx.cloud.deleteFile({
                        fileList: [that.data.fileIDC],
                        success: res => {},
                        fail: err => {}
                      })
                    }
                  });


                },
                fail: resx => {
                  console.error;
                  wx.hideLoading();
                  setTimeout(function() {
                    wx.showToast({
                      title: '上传失败',
                      image: '/images/x.png'
                    });
                  }, 500);

                }
              })
              //console.log(99999999999)
            }).then(resz => {
              //console.log(6666666666)
               console.log(resz); //成功将值传出来

              wx.hideLoading();
              if (resz) { //如果有值传出，则判断分数是不是有60，若有则判断是人，则跳转。
                let f = resz.indexOf('Score":');
                let e = resz.indexOf(',"RequestId');
                let score = parseInt(resz.substring(f + 7, e));
                // console.log(score);
                if (score > 50) {
                  console.log(score);
                  that.getPictureFilePath();
                } else if (score <= 50) {
                  wx.showToast({
                    title: '请正脸拍照',
                    image: '/images/!.png'
                  });
                  wx.cloud.deleteFile({
                    fileList: [that.data.fileIDC],
                    success: res => {},
                    fail: err => {}
                  })
                }
              } else {
                wx.showToast({
                  title: '照片错误',
                  image: '/images/x.png'
                });
                wx.cloud.deleteFile({
                  fileList: [that.data.fileIDC],
                  success: res => {

                  },
                  fail: err => {

                  }
                })
              }




            })


          }

        } else if (x.cancel) {
          //点击取消上传
        }
      }
    });
  }




})