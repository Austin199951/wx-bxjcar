var app = getApp(),
  utils = require('../../utils/util.js');;
Page({
  data: {
    showOrder:[]
  },
  onLoad(){
    this.getorder()
  },
  getorder(){
    var datas = wx.getStorageSync('datas');
    utils.http(app.globalData.url + "order/getOrderNotice", { datas: datas }, (res) => {
      this.setData({
        showOrder: res.data.data
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