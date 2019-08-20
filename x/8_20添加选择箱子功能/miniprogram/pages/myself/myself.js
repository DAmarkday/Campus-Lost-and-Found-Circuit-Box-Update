// pages/myself/myself.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentShowID: '未绑定学号',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //账号注销，但是由于软件是自动登陆，先搁置
  // loginoutClick: function () {
  //   userInfo: null;
  //   wx.redirectTo({
  //     url: 'login',
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //在studentID数据库中查找openid
    if (app.globalData.studentCard != null) {
      this.setData({
        studentShowID: app.globalData.studentCard,
        
      })
    }
  },

  studentprove:function(){
    let prove = app.globalData.studentProve; //将app.js的变量赋值给prove参与判断，如果prove为true，则表示已经认证过
    if (prove == true) {
      wx.showToast({
        title: '您已认证',
        duration: 2000,
        image: '/images/v.png',
        success: function () {
          setTimeout(function () { }, 2000);
        }

      });

    } else {
      wx.navigateTo({
        url: '../logon/logon'
      })
    }
  },

  usePageBtn: function () {
    if (app.globalData.studentProve == false || app.globalData.studentProve == null) {
      wx.showToast({
        title: '请认证学号',
        duration: 2000,
        image: '/images/!.png',
        success: function () {
          setTimeout(function () {
          }, 2000);
        }
      });
    }else{
    wx.navigateTo({
      url: '../usePage/usePage'
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})