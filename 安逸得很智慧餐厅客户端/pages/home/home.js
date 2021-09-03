// pages/home/home.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 获取用户信息
  get_UserInfo(e) {
    let flag = e.target.dataset.id
    wx.getUserProfile({
      desc: '正在获取',
      success: res => {
        console.log(res.userInfo);
        app.globalData.g_userInfo = res.userInfo
        console.log(app.globalData.g_userInfo);
        let info = res.userInfo;
        //本地缓存
        wx.setStorageSync('user', info);
        this.setData({
          user_info: info,
          isShowBtn: false
        })
        // 到店扫码
        if(flag==1)
        wx.scanCode({
          onlyFromCamera: true,
          success: res => {
            console.log(res);
          }
        })
        // 提前预点
        else wx.navigateTo({
          url: '/pages/order/order',
        })
      },
      fail: err => {
        console.log('获取失败', err);
      },
    })
  },

  //拍照功能
  // takePhoto() {
  //   wx.navigateTo({
  //     url: '/pages/shoot/shoot',
  //   })
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})