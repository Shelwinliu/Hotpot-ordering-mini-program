// pages/log_in/log_in.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account_text: null,
    password_text: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.hideTabBar({
    //  animation: false
    // })
  },

  // 获取账号输入框的内容
  input_text1(e) {
    // console.log(e.detail.value);
    this.data.account_text = e.detail.value
    // console.log(this.data.account_text);
  },

  // 获取密码输入框的内容
  input_text2(e) {
    // console.log(e.detail.value);
    this.data.password_text = e.detail.value
  },

  // 验证输入的账号密码是否正确
  verify() {
    wx.cloud.database().collection('adminInfo').get()
      .then(res => {
        console.log(res.data);
        console.log(res.data[0].account);

        let flag = 0
        for (let i in res.data) {
          if (this.data.account_text == res.data[i].account && this.data.password_text == res.data[i].password) {
            flag = 1;
            wx.switchTab({
              url: '/pages/resManage/resManage',
            })
            console.log('登录成功');
            break;
          }
          else if(this.data.account_text == null || this.data.password_text == null) {
            flag =1;
            wx.showModal({
              content: '账号或密码不能为空',
              showCancel: false
            })
            break
          }
        }
        if (flag == 0) wx.showModal({
          content: '账号或密码错误，请重新输入',
          showCancel: false
        })
      }).catch(err => {
        console.log(err.data);
      })
  },

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