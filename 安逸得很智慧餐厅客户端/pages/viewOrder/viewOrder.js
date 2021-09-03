// pages/viewOrder/viewOrder.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dishChosen: [],
    flag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let dc= []
    let j = 0
    wx.cloud.callFunction({
      name: 'orderUnloaded',
      success: res => {
        console.log('获取成功', res.result.data);
        this.setData({
          dishChosen: res.result.data
        })
        console.log(this.data.dishChosen.length);
        for(let i = this.data.dishChosen.length - 1; i >= 0; i--) {
          dc[j] = this.data.dishChosen[i]
          j++
        }
        this.setData({
          dishChosen: dc
        })
        console.log(this.data.dishChosen);
        if (this.data.dishChosen.length <= 0)
          this.setData({
            flag: 1
          })
      },
      fail: err => {
        console.log('获取失败', err);
      }
    })
  },

  returnCart() {
    wx.navigateTo({
      url: '../shoppingCart/shoppingCart',
    })
  },

  del_myOrder(e) {
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id
    wx.showModal({
      cancelColor: 'cancelColor',
      content: '是否删除此条订单~',
      showCancel: true,
      cancelText: '狠心删除',
      confirmText: '继续保留',
      success: (e) => {
        console.log(e);
        if (e.cancel) {
          // 删除订单
          wx.cloud.database().collection('myOrder')
            .doc(id)
            .remove()
            .then(res => {
              console.log('删除成功', res);
            }).catch(err => {
              console.log('删除失败, err');
            })

          for (let i in this.data.dishChosen)
            if (id == this.data.dishChosen[i]._id) {
              this.data.dishChosen.splice(i, 1)
              break
            }

          this.setData({
            dishChosen: this.data.dishChosen
          })

          if (this.data.dishChosen.length <= 0)
            this.setData({
              flag: 1
            })
        }
      }
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