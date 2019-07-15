var app = getApp(),
    utils = require('../../utils/util.js');
Page({
  data: {
    myCollection:[],
    showOrder:"",
    mobile:"",
    tel:"",
    display:"none",
    edit_tel: false,
    hiddenmodalput:false,
    modelTitle:"完善资料",
    telVal:""
  },
  //初始化加载
  onShow(){
    this.myCollection();
    this.getorder();
    this.getPhoneNumber()
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

  //完善信息
  perfect_info() {
    let that = this
    this.setData({
      display: "block",
      hiddenmodalput: (!that.data.hiddenmodalput)
    })
  },

  //修改手机号码
  editmobile(){
    let that = this;
    this.setData({
      display:"block",
      edit_tel: (!that.data.edit_tel)
    })
  },

  //设置手机号
  edittel(e){
    let telVal = e.currentTarget.dataset.telVal;
    this.setData({
      telVal:e.detail.value
    })
  },
  
  //设置手机号
  iPhoneNum(e){
    let mobile = this.data.mobile;
    this.setData({
      mobile:e.detail.value
    })
  },
  //确认添加手机号
  confirm(res){
    let mobile = this.data.mobile,
        tel = this.data.tel,
        that = this;

    console.log(mobile)

    if (mobile == "") {
      utils.showLoading("请输入手机号码", "none")
    } else {
      utils.http(app.globalData.url + "user/setPhoneNumber", { mobile: mobile }, (res) => {
        this.setData({
          tel: res.data.data,
          display: "none",
          hiddenmodalput: (!that.data.hiddenmodalput)
        })
      });
    }
  },

  sure(res){
    let telVal = this.data.telVal,
      that = this,
      tel = this.data.tel;

      this.setData({
        modelTitle:"修改手机号"
      })
    console.log(telVal);

    if (telVal == "") {
      utils.showLoading("请输入手机号码", "none")
    } else {
      utils.http(app.globalData.url + "user/setPhoneNumber", { mobile: telVal}, (res) => {
      
        this.setData({
          tel: res.data.data,
          display: "none",
          edit_tel: (!that.data.edit_tel),
        })
      });
    }
  },


  //提交方法
  // submit(that,str, mobile, tel){
  //   if (str == "") {
  //     utils.showLoading("请输入手机号码", "none")
  //   } else {
  //     utils.http(app.globalData.url + "user/setPhoneNumber", { mobile: mobile }, (res) => {
  //       console.log(res);
  //       this.setData({
  //         tel: res.data.data,
  //         display: "none",
  //         edit_tel: (!that.data.edit_tel),
  //         hiddenmodalput: (!that.data.hiddenmodalput)
  //       })
  //     });
  //   }
  // },

  
  //获取订单模块
  getorder() {
    utils.http(app.globalData.url + "order/getOrderNotice", "", (res) => {
      let showOrder = this.data.showOrder;
      this.setData({
        showOrder: res.data.data[0]
      }); 
    });
  },

  //取消遮幕
  close(){
    let that = this;
    this.setData({
      display:"none",
      edit_tel: (!that.data.edit_tel)
    })
  },


  //我的收藏
  myCollection(){
    utils.http(app.globalData.url + "user/myFavourites","", (res) => {
      var webData = res.data.data
      for (var i = 0; i < webData.length;i++){
        webData[i].min_price = (parseFloat(webData[i].min_price)/10000).toFixed(2);
      }
      this.setData({
        myCollection: webData
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
