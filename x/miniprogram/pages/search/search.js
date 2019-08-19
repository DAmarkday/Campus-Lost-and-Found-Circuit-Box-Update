// pages/search/search.js
var app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infor: [],
    inputvalue: '', //搜索框里的获取内容的容器
    showview: true, //判断是否显示view
    view_hidden: true,
    focus: true,
    show:false,
    pagecount: 0, //分页定位查询标识符
    data_count: 0, //单次搜索的有效匹配数据数
    arrived_end:false,  //是否已经到达云开发函数的最后数据
    scrollTop:0,
    four_zero_four:true,
    total_depend_four_zero_four:0,

  },
  // 放大图片

  bigger: function(e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var array = []; //定义数组
    array[0] = src;
    // console.log(src);
    wx.previewImage({
      current: src,
      urls: array[0]
    })
  },

  detail: function(e) {

    var time = e.currentTarget.dataset.src; //获取data-src
    // console.log(title)
    wx.navigateTo({
      url: "../detail/detail?time=" + time, //页面传值
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  b_but: function() {
    return new Promise((resolve, reject) => {
          try {
            wx.setStorageSync("data_id", []);
          } catch (e) {
          }
          resolve();
        

    }).then(res =>{

    
  
      var that = this;
      let session = '';
      session = this.data.inputvalue;
      that.setData({
        showview: false, //隐藏最初的view
        infor: [],
        pagecount: 0, //分页定位查询标识符
        data_count: 0, //单次搜索的有效匹配数据数
        arrived_end:false,
        four_zero_four: true,
        total_depend_four_zero_four: 0,
  

        // total_yun_count: p //查询云开发中有多少条数据
      });
      // console.log("count " + this.data.total_yun_count);
      this.setData({
        data_count: 0,
        view_hidden:true
      })
      that.searchInfo(session);
   
    wx.showLoading({
      title: '搜索中',
    })
       
      })
  },

  b_input: function(e) {
    this.setData({
      inputvalue: e.detail.value, //将输入的值传入page/data的值
    });
  },
  // 搜索函数
  async searchInfo(info) {
   
    let that = this;
    let a;
    var idArray = new Array();
    //console.log("data_count  " + this.data.data_count)
    
    while (this.data.data_count < 7 && this.data.arrived_end == false) {
      await new Promise((resolve,reject) => {
       // this.every_search(info) //搜索之后结果存入缓存
        // that.data.pagecount += 1;
        //   console.log(this.data.data_count);
        //   console.log(this.data.pagecount);
       //    resolve();
       idArray=[];
        let that = this;
        db.collection('describe').field({
          title: true,
          description: true,
          _id: true
        }).orderBy("time", "desc").skip(this.data.pagecount * 20).limit(20)
          .get({
            success: res => {
              if (res.data.length == 0) {
                this.setData({
                  arrived_end: true,
                })

              } else {
                let x = new Array(res.data.length);
                let y = new Array(res.data.length);
                let z = new Array(res.data.length);
                //console.log("x的长度" + res.data.length);

                
                for (let i = 0; i < res.data.length; i++) {
                  x[i] = res.data[i].title;
                  y[i] = res.data[i].description;
                  z[i] = res.data[i]._id;
                }
                var r = 0;
                for (let j = 0; j < res.data.length; j++) {
                  if (((x[j].indexOf(info)) != -1) || ((y[j].indexOf(info)) != -1)) {
                    idArray[r] = z[j]; //获取对应的_id
                    // idArray[r] = j + (this.data.pagecount-1)*20;//r的座位顺序编号等于每次20个查询中匹配的编号+（页数-1）*20;
                    //筛选后查找到的所有信息的座位号顺序号
                    // console.log(idArray[r]);
                    r++;
                    that.data.total_depend_four_zero_four++;
                    that.data.data_count++;
                    //console.log("asdas   "+x[j]+"   "+y[j])
                    console.log("data count" + that.data.data_count);
                  }
                  console.log("666666666666");
                }
                console.log("idArray "+idArray.length);
                if (idArray.length > 0) { //如果20个数据里存在某些相符合,存入缓存
                  try {

                    let value = wx.getStorageSync('data_id');//返回的是字符串
                    console.log("value " + value[0]);
                    if (true) {
                      console.log("idArray 11111111");
                      for (var o=0;o<idArray.length;o++) {
                        //console.log("valueid " + idArray[o]);
                        //console.log("typeof "+typeof(value));
                        value.push(idArray[o]);
                        //console.log("value " + value[o]);
                      }
                      try {
                        wx.setStorageSync("data_id", value); //同步设置到缓存中
                      } catch (e) {
                      }
                      // Do something with return value
                    } // } else {
                    //   try {
                    //     wx.setStorageSync("data_id", idArray); //同步设置到缓存中
                    //   } catch (e) {
                    //   }
                    // }
                  } catch (e) {
                    // Do something when catch error
                  }
                }
                
              }
              that.data.pagecount += 1;
              console.log(this.data.data_count);
              console.log(this.data.pagecount);
              console.log("7777777" + this.data.data_count);
              resolve();
            }
          });
        
        
      }).then(res =>{
      
        
        console.log("7777777" + this.data.data_count);
      })}

    console.log(" this.data.arrived_end  " + this.data.arrived_end);
      
      //查看缓存里面是否有7个
    //  console.log("7777777"+this.data.data_count);
      this.search_each_get();
    
     
    
  }
    ,//分页搜索，正在加载中...
  async search_each_get(){
  try {
    var value_show = wx.getStorageSync('data_id')//定义为var非let
    console.log(" this.data.arrived_end  " + this.data.arrived_end);
  } catch (e) {
    // Do something when catch error
  }
  var qq = [];
  if (this.data.data_count >= 7) {
    for (let i = 0; i < 7; i++) {
      await new Promise((resolve, reject) => {
        db.collection('describe').doc(value_show[i]).get({
          success: res => {

            console.log("value_show " + value_show[i])
            // console.log(res);
            console.log(typeof (res.data));
            console.log(res.data);
            qq.push(res.data);
            console.log("QQ:" + qq)
            console.log(" data_count    " + this.data.data_count);
            resolve();


          }

        })
      });
    }
    this.data.data_count -= 7;
    console.log(" data_count    " + this.data.data_count);
    let new_value = [];
    let ft = 0;
    for (let i = 7; i < value_show.length; i++) {
      new_value[ft] = value_show[i];
      ft++;
    }
    try {
      wx.setStorageSync("data_id", new_value);
      console.log("new_value " + new_value); //同步设置到缓存中
    } catch (e) {

    }
  } else if (this.data.arrived_end == true) {

    for (let i = 0; i < value_show.length; i++) {
      await new Promise((resolve, reject) => {
        db.collection('describe').doc(value_show[i]).get({
          success: res => {
            console.log(res.data);
           // console.log(typeof (res));
          //  console.log(typeof (res.data));
            qq.push(res.data);
            console.log("QQ:" + qq)
            resolve();


          }

        })
      });
    }
      try {
        wx.setStorageSync("data_id", []);
        console.log("new_value " + new_value); //同步设置到缓存中
      } catch (e) {

      }
    if (this.data.total_depend_four_zero_four != 0){
      this.setData({
        show: false,
        view_hidden: false,
      })}
    
  }
  let x = [];
  x = this.data.infor.concat(qq);
    console.log("this.data.arrived_end "+this.data.arrived_end)
  console.log("x " + x);
    wx.hideLoading();
    if (this.data.total_depend_four_zero_four==0){
      this.setData({
        four_zero_four:false,
        view_hidden:true,
        show:false
      })
    }
  this.setData({
    infor: x,
    showview: false,
    show:false
  })


}


    ,
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
    this.setData({
      show: true,//显示正在加载
      view_hidden: true
    })
    this.searchInfo();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onPageScroll: function (e) {//监听页面滚动
    this.setData({
      scrollTop: e.scrollTop
    })
  }
})