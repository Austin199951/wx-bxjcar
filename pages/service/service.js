let app = getApp(),
    utils = require("../../utils/util.js");
Page({
  data: {
    viewShow:true
  },
  //关闭按钮
  cancel: function () {
    var that = this;
    coverView(that);
  },

  tel:function(res){
    var that = this;
    coverView(that);
    wx.makePhoneCall({
      phoneNumber: '0757-2639-0586',
      success: function () {
        console.log('打电话成功');
      }
    })
  },
  tel1: function (res) {
    var that = this;
    coverView(that);
    wx.makePhoneCall({
      phoneNumber: '18125653590',
      success: function () {
        console.log('打电话成功');
      }
    })
  },
  mobile:function(e){
    var that = this;
    coverView(that);
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