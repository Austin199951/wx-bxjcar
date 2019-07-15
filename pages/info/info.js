var app = getApp(),
  utils = require("../../utils/util.js");
Page({
  data: {
    orderNotice:"",
    notice:"",
    unread:""
  },
  onShow(){
    this.getOrderNotice()
    this.getNotice()
    this.checkNoticeReadStatus()
  },
  //加载官方通知
  getNotice(){
    let  orderNotice = this.data.orderNotice
    utils.http(app.globalData.url + "order/getNotice", "", (res)=>{
      this.setData({
        orderNotice: res.data.data[res.data.data.length - 1].description
      });
    });
  },
//加载订单进度通知
 getOrderNotice(){
   let notice = this.data.notice
   utils.http(app.globalData.url + "order/getOrderNotice", "", (res) => {
    this.setData({
      notice: res.data.data[res.data.data.length - 1].description
    });
   });
  },

  //获取
  checkNoticeReadStatus(){
    utils.http(app.globalData.url + "order/checkNoticeReadStatus", "", (res) => {
      this.setData({
        unread:res.data.data
      });
    });
  },
  msg1(){
    utils.http(app.globalData.url + "order/setOrderNoticeReadStatus", "", (res) => {
      console.log(res);
    });
  },
  msg2() {
    utils.http(app.globalData.url + "order/setNoticeReadStatus", "", (res) => {
      console.log(res);
    });
  },
  
  //下拉刷新
  onPullDownRefresh: function () {
    utils.showLoading("loading...", 'loading');
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