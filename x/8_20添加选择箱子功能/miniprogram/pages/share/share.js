// pages/share/share.js
const db = wx.cloud.database()
var util = require('../../utils.js');
var app = getApp()
import mqtt from '../../utils/mqtt.js';
//连接的服务器域名，注意格式！！！
const host = 'wxs://cheni.top/mqtt';
var originbox = "bisque";
//初始化箱子数组
var box = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total:null,  //表记录条数
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

    size: '1',    //箱子型号
    show1: true,
    single: false,
    endsize: null, //临时选择的箱子
    endendsize: null,//最终选择的箱子
    red1: originbox,
    start: 1,   //记录上一个选择
    end: 1,   //当前选择
    red2: originbox,
    red3: originbox,
    red4: originbox,
    red5: originbox,
    red6: originbox,
    red7: originbox,
    red8: originbox,
    red9: originbox,
    red10: originbox,
    red11: originbox,
    red12: originbox,
    red13: originbox,
    red14: originbox,
    red15: originbox,
    red16: originbox,
    red17: originbox,
    red18: originbox,
    red19: originbox,
    red20: originbox,
    red21: originbox,
    red22: originbox,
    red23: originbox,
    red24: originbox,
    red25: originbox,
    infor:[],
    infor1:[],
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
  // radioChange: function (e) {
  //   console.log(e.detail.value)

  //   this.setData({
  //     size: e.detail.value
  //   })
  //   console.log(this.data.size)
  // },
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
      endendsize: that.data.endendsize     //箱子的尺寸
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
       else if(data.endendsize==null){
        wx.showToast({
          title: '请选择存放箱位置',
          icon: 'none',
          image: '/images/!.png'
        })
       }
      else if (data.description && data.image[0] != null && data.title && data.endendsize != null){
        //用于打开箱子
        //仅订阅单个主题
        this.data.client.subscribe('sensor/open', function (err, granted) {
        })
        this.data.client.publish('sensor/open', that.data.endendsize);

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
                  // wx.reLaunch({
                  //   url: '../home/home',
                  // });


                  //页面重定向该页面出栈，新页面栈
                  wx.redirectTo({
                    url: '../home/home',
                  })

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
    var that = this;
    const arraypro = [];

    db.collection('describe').count({
      success: function (res) {
        console.log(res.total)
        that.setData({
          total: res.total,
        })
      }
    })

    db.collection('describe').limit(10).get({
      success: function (res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
      
        that.setData({
          infor:res.data,
          
        })
      }
    });

    db.collection('describe').skip(10).limit(15).get({
      success: function (res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        that.setData({
          infor1: res.data
        })
      }
    });



    // console.log(that.data.infor[0].title);
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

  },
  //弹出提示框
  popup2: function () {
    var that = this;
    var i = 0;
    that.setData({
      show1: false,
    })
    var total1 = that.data.total;
    for(i=0;i<10;i++)
    {
      if(total1>0)
      {
        // box[that.data.infor[i].endendsize] = 1;
        var number = parseInt(that.data.infor[i].endendsize)  ;

        // console.log(number);

        box[number] = 1;
        // console.log(box[number]);
        total1--;
      }
    }
    for (i = 0; i < 15; i++) {
      if (total1 > 0) {
        // box[that.data.infor[i].endendsize] = 1;
        var number = parseInt(that.data.infor1[i].endendsize);
        box[number] = 1;
        total1--;
      }
    }
    console.log(box[4]);
    for (var i = 0; i < 26; i++) {
      if (box[i] != 0) {
        this.boxchange(i);
      }
    }
  },
  //初始化箱子颜色
  boxchange(e) {
    var that = this;
    if (e == 1) {
      that.setData({
        red1: 'red',
      })
    } else if (e == 2) {
      that.setData({
        red2: 'red',
      })
    } else if (e == 3) {
      that.setData({
        red3: 'red',
      })
    } else if (e == 4) {
      that.setData({
        red4: 'red',
      })
    } else if (e == 5) {
      that.setData({
        red5: 'red',
      })
    } else if (e == 6) {
      that.setData({
        red6: 'red',
      })
    } else if (e == 7) {
      that.setData({
        red7: 'red',
      })
    } else if (e == 8) {
      that.setData({
        red8: 'red',
      })
    } else if (e == 9) {
      that.setData({
        red9: 'red',
      })
    } else if (e == 10) {
      that.setData({
        red10: 'red',
      })
    } else if (e == 11) {
      that.setData({
        red11: 'red',
      })
    } else if (e == 12) {
      that.setData({
        red12: 'red',
      })
    } else if (e == 13) {
      that.setData({
        red13: 'red',
      })
    } else if (e == 14) {
      that.setData({
        red14: 'red',
      })
    } else if (e == 15) {
      that.setData({
        red15: 'red',
      })
    } else if (e == 16) {
      that.setData({
        red16: 'red',
      })
    }
    else if (e == 17) {
      that.setData({
        red17: 'red',
      })
    }
    else if (e == 18) {
      that.setData({
        red18: 'red',
      })
    } else if (e == 19) {
      that.setData({
        red19: 'red',
      })
    } else if (e == 20) {
      that.setData({
        red20: 'red',
      })
    } else if (e == 21) {
      that.setData({
        red21: 'red',
      })
    } else if (e == 22) {
      that.setData({
        red22: 'red',
      })
    } else if (e == 23) {
      that.setData({
        red23: 'red',
      })
    } else if (e == 24) {
      that.setData({
        red24: 'red',
      })
    } else if (e == 25) {
      that.setData({
        red25: 'red',
      })
    }
  },


  p1: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red1') {
        that.setData({
          start: that.data.end,
          end: 'red1',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red1: 'greenyellow',
        endsize: size
      })

    }
  },

  p2: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    //判断已被存放的箱子
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      //记录上一个点击的箱子
      if (that.data.end != 'red2') {
        that.setData({
          start: that.data.end,
          end: 'red2',
        })
      }

      //改变上一个箱子的颜色
      this.chang(this.data.start);
      that.setData({
        red2: 'greenyellow',
        endsize: size
      })

    }
  },
  p3: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red3') {
        that.setData({
          start: that.data.end,
          end: 'red3',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red3: 'greenyellow',
        endsize: size
      })
    }
  },
  p4: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red4') {
        that.setData({
          start: that.data.end,
          end: 'red4',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red4: 'greenyellow',
        endsize: size
      })
    }
  },
  p5: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red5') {
        that.setData({
          start: that.data.end,
          end: 'red5',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red5: 'greenyellow',
        endsize: size
      })
    }
  },
  p6: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red6') {
        that.setData({
          start: that.data.end,
          end: 'red6',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red6: 'greenyellow',
        endsize: size
      })
    }
  },
  p7: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red7') {
        that.setData({
          start: that.data.end,
          end: 'red7',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red7: 'greenyellow',
        endsize: size
      })
    }
  },
  p8: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red8') {
        that.setData({
          start: that.data.end,
          end: 'red8',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red8: 'greenyellow',
        endsize: size
      })
    }
  },
  p9: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red9') {
        that.setData({
          start: that.data.end,
          end: 'red9',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red9: 'greenyellow',
        endsize: size
      })
    }
  },
  p10: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red10') {
        that.setData({
          start: that.data.end,
          end: 'red10',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red10: 'greenyellow',
        endsize: size
      })
    }
  },

  p11: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red11') {
        that.setData({
          start: that.data.end,
          end: 'red11',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red11: 'greenyellow',
        endsize: size
      })
    }
  },
  p12: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red12') {
        that.setData({
          start: that.data.end,
          end: 'red12',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red12: 'greenyellow',
        endsize: size
      })
    }
  },
  p13: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red13') {
        that.setData({
          start: that.data.end,
          end: 'red13',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red13: 'greenyellow',
        endsize: size
      })
    }
  },
  p14: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red14') {
        that.setData({
          start: that.data.end,
          end: 'red14',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red14: 'greenyellow',
        endsize: size
      })
    }
  },
  p15: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red15') {
        that.setData({
          start: that.data.end,
          end: 'red15',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red15: 'greenyellow',
        endsize: size
      })
    }
  },
  p16: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red16') {
        that.setData({
          start: that.data.end,
          end: 'red16',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red16: 'greenyellow',
        endsize: size
      })
    }
  },
  p17: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red17') {
        that.setData({
          start: that.data.end,
          end: 'red17',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red17: 'greenyellow',
        endsize: size
      })
    }
  },
  p18: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red18') {
        that.setData({
          start: that.data.end,
          end: 'red18',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red18: 'greenyellow',
        endsize: size
      })
    }
  },
  p19: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red19') {
        that.setData({
          start: that.data.end,
          end: 'red19',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red19: 'greenyellow',
        endsize: size
      })
    }
  },
  p20: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red20') {
        that.setData({
          start: that.data.end,
          end: 'red20',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red20: 'greenyellow',
        endsize: size
      })
    }
  },
  p21: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red21') {
        that.setData({
          start: that.data.end,
          end: 'red21',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red21: 'greenyellow',
        endsize: size
      })
    }
  },
  p22: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red22') {
        that.setData({
          start: that.data.end,
          end: 'red22',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red22: 'greenyellow',
        endsize: size
      })
    }
  },
  p23: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red23') {
        that.setData({
          start: that.data.end,
          end: 'red23',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red23: 'greenyellow',
        endsize: size
      })
    }
  },
  p24: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red24') {
        that.setData({
          start: that.data.end,
          end: 'red24',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red24: 'greenyellow',
        endsize: size
      })
    }
  },
  p25: function (e) {
    var that = this;
    var size = e.currentTarget.dataset.size;
    if (box[size] != 0) {
      wx.showToast({
        title: '该箱子已被选择',
        image: '/images/x.png',
      })
    } else {
      if (that.data.end != 'red25') {
        that.setData({
          start: that.data.end,
          end: 'red25',
        })
      }
      this.chang(this.data.start);
      that.setData({
        red25: 'greenyellow',
        endsize: size
      })
    }
  },


  //还原颜色
  chang: function (e) {
    var that = this;
    if (e == 'red1') {
      that.setData({
        red1: originbox
      })
    } else if (e == 'red2') {
      that.setData({
        red2: originbox
      })
    } else if (e == 'red3') {
      that.setData({
        red3: originbox
      })
    } else if (e == 'red4') {
      that.setData({
        red4: originbox
      })
    } else if (e == 'red5') {
      that.setData({
        red5: originbox
      })
    } else if (e == 'red6') {
      that.setData({
        red6: originbox
      })
    } else if (e == 'red7') {
      that.setData({
        red7: originbox
      })
    } else if (e == 'red8') {
      that.setData({
        red8: originbox
      })
    } else if (e == 'red9') {
      that.setData({
        red9: originbox
      })
    } else if (e == 'red10') {
      that.setData({
        red10: originbox
      })
    } else if (e == 'red11') {
      that.setData({
        red11: originbox
      })
    } else if (e == 'red12') {
      that.setData({
        red12: originbox
      })
    } else if (e == 'red13') {
      that.setData({
        red13: originbox
      })
    } else if (e == 'red14') {
      that.setData({
        red14: originbox
      })
    } else if (e == 'red15') {
      that.setData({
        red15: originbox
      })
    } else if (e == 'red16') {
      that.setData({
        red16: originbox
      })
    } else if (e == 'red17') {
      that.setData({
        red17: originbox
      })
    } else if (e == 'red18') {
      that.setData({
        red18: originbox
      })
    } else if (e == 'red19') {
      that.setData({
        red19: originbox
      })
    } else if (e == 'red20') {
      that.setData({
        red20: originbox
      })
    } else if (e == 'red21') {
      that.setData({
        red21: originbox
      })
    } else if (e == 'red22') {
      that.setData({
        red22: originbox
      })
    } else if (e == 'red23') {
      that.setData({
        red23: originbox
      })
    } else if (e == 'red24') {
      that.setData({
        red24: originbox
      })
    } else if (e == 'red25') {
      that.setData({
        red25: originbox
      })
    }
  },

  //确定箱子
  boxconfirm: function (e) {
    var that = this;

    that.setData({
      endendsize: that.data.endsize,
      show1: true,
    })
    console.log(that.data.endendsize);
  },



  boxcancel: function (e) {

    var that = this;
    that.setData({
      endendsize: null,
      show1: true,

    })

  },
})