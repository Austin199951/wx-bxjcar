var app = getApp(),
  utils = require('../../utils/util.js'),
  md5 = require('../../utils/md5.js');
Page({
  data: {
    indicatorDots:true,
    autoplay:true,
    interval:3000,
    duration:"500",
    indexBanner:[],
    index:0,
    dots:false,
    interval1:2000,
    duration1:'300',
    saleModel: [],
    series:[],
    showView: false
  },
  //加载
  onShow(){
    this.authorize(); 
    this.brand();
    this.getIndexBanner();
    this.getShareInfo();
  },
  close() {
    let that = this;
    this.setData({
      showView: (!that.data.showView)
    })
  },
  getShareInfo(){
    utils.http(app.globalData.url + 'share/getShareInfo', "", (res) => {
      let shareInfo = res.data.data;
      wx.setStorageSync("img", shareInfo.img)
      wx.setStorageSync("title", shareInfo.title)
    });
  },
  introduce() {
    let that = this;
    this.setData({
      showView: (!that.data.showView)
    })
  },
  authorize(){
    var that = this;
       
    //微信授权
    wx.authorize({
      scope: '',
      success(res) {//授权成功
        console.log("授权成功")
        let user_id = String(wx.getStorageSync("user_id"));
        if (!user_id) {//如果没有user_id
          console.log("no user_id")

          wx.login({//发起微信登录
            success(res) {
              var code = res.code;
              utils.http(app.globalData.url + "login/wechatLogin", { code: code }, (res) => {
                console.log("DDDDDDDDDDDDDDDDD");
                console.log(res.data.data);

                let webData = res.data.data
                    user_id = parseInt(webData.user_id)
                
                let utoken = webData.utoken;
                wx.setStorageSync("utoken", utoken);
                wx.setStorageSync("user_id", user_id);
                let user_name = webData.user_name,
                    phone = webData.phone
                    
                if (user_name != -1) {
                  wx.setStorageSync("user_name", user_name);
                }
                if (phone != -1) {
                  wx.setStorageSync("phone", phone);
                }
                
              });
            }
          })
        }
        app.globalData.is_login = true;
      }
    })
  },

  //加载品牌数据
  brand(){
    var that = this;
    utils.http(app.globalData.url + 'brand/getBrand', "", (res) => {
      that.setData({
        saleModel: res.data.data
      })
    })
  },
  //获取首页轮播
  getIndexBanner(){
    utils.http(app.globalData.url + 'share/getIndexBanner', "", (res) => {
      console.log(res);
      this.setData({
        indexBanner: res.data.data
      });
    });
  },
  //转发
  onShareAppMessage: function () {
    let img = wx.getStorageSync("img"),
      title = wx.getStorageSync("title");

    return {
      title: title,
      path: '/pages/index/index',
      imageUrl: img
    }
    wx.showShareMenu({
      withShareTicket: false
    })
  }
})