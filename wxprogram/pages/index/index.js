//index.js
//获取应用实例
var wxCharts = require('../../libs/wxcharts.js')
var dalineChart = null;
var yuelineChart = null;
const app = getApp()
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
Page({
  data: {
    background: "/images/simba.png",
    location_text: '北京',
    temperature: '30°',
    now_weather: '晴',
    now_air: '优',
    today: '2019-09-12',
    today_weather: '晴转多云',
    flag:false,
    ec: {
      onInit: function (canvas, width, height) {
        chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart);
        return chart;
      },
      lazyLoad: true // 延迟加载
    },
  },
  getMothElectro:function(){
    var windowWidth = 320;
    try {
     var res = wx.getSystemInfoSync();
     windowWidth = res.windowWidth;
    } catch (e) {
     console.error('getSystemInfoSync failed!');
    }
    console.log(this.data.forcast.hourly[0].hum)
    yuelineChart = new wxCharts({ //当月用电折线图配置
     canvasId: 'yueEle',
     type: 'line',
     categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23','24'], //categories X轴
     animation: true,
     // background: '#f5f5f5',
     series: [{
      name: '湿度',
      //data: yuesimulationData.data,
      data: [this.data.forcast.hourly[0].hum, this.data.forcast.hourly[1].hum, this.data.forcast.hourly[2].hum, this.data.forcast.hourly[3].hum, this.data.forcast.hourly[4].hum, this.data.forcast.hourly[5].hum, this.data.forcast.hourly[6].hum, this.data.forcast.hourly[7].hum, this.data.forcast.hourly[8].hum, this.data.forcast.hourly[9].hum, this.data.forcast.hourly[10].hum, this.data.forcast.hourly[11].hum, this.data.forcast.hourly[12].hum, this.data.forcast.hourly[13].hum, this.data.forcast.hourly[14].hum, this.data.forcast.hourly[15].hum, this.data.forcast.hourly[16].hum, this.data.forcast.hourly[17].hum, this.data.forcast.hourly[18].hum, this.data.forcast.hourly[19].hum, this.data.forcast.hourly[20].hum, this.data.forcast.hourly[21].hum, this.data.forcast.hourly[22].hum, this.data.forcast.hourly[23].hum],
      format: function (val, name) {
       return val.toFixed(2) + 'sd';
      }
     },{
      name: '温度',
      data: [this.data.forcast.hourly[0].tmp, this.data.forcast.hourly[1].tmp, this.data.forcast.hourly[2].tmp, this.data.forcast.hourly[3].tmp, this.data.forcast.hourly[4].tmp, this.data.forcast.hourly[5].tmp, this.data.forcast.hourly[6].tmp, this.data.forcast.hourly[7].tmp, this.data.forcast.hourly[8].tmp, this.data.forcast.hourly[9].tmp, this.data.forcast.hourly[10].tmp, this.data.forcast.hourly[11].tmp, this.data.forcast.hourly[12].tmp, this.data.forcast.hourly[13].tmp, this.data.forcast.hourly[14].tmp, this.data.forcast.hourly[15].tmp, this.data.forcast.hourly[16].tmp, this.data.forcast.hourly[17].tmp, this.data.forcast.hourly[18].tmp, this.data.forcast.hourly[19].tmp, this.data.forcast.hourly[20].tmp, this.data.forcast.hourly[21].tmp, this.data.forcast.hourly[22].tmp, this.data.forcast.hourly[23].tmp],
      format: function (val, name) {
       return val.toFixed(2) + 'kWh';
      }
     }],
     xAxis: {
      disableGrid: true
     },
     yAxis: {
      title: '湿度',
      format: function (val) {
       return val.toFixed(2);
      },
      max: 120,
      min: 0
     },
     width: windowWidth,
     height: 200,
     dataLabel: false,
     dataPointShape: true,
     extra: {
      lineStyle: 'curve'
     }
    });
   },
  getdataweather:function(){
    wx.request({
      url: 'http://127.0.0.1:8080/updata',
      method: "POST",
      data: {
        id: app.globalData.openid,
      },
      success: res => {
        console.log(res.data)
        this.setData({
          resultweather:res.data,
          flag:true
        })
      }
    })
  },
  
  updataweather:function(){
    console.log(app.globalData.openid)
    wx.request({
      url: 'http://127.0.0.1:8080/getdata',
      method: "POST",
      data: {
        id: app.globalData.openid,
        local:this.data.location_text,
        aqi:this.data.quanlity
      },
      success: res => {
        console.log(res.data)
      }
    })
  },
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
    console.log(app.globalData.openid)
    this.updataweather()
    this.getdataweather()
    this.getNowWeather()
    this.getNowqWeather()
    wx.showToast({
      title: '刷新成功',
    })
  },
  //图片转base64

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    
    if (app.globalData.openid){
      console(app.globalData.openid)
    }
    else
    {
      app.employIdCallback = ()=> {
      console.log("+++++++")  
      console.log(app.globalData.openid)
      this.getdataweather()
      }
    }
    this.qqmapsdk = new QQMapWX({
      key: 'U7ZBZ-3P33I-KZ3GF-5LTVU-J6NCK-U4BHD'
    })
    this.getCityAndWeather()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getCityAndWeather() {
    console.log("123213123213213")
    var that = this;
    wx.getLocation({
      success: res => {
        this.location_pin = res.longitude + ',' + res.latitude
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res2 => {
            let city = res2.result.address_component.city
            that.setData({
              location_text: city,
            })
            that.getNowWeather()
            that.getNowqWeather()
          },
          fail: () =>{
          }
        })
      },
      fail: () => {
        console.log('未授权位置');
      }
    })
  },
  getNowqWeather() {
    this.getforWeather()
    console.log("1")
    setTimeout(() => {
      this.getMothElectro()
      console.log("2")
    }, 1000);
    
    let that = this
    let hfkey = '09fe7be8aaf1463487c0d2d800f24310'
    let url = 'https://api.heweather.net/s6/air/now?key=' + hfkey + '&location=' + this.location_pin
    wx.request({
      url: url,
      success: function (res) {
        console.log('successssssssssssssss')
        //获取用户信息
        console.log(app.globalData.openid)
        let nowData = res.data;
        that.setData({
          quanlity:nowData.HeWeather6[0].air_now_city.aqi
        })
      },
      fail: function (res) {
        console.log('successssssssssssssss')
        console.log('asdsad')
      }
    })
  },
  getforWeather() {
    let that = this
    let hfkey = '09fe7be8aaf1463487c0d2d800f24310'
    let url = 'https://api.heweather.net/s6/weather/hourly?key=' + hfkey + '&location=' + this.location_pin
    wx.request({
      url: url,
      success: function (res) {
        console.log('successssssssssssssss')
        //获取用户信息
        console.log(app.globalData.openid)
        let nowData = res.data;
        that.setData({
          forcast:nowData.HeWeather6[0]
        })
      },
      fail: function (res) {
        console.log('successssssssssssssss')
        console.log('asdsad')
      }
    })
  },
  getNowWeather() {
    let that = this
    let hfkey = '98841c70ecbe40a19acbf5554322ab89'
    let url = 'https://free-api.heweather.net/s6/weather/now?key=' + hfkey + '&location=' + this.location_pin
    wx.request({
      url: url,
      success: function (res) {
        console.log('success')
        //获取用户信息
        let nowData = res.data.HeWeather6[0].now;
        //温度数据
        let temperature = nowData.tmp
        //当前天气文字描述
        let now_weather = nowData.cond_txt
        // 今日日期
        var date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        that.setData({
          daaata:res.data,
          temperature: temperature + '°',
          now_weather: now_weather,
          today: year + '-' + month + '-' + day
        })
      },
      fail: function (res) {
        console.log('asdsad')
      }
    })
  },
  
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
})
