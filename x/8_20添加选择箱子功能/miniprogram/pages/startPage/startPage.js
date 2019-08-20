// miniprogram/pages/startPage/startPage.js
const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    prove:false,
  },
  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              // this.getOpenid();
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (app.userInfoReadyCallback) {
                app.userInfoReadyCallback(res)
              }
              wx.switchTab({
                url: '/pages/home/home'
              });
            }
          });
        }else {
          that.setData({
            prove:true,
          })


        }
        
        ;}});
    
  //   db.collection('studentID').where({
  //     _openid: app.globalData.openId
  //   }).get({
  //     success:res=>{
  //       let count=res.data[0].loginCount;
  //       if(count!=0){
  //         wx.switchTab({
  //           url: '/pages/home/home'
  //         })
  //       }
  //     }
    
  // });
},
  userLogin: function (e) {
    if (e.detail.userInfo) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
      //  if (res.authSetting['scope.userInfo']) {//用户同意授权
          // wx.authorize({
          //   scope: 'scope.userInfo',
          //   success() {
          //     app.globalData.userInfo = res.userInfo
          //     console.log(res.userInfo);
          //     if (app.userInfoReadyCallback) {
          //       app.userInfoReadyCallback(res)
          //     }

              wx.switchTab({
                url: '/pages/home/home'
              })


          //   }
          // })
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
       // }
      //  else if (!res.authSetting['scope.userInfo']) {
          //未授权获取授权
     
      //  }

      }
    });

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }}
  ,
  // setCompare:function(){
  //   return new Promise((resolve, reject) => {//异步变同步，导致值不会变
  //     db.collection('studentID').where({
  //       _openid: app.globalData.openId
  //     }).get({
  //       success: res => {
  //         var sid = res.data[0]._id;//获取数据库项的id
  //         resolve(sid);
  //       }
  //     })
  //   }).then(res => {
  //     console.log(res.data);


  //     db.collection('studentID').doc(res).update({
  //       // data 传入需要局部更新的数据
  //       data: {
  //         loginCount: "1",
  //       },


  //       success(res) { 
  //         wx.switchTab({
  //           url: '/pages/home/home'
  //         })
  //       }
  //     })})}
  
  
})