// app.js
// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // console.log('云开发环境初始化');
    wx.cloud.init({
      env: 'environ-8g9wp9ky3263ad53'
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    // wx.cloud.database().collection('dish').get()
    //   .then(res => {
    //       console.log('获取菜品成功', res);
    //       this.setData({
    //         dish_group: res.data
    //       })
    //     console.log(this.globalData.dish_group);
    //   })
    //   .catch(err => {
    //       console.log('获取菜品失败', err);
    //   })
    
  },

  globalData: {
    userInfo: null,
    dish_group: [],
    g_userInfo: null
  }
})

