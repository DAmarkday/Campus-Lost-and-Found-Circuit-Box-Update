//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.getOpenid().then(res =>{
    this.globalData.studentProve = false;
    this.globalData.studentCard = '未绑定学号'
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    this.onCompare().then(res => { });
    });
    // 登录
    //  this.userLogin();
    this.globalData = {}
  },
  getOpenid: function () { //通过云开发函数的getOpenId函数获取本机微信账号的openid
    let that = this;
    return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'getOpenId',
      success: res => {
         console.log('云函数获取到的openid: ', res.result.openid);
        var openid = res.result.openid;
        this.globalData.openId = openid;
       // console.log(typeof( res.result.openid));
        resolve();
       // console.log(this.globalData.openId);
      }})
      
    });
   // console.log(this.globalData.openId);
    //console.log(openid);
  },
  getNewUserInfo:function(){
    
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            
            wx.getUserInfo({
              success: res => {
                console.log(res.userInfo)
                const userInfox = res.userInfo
                this.globalData.nickN = userInfox.nickName
                this.globalData.headerUrl = userInfox.avatarUrl;
                this.onPostCloud();
                console.log(this.globalData.nickN);
                console.log(this.globalData.headerUrl);
              }
            })
          }
        }
      })
    resolve();})
  },
  onPostCloud:function(){
    wx.cloud.callFunction({
      name: 'batchUpdateData',
      data: {
        id: this.globalData.onlyId,
        userReceiveName: this.globalData.nickN,
        userReceiverHeadPicture: this.globalData.headerUrl
      },
      success: res => {
        console.log("更新成功！")
      }
    })
  },
  onUpdateNameAndHeader:function(){
   // console.log("412321");
    this.getNewUserInfo().then(res=>{
    //console.log("4123");
    
    
    })//如果用户微信称号和头像更改则可以更新
  },
  onCompare: function () {
    const db = wx.cloud.database();
    var that = this;

    return new Promise((resolve, reject) => {
      console.log(this.globalData.openId);
      db.collection('studentID').where({
        _openid: this.globalData.openId
        //"this.globalData.openId"
      })
        .get({
          complete: res => {
            // console.log(res.data);
            if (res.data.length == 0) { //表示数据库没有对应的openid，代表这是一个新用户
              db.collection('studentID').add({
                data: {
                  studentNO: "null",
                  loginCount: "0",
                  imagePath:''

                },
                success(res) {
                  this.globalData.studentProve = false;
                }
              });
            } else if (res.data.length != 0) {
              var sNO = res.data[0].studentNO
              if (sNO == "null") {
                this.globalData.studentProve = false;
                //resolve();
                //为空则修改全局变量为false，之后会传给学生认证.
              } else {
                this.globalData.onlyId =res.data[0]._id;
                //console.log(res.data[0]._id);
                //console.log("asd");
                this.globalData.imageStudentProvePath = res.data[0].imagePath;//小程序开始运行，将云开发里的已认证学生的照片找出来fileID
                this.globalData.studentProve = true;
                this.globalData.studentCard = sNO; //如果学号不为空
                this.onUpdateNameAndHeader();
              }
            }
            //console.log(res.data[0].studentNO);//查找成功则判断对应的学号是否为空

          }
          // fail: err => {
          //   console.log(err.data);//查找失败则创建新的项，系统默认保存微信的openid
          //   // db.collection('studentID').add({
          //   //   data: {studentNO: "null"},
          //   //   success(res) {
          //   //     app.globalData.studentprove = false;
          //   //     console.log("fail");
          //   //   }
          //   // }
          //   );
        });
      resolve();});
    
  },
  globalData:{
    studentProve: null,//学生认证
    openId: null,//用户唯一标识符
    studentCard: null,//学号
    userNameALL: null,
    userPictureALL: null,
    imageStudentProvePath:null,//学生已认证后的照片证明，存储的是云的fileID
    onlyId:null,
     nickN : null,
     headerUrl : null,
  }

})
