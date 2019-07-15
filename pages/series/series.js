var app = getApp();
var utils = require('../../utils/util.js');
Page({
  data: {
    series: [],
    brand_id: "",
    showView:false
  },
  onLoad(res) {
    this.setData({
      brand_id: res.brand_id
    });
    this.getSeries();
  },
  close(){
    let that = this;
    this.setData({
      showView: (!that.data.showView)
    })
  },
  introduce(){
    let that = this;
    this.setData({
      showView: (!that.data.showView)
    })
  },
  //获取汽车系列
  getSeries(){
    var brand_id = this.data.brand_id,
      that = this;

    utils.http(app.globalData.url + 'series/getSeries', { brand_id: brand_id }, (res) => {
      var seriesData = res.data.data
      

      for (var i = 0; i < seriesData.length;i++){
        console.log(seriesData.series_price)
        seriesData.series_price = (parseFloat(seriesData[i].min_price) / 10000).toFixed(2);
        //万为单位
        for (var j = 0; j < seriesData[i].model_info.length;j++){
          seriesData[i].model_info[j].model_price = (parseFloat(seriesData[i].model_info[j].min_price) / 10000).toFixed(2);
        }
      } 

      for (let item of seriesData){
        item.hidden = true
      }
     // seriesData[seriesData.length - 1].hidden = false

      this.setData({
        series: seriesData
      })
    })
  },
  scroll(){},
  //更多汽车
  moreCar(e){
    var key = e.currentTarget.dataset.arr_key,
        arr_name = "series[" + key +"].hidden",
        reverse_hidden = !this.data.series[key].hidden;

    this.setData({
      [arr_name]: reverse_hidden
    })
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