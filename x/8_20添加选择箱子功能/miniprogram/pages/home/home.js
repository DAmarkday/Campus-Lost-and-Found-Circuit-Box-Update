// pages/home/home.js
var app = getApp();
const db = wx.cloud.database();
var idArray = new Array();
var idArray1 = new Array();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../../images/slider1.jpg',
      // '../../images/slider2.jpg',
      // '../../images/slider3.png',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 500,
    infor: [],
    inputvalue: '', //搜索框里的获取内容的容器
    showview: true, //判断是否显示view
    show: true,
    scrollTop: 0,
    scrollHeight: 0,
    datacount:1,
    view_hidden:true,
    input_string:''

  },
  /*
    放大浏览图片
  */
  bigger: function(e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var array = new Array(); //定义数组
    array[0] = src;
    wx.previewImage({
      current: src,
      urls: array[0]
    })
  },
  // 搜索
  search:function(){
    if (app.globalData.studentProve == false || app.globalData.studentProve == null) {
      console.log(app.globalData.studentProve);
      wx.showToast({
        title: '请认证学号',
        duration: 2000,
        image: '/images/!.png',
        success: function () {
          setTimeout(function () {
          }, 2000);
        }
      });
    } else {
    wx.navigateTo({
      url: '../search/search',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    var that = this;

    // that.onLoad;
    // wx.showLoading({
    //   title: '加载中',
    // })

    // setTimeout(function() {
    //   wx.hideLoading()
    // }, 2500);
    //1、引用数据库
    // const db = wx.cloud.database({
    //   //这个是环境ID不是环境名称
    //   env: 'oieJN5S3bAMaJHJtHcs1dMFvY0qs'
    // })
    //2、开始查询数据了  news对应的是集合的名称
    //时间倒叙
    db.collection('describe').orderBy("time","desc").limit(7)
    .get({
      //如果查询成功的话
      success: res => {
        //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值
        that.setData({
          infor: res.data
        })
        //console.log(res.data);
      }
    })
  },
  detail:function(e){
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
    } else{
    var time = e.currentTarget.dataset.src; //获取data-src
  // console.log(title)
    wx.navigateTo({
      url: "../detail/detail?time=" + time, //页面传值
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    }
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
    this.setData({
      input_string:'',

    })
    //this.onLoad()
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
    this.onLoadingMore();
    this.setData({
      show:true,
      view_hidden:true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  refresh: function (event) {
    //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    wx.startPullDownRefresh();
  },
  
  onPullDownRefresh: function () {
    console.log("刷新");

    wx.setNavigationBarTitle({
      title: '刷新中……'
    })//动态设置当前页面的标题。

    wx.showNavigationBarLoading();//在当前页面显示导航条加载动画。
   // wx.startPullDownRefresh();
    //this.loadProduct2();//重新加载产品信息
      setTimeout(function() {
        wx.reLaunch({
          url: '../home/home',
        })
        wx.stopPullDownRefresh();
     }, 2000);
    
   // wx.hideNavigationBarLoading();//隐藏导航条加载动画。

    //停止当前页面下拉刷新。

    console.log("关闭");

  },
  onLoadingMore:function(){
    this.setData({
      hidden:false
    })
    this.loadingChange();
     
  },
  loadingChange:function(){
    db.collection('describe').orderBy("time", "desc").skip(7*this.data.datacount).limit(7)
      .get({
        //如果查询成功的话
        success: res => {
          console.log(res.data);
          console.log(typeof (res.data));
          let y = (JSON.stringify(res.data) == "[]");
          console.log("y wei "+y);
          if(y==true){//说明没有值可以取了
                this.setData({
                  show:false,
                  view_hidden:false
                })
          }else{

          
          //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值
          var x=[];
           x = this.data.infor.concat(res.data)
          this.setData({
            infor: x,
            show:false
            })
          }
        }
      });
    this.data.datacount+=1;
    

  }  
})