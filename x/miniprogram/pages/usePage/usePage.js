// pages/myself/usePage/usePage.js
var app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ssopen:'',
    userdatacount:1,
    inforx:[],
    show:false,
    view_hidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    this.getOpen().then(
      db.collection('describe').where({
        _openid:app.globalData.openId
      }).orderBy("time", "desc").limit(7)
        .get({
          success: res => {
            that.setData({
              inforx: res.data
            });
            //console.log(res.data);
            //console.log(app.globalData.openId);
          }
        })
  ); 
 
  
    console.log(this.data.ssopen);},

getOpen:function(){
  
  return new Promise((resolve, reject) => {
    var arr = getCurrentPages();
    var sid = arr[arr.length - 2].data.studentShowID;
    db.collection('studentID').where({
      studentNO: sid,
    }).get({
      success: res => {
        // this.data.ssopen = res.data[0]._openid;
        this.data.ssopen = '"' + res.data[0]._openid + '"';
      }
    }
    )
    
    resolve();
   
})},
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
  bigger: function (e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var array = new Array(); //定义数组
    array[0] = src;
    wx.previewImage({
      current: src,
      urls: array[0]
    })
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
    console.log("刷新");

    wx.setNavigationBarTitle({
      title: '刷新中……'
    })//动态设置当前页面的标题。

    wx.showNavigationBarLoading();//在当前页面显示导航条加载动画。
    // wx.startPullDownRefresh();
    //this.loadProduct2();//重新加载产品信息
    setTimeout(function () {
      wx.redirectTo({
        url: '../usePage/usePage',
      })
      wx.stopPullDownRefresh();
    }, 2000);},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.onUserLoadingMorex();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  detail: function (e) {
      var time = e.currentTarget.dataset.src; //获取data-src
      // console.log(title)
      wx.navigateTo({
        url: "../detail/detail?time=" + time, //页面传值
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    
  },
  onUserLoadingMorex: function () {
    this.setData({
      show: true,
      view_hidden:true
    })
    
      this.loadingUserChangex();
    
    
  },
  loadingUserChangex: function () {
    db.collection('describe').where({
      _openid: app.globalData.openId
    }).orderBy("time", "desc").skip(7 * this.data.userdatacount).limit(7)
      .get({
        //如果查询成功的话
        success: res => {
          console.log(res.data)
          //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值
          if(JSON.stringify(res.data) == "[]"){
            this.setData({
              show:false,
              view_hidden:false
            })

          }else{
            var x = [];
            x = this.data.inforx.concat(res.data)
            this.setData({
              inforx: x,
              show: false
            })
          }
        
        }
      });
    this.data.userdatacount += 1;


  }  
})