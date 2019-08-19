// pages/noface/noface.js
const app = getApp()
const db = wx.cloud.database();
const innerAudioConext=wx.createInnerAudioContext();
var timer; //定时器
Page({
  //用于人脸对比
  /**
   * 页面的初始数据
   */
  data: {
    devicePosition: true,
    camera: false,
    cameraContext: {},
    tempImagePath: '',
    pictureID: '',
    getAccessToken: '', //获取百度的accesstoken
    judge_left_change_right_head_count: 0, //确定摇头的照片数
    judge_down_to_up_head_count: 0, //确定点头的照片数
    last_yaw: 0,
    last_pitch: 0,
    music_count:0

  },
  open: function() {
    this.setData({
      camera: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      camera: true,
      cameraContext: wx.createCameraContext(),
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
    this.face_recognition();
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
  close() {
    console.log("关闭相机");
    this.setData({
      camera: false
    })
  },
  camera() {
    let {
      cameraContext
    } = this.data;
    // 拍照
    // if (type == "takePhoto") {
    console.log("拍照");
    return new Promise((resolve, reject) => {
      cameraContext.takePhoto({
        quality: "high",
        success: (res) => {
          // console.log(res);
          this.setData({
            tempImagePath: res.tempImagePath,

          });

          console.log(this.data.tempImagePath);
          resolve();

        },
        fail: (e) => {
          console.log(e);
        }
      })
    })

  },
  every_camera_upload: function(acstoken) { //定时拍摄照片
    let that = this;
    timer = setTimeout(function() {
      that.camera().then(resx => {
        console.log("zzzzzzzzzzz  " + acstoken);
        that.uploadBaiDuPicture(acstoken).then(rx =>{
          that.judge_face(rx);
          //console.log("rx rxrxrx" + rx.data.error_code);
        });
        // if (that.data.judge_left_change_right_head_count <=5){
        //   that.judge_left_change_right_head();
        // }else {

        // }
        that.every_camera_upload(that.data.getAccessToken); //方法中调用定时器实现循环
      });
    }, 1500);
    //clearTimeout(timer); //清除上一次的定时器，否则会无限开多个

  },

  async face_recognition() { //人脸识别
    wx.showToast({
      title: '请将面部对准框内',
      icon: 'none',
      duration: 2000
    });
    innerAudioConext.src = "/music/putface.M4A"
    innerAudioConext.play();
    this.getAccessToken().then(res => {
      console.log(res);
      this.setData({
        getAccessToken: res
      })
      this.every_camera_upload(res);
      //  for (let i=0;i<1;i++){
      //  await new Promise((resolve,reject) =>{



      //  })

      // }
    });
  },
  getAccessToken: function() { //获取accesstoken
    var x = new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getBaiDuAccessToken',
        data: {},
        success: resy => {
          console.log(resy);
          console.log(resy.result);
          resolve(resy.result);
        },
        fail: resy => {
          wx.showToast({
            title: 'accesstoken报错',
            icon: 'none',
            duration: 2000
          });
        }
      });
    });
    return x;
  },

  uploadBaiDuPicture: function(restoken) { //上传百度云照片并解析
    console.log("asdas " + restoken);
    var base64 = wx.getFileSystemManager().readFileSync(this.data.tempImagePath, 'base64');
    let data = [{ //百度云的锅，在json格式外需要外加一个[]
      image: base64,
      // face_fields: 'qualities',
      image_type: 'BASE64'
    }];
    //console.log("   "+base64);
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://aip.baidubce.com/rest/2.0/face/v3/faceverify?access_token=' + restoken,
        data: data,
        // dataType: "json",
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        success(res) {
          console.log(res.data)
          console.log(res)
          resolve(res);
        }
      })
    });
  },
  judge_face: function(res) { //判断用户点头摇头动作
  let that = this;
    if (res.data.error_code == 0) {
      if (that.data.judge_left_change_right_head_count < 2) {
        that.judge_left_change_right_head(res); //判断用户摇头
      } else if(that.data.judge_down_to_up_head_count < 2){
        that.judge_down_to_up_head(res); //判断用户点头
      }else {
        wx.showLoading({
          title: '上传中',
        });
        innerAudioConext.src = "/music/upload.M4A"
        innerAudioConext.play();
        this.uploadUserPictureProve();
        clearTimeout(timer);



      }
    } else if (res.data.error_code == 222202) {
      wx.showToast({
        title: '未识别到脸部',
        icon: 'none',
        duration: 500
      });


    } else {
      wx.showToast({
        title: '未知错误',
        icon: 'none',
        duration: 500
      });
    }
  },
  judge_down_to_up_head: function(res) {
    if(this.data.music_count==1){
      innerAudioConext.src = "/music/headupdown.M4A"
      innerAudioConext.play();
      this.data.music_count++;

    }
    let pitch = res.data.result.face_list[0].angle.pitch;
    if ((pitch < 0 || pitch > 0) && (Math.abs(this.data.last_pitch - pitch) > 5.5)) {
      this.data.judge_down_to_up_head_count++;
      this.setData({
        last_pitch: pitch
      })
      //console.log("点头 " + this.data.judge_down_to_up_head_count)
    } else {
     // console.log("点头 " + this.data.judge_down_to_up_head_count)
     // console.log("点头ssssssssss " + Math.abs(this.data.last_pitch - pitch))
      wx.showToast({
        title: '未检测到点头',
        icon: 'none',
        duration: 1000
      });
    }


  },

  judge_left_change_right_head: function(res) {
    if (this.data.music_count == 0) {
      innerAudioConext.src = "/music/leftright.M4A"
      innerAudioConext.play();
      this.data.music_count++;

    }
    let yaw = parseInt(res.data.result.face_list[0].angle.yaw);
    if ((yaw < 0 || yaw > 0) && (Math.abs(this.data.last_yaw - yaw)>40)) {
      this.data.judge_left_change_right_head_count++;
      this.setData({
        last_yaw: yaw
      })
      console.log("摇头 " + this.data.judge_left_change_right_head_count)
    } else {
      console.log("yaoyaoyoa  " + parseInt(this.data.last_yaw - yaw));
      console.log("yaoyaoyoa  " + typeof (res.data.result.face_list[0].angle.yaw));
      wx.showToast({
        title: '未检测到摇头',
        icon: 'none',
        duration: 1000
      });
    }
  },
  devicePosition() {
    this.setData({
      devicePosition: !this.data.devicePosition,
    })
    console.log("当前相机摄像头为:", this.data.devicePosition ? "后置" : "前置");
  },
  uploadUserPictureProve() {
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
          if (that.data.tempImagePath != '') {
            return new Promise((resolve, reject) => {
              wx.cloud.uploadFile({
                cloudPath: 'takeoutuserpictureprove/' + nowTimeName + '.jpg', // 上传至云端的路径
                filePath: that.data.tempImagePath, // 小程序临时文件路径
                success: resx => {
                  // 返回文件 ID
                  console.log(resx);
                  that.setData({
                    pictureID: resx.fileID
                  });
                  wx.cloud.callFunction({
                    name: 'judgeUserPicture',
                    data: {
                      url1: app.globalData.imageStudentProvePath,
                      fileID2: resx.fileID
                    },
                    success: resy => {
                      // console.log(resy.result);
                      resolve(resy.result);
                    },
                    fail: resy => {
                      console.log(resy);
                      wx.hideLoading();
                      setTimeout(function() {
                        wx.showToast({
                          title: '图片错误',
                          image: '/images/x.png'
                        });
                      }, 500);
                      wx.cloud.deleteFile({
                        fileList: [that.data.pictureID],
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
            }).then(resz => {
              // console.log(resz['Score']);
              //console.log(typeof(resz));
              wx.hideLoading();
              if (resz) { //如果有值传出，则判断分数是不是有60，若有则判断是人，则跳转。
                // let f = resz.indexOf('Score":');
                // let e = resz.indexOf(',"RequestId');

                let score = parseInt((resz['Score']));
                // console.log(score);
                if (score > 50) {
                  console.log(score);

                  let allPages = getCurrentPages();
                  let prevAllPage = allPages[allPages.length - 2];
                  prevAllPage.setData({
                    faceProved: true,
                  });
                new Promise((resolve,reject) =>{
                  wx.cloud.deleteFile({
                    fileList: [that.data.pictureID],
                    success: res => {
                      innerAudioConext.src = "/music/success.M4A"
                      innerAudioConext.play();
                      resolve();

                    },
                    fail: err => {
                      wx.showToast({
                        title: '删除失败',
                        image: '/images/x.png'
                      });

                    }
                  });
                }).then(res =>{
                  wx.navigateBack({
                    url: '../detail/detail',
                  });
                })
              
                } else if (score <= 50) {
                  wx.showToast({
                    title: '照片不符',
                    image: '/images/!.png'
                  });
                  wx.cloud.deleteFile({
                    fileList: [that.data.pictureID],
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
                  fileList: [that.data.pictureID],
                  success: res => {

                  },
                  fail: err => {

                  }
                })
              }




            })


          }

     
      
    
  }



})