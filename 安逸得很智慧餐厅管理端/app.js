// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

     // console.log('云开发环境初始化');
     wx.cloud.init({
      env: 'environ-8g9wp9ky3263ad53'
    })
  },
  globalData: {
    userInfo: null,
    mp3Src: 'cloud://environ-8g9wp9ky3263ad53.656e-environ-8g9wp9ky3263ad53-1305688421/mp3/您有新的订单，请注意查收.mp3'
  }
})
