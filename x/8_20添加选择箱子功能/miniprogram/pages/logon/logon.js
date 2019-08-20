// pages/logon/logon.js
const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: 0,
    userPwd: '',
    studentID: '',
    nameXY: '',
    tempImagePictureFileID: '' //合格的人脸照片的云储存fileID
  },

  //获取用户输入的用户名
  number: function(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  password: function(e) {
    this.setData({
      userPwd: e.detail.value
    })
  },
  //登录验证
  //向网址发送请求，网址返回string html代码，并解析
  httpLaunch: function() {
    var first;
    var end;
    var that = this;
    let newdata = {
      user_number: that.data.userName,
      password: that.data.userPwd,
    }
    if (newdata.user_number == "" && newdata.password.length == "") {
      wx.showToast({
        title: '学号密码为空',
        image: '/images/x.png'
      })
    } else if (newdata.password.length == "" && newdata.user_number.length != "") {
      wx.showToast({
        title: '密码不能为空',
        image: '/images/x.png'
      })

    } else if (newdata.password.length != "" && newdata.user_number.length == "") {
      wx.showToast({
        title: '学号不能为空',
        image: '/images/x.png'
      })

    } else {
      wx.showLoading({
        title: '认证中',
      });
      wx.request({
        url: 'https://www.swxhx.xyz/swxhx/servlet/ulogin',
        data: newdata,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },

        method: 'GET',
        success: res => {
          console.log(res.data.name);
          console.log(res.data.number);
          console.log(res);
          console.log(res.data.url);
          if(res.data.code == 200){

          
                  var pages = getCurrentPages(); //从页面路由栈中直接获取和操作目标Page对象
                 var name = res.data.name + "(" + res.data.number+")";
                  that.setData({
                    nameXY: name,
                    tempImagePictureFileID: res.data.url
                  })
                  var prevPage = pages[pages.length - 2];
                  prevPage.setData({
                    studentShowID: name,
                  });

        
            
            console.log("照片云地址是" + that.data.tempImagePictureFileID);
            that.httpLaunchNext();
        
        }else {
          wx.hideLoading();
            wx.showToast({
              title: '学号密码错误',
              image: '/images/x.png'
            })
        }
        }
      })
    }
  },

  httpLaunchNext: function() {
    let that = this;
    console.log(app.globalData.openId);
    //console.log(typeof (app.globalData.openId));
    return new Promise((resolve, reject) => { //异步变同步，导致值不会变
      db.collection('studentID').where({
        _openid: app.globalData.openId
      }).get({
        success: res => {
          var sid = res.data[0]._id; //获取数据库项的id
          resolve(sid);
        }
      })
    }).then(res => {


      db.collection('studentID').doc(res).update({
        // data 传入需要局部更新的数据
        data: {
          studentNO: that.data.nameXY,
          imagePath: that.data.tempImagePictureFileID
        },


        success: res => {
          app.globalData.studentProve = true;
          app.globalData.studentCard = that.data.nameXY;
          app.globalData.imageStudentProvePath = that.data.tempImagePictureFileID;
          that.setData({
            tempImagePictureFileID: '',
          });
          setTimeout(function() {
            wx.hideLoading();
            wx.showToast({
              title: '认证成功',
              duration: 2000,
              image: '/images/v.png',
              success: function() {
                setTimeout(function() {
                 
                  wx.navigateBack({
                    url: '../myself/myself',
                  })
                }, 2000);
              }
            });

          }, 500)

        }
      })

    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  }
})