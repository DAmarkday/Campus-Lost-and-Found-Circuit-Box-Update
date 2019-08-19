// pages/share/share.js
const db = wx.cloud.database()
var util = require('../../utils.js');
var app = getApp()
import mqtt from '../../utils/mqtt.js';
//连接的服务器域名，注意格式！！！
const host = 'wxs://cheni.top/mqtt';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '', //正文内容
    count:0,
    imgUrl: '',
    time:'',
    title:'',
    nickName: '',
    avatarUrl: '',
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
    out: 0,
    items: [
      { name: '1', value: '小', checked: 'true' },
      { name: '2', value: '中' },
      { name: '3', value: '大' },
    ],
    size: '1',    //箱子型号
  },
  talks: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  titleis:function(e){
    this.setData({
      title: e.detail.value
    })
  },

  //箱子的型号
  radioChange: function (e) {
    console.log(e.detail.value)

    this.setData({
      size: e.detail.value
    })
    console.log(this.data.size)
  },
  //添加内容
  onAdd: function () {
    var that = this;
    var out = that.data.out;
    out = 0;
    if (app.globalData.studentProve == false || app.globalData.studentProve == null) {
      wx.showToast({
        title: '暂未认证学号',
        duration: 2000,
        image: '/images/!.png',
        success: function () {
          setTimeout(function () {
          }, 2000);
        }
      });
    } else {
    var data = {
      title: that.data.title,//标题
      description: that.data.content,//描述
      image: new Array(app.globalData.fileID),//图片
      //id: Number(that.data.count) + 1,//计数
      time: util.formatTime(new Date()),//时间
      userReceiveName: this.data.nickName,//用户id
      userReceiverHeadPicture: this.data.avatarUrl,//用户头像
      size: that.data.size     //箱子的尺寸
    }
    //描述、标题、照片不能为空
      if (!data.title) {
        wx.showToast({
          title: '请填写标题',
          icon: 'none',
          image: '/images/!.png'
        })
      } else if (!data.description) {
        wx.showToast({
          title: '请填写描述',
          icon: 'none',
          image: '/images/!.png'
        })
       }
       else if (data.image[0]==null) {
         wx.showToast({
           title: '请添加图片',
           icon: 'none',
           image: '/images/!.png'
         })
       }
      else if (data.description && data.image[0]!=null && data.title){
        //用于打开箱子
        //仅订阅单个主题
        this.data.client.subscribe('sensor/open', function (err, granted) {
        })
        this.data.client.publish('sensor/open', that.data.size);

        //如果箱子未开，则从新点击
        wx.showModal({
      
          title: '提示',
          content: '如果箱子未打开，请点击重开按钮',
          confirmText:'重开',
          cancelText:'完成',
          success(res) {
            if (res.confirm) {
              // that.data.client.subscribe('sensor/open', function (err, granted) {
              // })
              // that.data.client.publish('sensor/open', that.data.size);
              db.collection('describe').add({
                data: data,
                success(res) {
                  // 在返回结果中会包含新创建的记录的 _id
                  wx.showToast({
                    title: '发布成功',
                    image: '/images/v.png'
                  });
                  //刷新页面跳转
                  wx.reLaunch({
                    url: '../home/home',
                  });

                },
                fail: err => {
                  wx.showToast({
                    image: '/images/x.png',
                    title: '发布失败'
                  })
                  console.error('[数据库] [新增记录] 失败：', err)
                }
              })

            } else if (res.cancel) {
              db.collection('describe').add({
                data: data,
                success(res) {
                  // 在返回结果中会包含新创建的记录的 _id
                  wx.showToast({
                    title: '发布成功',
                    image: '/images/v.png'
                  });
                  //刷新页面跳转
                  wx.reLaunch({
                    url: '../home/home',
                  });

                },
                fail: err => {
                  wx.showToast({
                    image: '/images/x.png',
                    title: '发布失败'
                  })
                  console.error('[数据库] [新增记录] 失败：', err)
                }
              })
          
            }
          }
        })



    //   db.collection('describe').add({
    //   data: data,
    //   success(res) {
    //     // 在返回结果中会包含新创建的记录的 _id
    //     wx.showToast({
    //       title: '发布成功',
    //       image: '/images/v.png'
    //     });
    //     //刷新页面跳转
    //     wx.reLaunch({
    //       url: '../home/home',
    //     });

    //   },
    //   fail: err => {
    //     wx.showToast({
    //       image: '/images/x.png',
    //       title: '发布失败'
    //     })
    //     console.error('[数据库] [新增记录] 失败：', err)
    //   }
    // })

        app.globalData.fileID = null;
        app.globalData.cloudPath = null;
        app.globalData.imagePath = null;
        } 
    }
  },


  // 上传图片
  doUpload: function () {
    // 选择图片
    var that = this;
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
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',

        })
        const filePath = res.tempFilePaths[0]
        that.setData({
          imgUrl: filePath
        })
        // 上传图片
        const cloudPath = nowTimeName+ filePath.match(/\.[^.]+?$/)[0]
        //改写: 数组 多图片
        // const filePath = res.tempFilePaths, cloudPath = [];
        // filePath.forEach((item, i)=>{
        //   cloudPath.push(that.data.count + '_' + i + filePath[i].match(/\.[^.]+?$/)[0])
        // })

        console.log(cloudPath)


        // filePath.forEach((item, i) => {
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', cloudPath, res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              image: '/images/x.png',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
        // })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCount()
    wx.getUserInfo({
      success: res => {
        const userInfo = res.userInfo
        this.data.nickName = userInfo.nickName
        this.data.avatarUrl = userInfo.avatarUrl;
        console.log(this.data.avatarUrl)
      }
    })
    //开始连接
    this.data.client = mqtt.connect(host, this.data.options);
    this.data.client.on('connect', function (connack) {
      console.log('连接成功')
    });

  },
  //获取记录总数
  getCount: function () {
    var that = this
    db.collection('describe').count({
      success: res => {
        that.setData({
          count: Number(res.total) + 1
        })
      }
    })

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