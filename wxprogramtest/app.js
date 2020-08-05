//app.js
App({
  globalData:{
  },
  onLaunch: function () {
    var that =this;
    var height_01="";
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        height_01 = res.windowHeight;
      },
    })
    console.log(height_01);
    this.globalData.height_01=height_01;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://www.nchusoftware.online:8888/getopenid',
          data: {
            "code": res.code
          },
          method:"GET",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
          , success: res => {
            console.log(res.data)
            if (res.statusCode == 200) {
              this.globalData.openid = res.data
              console.log(this.globalData.openid)
            }
          },
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})