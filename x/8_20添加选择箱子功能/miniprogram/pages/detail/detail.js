// pages/detail/detail.js
var app = getApp();
const db = wx.cloud.database();
import mqtt from '../../utils/mqtt.js';

//连接的服务器域名，注意格式！！！
const host = 'wxs://cheni.top/mqtt';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    client: null,
    //记录重连的次数
    reconnectCounts: 0,
    //MQTT连接的配置
    options: {
      protocolVersion: 4, //MQTT连接协议版本
      clientId: 'pg',
      clean: false,
      password: 'cgF8Z2CJtp2D7q3m',
      username: 'ddndzbe/user_wechat',
      reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
      connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
      resubscribe: true, //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
    },
    infor: [],
    time:'',
    faceProved:false,//判断人脸对比是否是一个人
    endendsize: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = options.time;
    var that = this;
   // this.doConnect();
    console.log(time);
    var that = this;
    //开始连接
    this.data.client = mqtt.connect(host, this.data.options);
    this.data.client.on('connect', function (connack) {
    });
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 2500);
    //2、开始查询数据了  news对应的是集合的名称
    db.collection('describe').where({
      time : time
    })
    .get({
      //如果查询成功的话
      success: res => {
        //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值
        that.setData({
          infor: res.data
        })
      }
    })
  },
  // 放大图片
  bigger: function (e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var array = []; //定义数组
    array[0] = src;
    console.log(src);
    wx.previewImage({
      current: src,
      urls: array[0]
    })
  },
  intentFace: function () {
    wx.navigateTo({
      url: "../noface/noface", //跳转人脸识别
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  
  take_out:function(){
//人脸识别
 let that =this;
  wx.showModal({
    title: '提示',
    content: '请完成人脸认证',
    success:function(option){
      if (option.confirm){
        that.intentFace();//跳转拍照进行人脸验证
      } else if (option.cancel){//取消
        wx.showToast({
          title: '取出失败',
          image: '/images/x.png'
        })


      }
    }
  })
  },

  take_out_next_prove_face(){//硬件上的取出

    if (this.data.client && this.data.client.connected) {
      //仅订阅单个主题
      this.data.client.subscribe('sensor/open', function (err, granted) {
    
      })
    } else {
      setTimeout(function () {
      wx.showToast({
        title: '请先连接服务器',
        image: '/images/!.png',
        duration: 2000
        })
      }, 500)
    };
    if (this.data.client && this.data.client.connected) {//发布成功和订阅成功是同时运行，导致显示同时，体验不流畅
      this.data.client.publish('sensor/open', this.data.infor[0].endendsize);//根据尺寸开箱
    };
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  // 删除数据
  deleteback() {
    console.log('你成功进入数据库');
    db.collection('describe').doc(this.data.infor[0]._id).remove({
      success: function (res) {
        console.log('成功进入数据库2');
        wx.navigateBack({
          url: '../home/home',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },


  onShow: function () {
    // let that =this;
    var that = this;
    if(this.data.faceProved==true){
      // console.log('成功进入');
      // wx.showLoading({
      //   title: '连接箱子中...',
      //   mask: true,
      //   success: function(res) {},
      //   fail: function(res) {},
      //   complete: function(res) {},
      // })
      // setTimeout(function(){
      //   wx.hideLoading();
      //   that.take_out_next_prove_face();
      // },1000);

      that.deleteback();

    }    
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