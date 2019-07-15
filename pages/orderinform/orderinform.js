var app = getApp(),
  utils = require('../../utils/util.js');;
Page({
  data:{
    orderInform:[]
  },
  onLoad(){
    this.getInform();
  },
  //获取通知消息
  getInform(){
    utils.http(app.globalData.url+"order/getNotice","",(res)=>{
      this.setData({
        orderInform:res.data.data
      });
      console.log(res.data.data);
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
});