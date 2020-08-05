//index.js
//获取应用实例
const app = getApp()
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
Page({
  data: {
    background: "/images/simba.png",
    location_text: '上海',
    temperature: '31°',
    now_weather: '晴',
    now_air: '优',
    today: '2019-09-12',
    today_weather: '晴转多云'
  },
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
    wx.showToast({
      title: '刷新成功',
    })
  },
  //图片转base64
  onLoad: function (options) {
    //设置背景图片
    
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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
    let that = this
    let hfkey = '09fe7be8aaf1463487c0d2d800f24310'
    let url = 'https://api.heweather.net/s6/air/now?key=' + hfkey + '&location=' + this.location_pin
    wx.request({
      url: url,
      success: function (res) {
        //获取用户信息
        console.log(app.globalData.openid)
        let nowData = res.data;
        that.setData({
          quanlity:nowData.HeWeather6[0]
        })
      },
      fail: function (res) {

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
        console.log(app.globalData.openid)
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
  }
})
