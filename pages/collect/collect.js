var app = getApp(),
    utils = require('../../utils/util.js');
Page({
  data:{
    collect_bg: '../../images/collect.png',
    collectConfig:[],
    doubtInfo:[],
    showView:false,
    placeorder:true,
    tel:"",
    username:"",
    mobile:""
  },
  onLoad(res){
    
    var data_collect = wx.getStorageSync('dataCollect')

    // for (var i = 0; i < data_collect.category_info.length; i++) {
    //   for (var j = 0; j < data_collect.category_info[i].group_info.length;j++){
    //     for (var k = 0; k < data_collect.category_info[i].group_info[j].detail_info.length; k++) {
    //       data_collect.category_info[i].group_info[j]["detail_price"] = data_collect.category_info[i].group_info[j].detail_info[k].price
    //     }
    //   } 
    // }

    data_collect.exchange_rate.reference_price = (parseFloat(data_collect.exchange_rate.reference_price) / 10000).toFixed(2);

    this.setData({
      collectConfig: data_collect
    });


    this.getPhoneNumber()
    this.getUserInfo()
  },
  getUserInfo(){
    let user_name = wx.getStorageSync("user_name"),
      phone = wx.getStorageSync("phone"),
      username = this.data.username,
      mobile = this.data.mobile,
      tel = String(phone),
      user_name_str = String(user_name);

      this.setData({
        username: user_name_str,
        mobile: tel
      })
    console.log(typeof (username, mobile))
  },

  bindusername(res){
    let username = this.data.username;
    this.setData({
      username:res.detail.value
    })
  },

  bindmobile(res) {
    let mobile = this.data.mobile;
    this.setData({
      mobile: res.detail.value
    })
    
  },

  

  //获取手机号码
  getPhoneNumber() {
    let tel = this.data.tel;
    utils.http(app.globalData.url + "user/getPhoneNumber", "", (res) => {
      this.setData({
        tel: res.data.data
      })
    });
  },
  //疑问
  doubt(res){
    let ci_index = res.currentTarget.dataset.ci_id,
      gi_index = res.currentTarget.dataset.gi_id,
      di_index = res.currentTarget.dataset.di_id,
        that = this,
        doubtInfo = this.data.collectConfig.category_info[ci_index].group_info[gi_index].detail_info[di_index];
    
    doubtInfo.length=0;
    this.setData({
      doubtInfo: doubtInfo,
      showView: (!that.data.showView)
    });
  },
  //关闭弹窗
  close(){
    var that = this;
    this.setData({
      showView: (!that.data.showView)
    });
  },
  cancel(){
    this.setData({
      placeorder: true
    })
  },
  //收藏
  collect(res) {
    var model_id = res.currentTarget.dataset.model_id;

    utils.http(app.globalData.url + "user/collection", { model_id: model_id}, (res) => {
      var num = res.data.data;
      if (num % 2 == 0) {
        this.setData({
          collect_bg: '../../images/collect.png'
        });
      } else {
        this.setData({
          collect_bg: '../../images/collect_cur.png'
        });
      }
    });
  },
  //提交订单
  submitOrder(){
    this.setData({
      placeorder: false
    })
  },
  confirm(){
    let user_name = this.data.username,
        phone = this.data.mobile,
        datas = wx.getStorageSync('datas');

    if (user_name == ""){
      utils.showLoading("姓名不能为空","none")
      return false;
    } else if (phone == ""){
      utils.showLoading("手机号不能为空", "none")
      return false;
    } else {
      utils.http(app.globalData.url + "order/saveOrder", { datas: datas, user_name: user_name, phone: phone }, (res) => {
        wx.setStorageSync("user_name", user_name)
        wx.setStorageSync("phone", phone)
        wx.switchTab({
          url: '../info/info',
        })
      });
    }
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