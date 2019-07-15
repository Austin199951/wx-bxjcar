var app = getApp(),
    utils = require('../../utils/util.js');

Page({
  data: {
    indicatorDots: "true",
    autoplay: true,
    interval: 3000,
    duration: "500",
    imgUrls: [],
    collect_bg:'../../images/collect.png',
    model_id:'',
    carConfig:[],
    checkboxChecked:false,
    radioChecked:false,
    carImage:[],
    imageIndex:0,
    img_idx:0,
    detailsInfo:[],
    showView:false,
    group_info:[],
    total_price:0,
    swiper_current:0,
    detailName:"",
    detailPrice:"",
    detailDoub:false,
    doubtDetails:[],
    last_config:"",
    changeValue:"",
    default_img:""
  },
  
  //收藏
  collect(){
    var model_id = this.data.model_id;
      utils.http(app.globalData.url + "user/favourites", { model_id: model_id},(res)=>{
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
  changeImgIndex(e){
      var domData=e.currentTarget.dataset
      this.setData({imageIndex:domData.img_idx})
  },
  //加载
  onLoad(res){
    this.setData({
      model_id: res.model_id,
      default_img:res.img
    });
    this.getConfigGroupOfModel()
  },
  //汽车配置组
  getConfigGroupOfModel(){
    var that = this,
      model_id = that.data.model_id;

    utils.http(app.globalData.url + 'config_detail/getConfigDetailOfModel', { model_id: model_id},(res)=>{
      var webData = res.data.data
      console.log(webData);
      //给webData 数组 赛hidden =true
      for (var i=0;i< webData.cat_info.length;i++){
        for (var j = 0; j < webData.cat_info[i].group_info.length; j++) {
          webData.cat_info[i].group_info[j]['hidden'] = true
          
          if ((webData.cat_info[i].group_info[j].show_type == 2 && webData.cat_info[i].group_info[j].multi_choose == 0) || (webData.cat_info[i].group_info[j].show_type == 1 && webData.cat_info[i].group_info[j].multi_choose == 0)){
            
            for (var k = 0; k < webData.cat_info[i].group_info[j].detail_info.length; k++){
              webData.cat_info[i].group_info[j].detail_info[k].is_check = 0
              if (webData.cat_info[i].group_info[j].detail_info[k].is_default == 1) {
              
                webData.cat_info[i].group_info[j]["detail_name"] = webData.cat_info[i].group_info[j].detail_info[k].name_cn,
                  webData.cat_info[i].group_info[j]["detail_img"] = webData.cat_info[i].group_info[j].detail_info[k].img,
                  webData.cat_info[i].group_info[j]["detail_price"] = webData.cat_info[i].group_info[j].detail_info[k].price,
                  webData.cat_info[i].group_info[j]["detail_inscn"] = webData.cat_info[i].group_info[j].detail_info[k].ins_cn,
                  webData.cat_info[i].group_info[j]["detail_id"] = webData.cat_info[i].group_info[j].detail_info[k].config_id,

                  webData.cat_info[i].group_info[j].detail_info[k]["checked"] = false
                webData.cat_info[i].group_info[j].detail_info[k].is_check=1
              }
            }
          }

        }
      }

      //收藏功能  如果is_collection == 0 默认没有收藏
      if (webData.is_favourites == 0){
        this.setData({
          collect_bg: '../../images/collect.png'
        });
      } else {
        this.setData({
          collect_bg: '../../images/collect_cur.png'
        });
      }
      
      that.setData({
        carConfig: webData
      });
      this.initData(webData)
    });
    
  },
  initData(resp) {
    var carChoose = []
    var carImage = []
    for (var cat of resp.cat_info) {
      var cat_arr = { "cat_id": cat.cat_id }

      if (cat.has_img == 1) {
        var cat_img_arr = { "cat_id": cat.cat_id, "name_cn": cat.name_cn, "img": [] }
        carImage.push(cat_img_arr)
      }
     
      cat_arr["group_info"] = []
      for (var gp of cat.group_info) {
        var gp_arr = { "group_id": gp.group_id }

        var config_id = []
        for (var dt of gp.detail_info) {
          if (dt.is_default == 1) {
            config_id.push(dt.config_id)

            console.log("dldddddddddddddddddddd");
            console.log(dt);
          }
        }
        gp_arr["config_id"] = config_id

        

        cat_arr["group_info"].push(gp_arr)
       
      }
      carChoose.push(cat_arr)
    }
    
    this.setData({
      carChoose: carChoose, carImage: carImage
    })
    this.fetchDataAfterSelect()
  },
  fetchDataAfterSelect() {
    var sendData = this.data.carChoose,
    default_img = this.data.default_img,
      group_datas = app.globalData.group_datas;



    utils.http(app.globalData.url + 'config_category/getImgDetailOfConfig', { datas: sendData, group_last_config: group_datas.group_last_config }, (res) => {
      console.log("dddddddd");
      console.log(group_datas.group_last_config);

      // let webData = res.data.data.image_info
      // if (webData.length == 0){
      //   webData.push(default_img)
      //   this.setData({
      //     webData : default_img
      //   });
      // }
      
      //总价转为小数点
      var web_price = (parseFloat(res.data.data.total_price)/10000).toFixed(2);

      // var old_carImage = this.data.carImage
      
      
      // for (var cat_info of res.data.data.image_info) {
      //   var new_cat_id = cat_info.cat_id
       
      //   for (var old_cat_info of old_carImage) {
      //     if (old_cat_info.cat_id == new_cat_id) {
      //       old_cat_info.img = cat_info.img
      //       new_carImage.push(old_cat_info)
      //     }
      //   }
      // }
      this.setData({ carImage: res.data.data.image_info, total_price: web_price, swiper_current: 0 })
    
    })
  },

  //内容详情
  doubtdetail(e){
    var domData = e.currentTarget.dataset
    var cat_index = domData.c_idx, group_index = domData.g_idx
    var detail_info = this.data.carConfig.cat_info[cat_index].group_info[group_index]
    var detailsInfo = this.data.detailsInfo,
        that = this;

    detailsInfo.length = 0;
    detailsInfo.push(detail_info);

    this.setData({
      detailsInfo: detailsInfo,
      showView: (!that.data.showView)
    });
   
  },

  checkboxdoubtdetail(e){
    var domData = e.currentTarget.dataset
    var name_cn = domData.namecn,
        ins_cn = domData.ins_cn,
        that = this

    this.setData({
      doubtDetails: [{
        "name_cn": name_cn,
        "ins_cn": ins_cn
      }],
      detailDoub: (!that.data.detailDoub)
    });
  },
  //选择汽车配置项
  selectConfigItem(e){
    var group_index = e.currentTarget.dataset.group_idx,
      cat_index = e.currentTarget.dataset.cat_idx

    var arr_name = "carConfig.cat_info[" + cat_index + "].group_info[" + group_index +"].hidden";
    var reverse_hidden = !this.data.carConfig.cat_info[cat_index].group_info[group_index].hidden

    this.setData({
      [arr_name]: reverse_hidden
    })
  },

  close(){
    var that = this;
    this.setData({
      showView: (!that.data.showView)
    });
  },
  close1() {
    var that = this;
    this.setData({
      detailDoub: (!that.data.detailDoub)
    });
  },
  
  //显示汇总
  showCollect(){
    var carChoose = this.data.carChoose;
   // console.log(carChoose)
    wx.setStorage({
      key: 'datas',
      data: carChoose,
    })

    utils.http(app.globalData.url + 'config_category/getOrderSummary', { datas: carChoose }, (res) => { 
      var webData = res.data.data
      webData.model_info.total_price_wan = (parseFloat(webData.model_info.total_price)/10000).toFixed(2)

      wx.setStorage({
        key: 'dataCollect',
        data: webData,
      })
      wx.navigateTo({
        url: '../collect/collect',
      })
    });
  },
  
  selectHandler(e) {
    let autoplay = this.data.autoplay;
    this.setData({
      autoplay: false
    })

    var domData = e.currentTarget.dataset
    var cat_index=domData.c_idx,group_index=domData.g_idx
    var multi_choose = this.data.carConfig.cat_info[cat_index].group_info[group_index].multi_choose
    var up="carChoose["+cat_index+"].group_info["+group_index+"].config_id";
    var last_config_up = "carChoose[" + cat_index + "].last_config";

    let group_last_config = "carChoose.group_last_config";
    var selected_id = '';//选中的id 

    


    
    if (multi_choose == 0) {
    
      var old_config = this.data.carConfig
      var config_id = e.detail.value

      for (var i = 0; i < old_config.cat_info[cat_index].group_info[group_index].detail_info.length;i++)
      {
        old_config.cat_info[cat_index].group_info[group_index].detail_info[i].is_check = 0
        if (old_config.cat_info[cat_index].group_info[group_index].detail_info[i].config_id==config_id)
        {
          old_config.cat_info[cat_index].group_info[group_index].detail_name = old_config.cat_info[cat_index].group_info[group_index].detail_info[i].name_cn
          
          old_config.cat_info[cat_index].group_info[group_index].detail_img = old_config.cat_info[cat_index].group_info[group_index].detail_info[i].img

          old_config.cat_info[cat_index].group_info[group_index].detail_price = old_config.cat_info[cat_index].group_info[group_index].detail_info[i].price

          old_config.cat_info[cat_index].group_info[group_index].detail_inscn = old_config.cat_info[cat_index].group_info[group_index].detail_info[i].ins_cn

          old_config.cat_info[cat_index].group_info[group_index].detail_id = old_config.cat_info[cat_index].group_info[group_index].detail_info[i].config_id
          
          
          old_config.cat_info[cat_index].group_info[group_index].detail_info[i].is_check=1
        }
        
      }
      
      this.setData({
        carConfig: old_config, 
        [up]: [e.detail.value],
        [last_config_up]: [e.detail.value] ,
        selected_id: [e.detail.value],
        autoplay: true
      })
    }else{
      this.setData({
        [up]: e.detail.value,
        [last_config_up]: e.detail.value,
        selected_id: e.detail.value,
        autoplay: true
      })
    }

    this.setData({
      autoplay:true
    })
    let group_datas = { group_last_config: this.data.selected_id };
    app.globalData.group_datas = group_datas
    //console.log(group_datas)
    
    //console.log(JSON.stringify(this.data.carChoose))

    console.log(JSON.stringify(this.data.carChoose))
    this.fetchDataAfterSelect()
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