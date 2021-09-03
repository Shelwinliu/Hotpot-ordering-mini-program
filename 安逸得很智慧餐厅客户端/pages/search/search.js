// pages/search/search.js
let searchVal = null
let app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_dish: [],
    dish_group: [],
    dish_value: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  input_text(e) {
    searchVal = e.detail.value
    this.setData({
      search_text: e.detail.value,
      dish_group: app.globalData.dish_group
    })
    if (searchVal && searchVal.length > 0) {
      db.collection('dish').where({
        dish_name: db.RegExp({
          regexp: '.*' + searchVal,
          options: 'i'
        })
      }).get()
        .then(res => {
          console.log(res.data);
          this.setData({
            search_dish: res.data
          })
          for (let i in this.data.search_dish)
            this.data.search_dish[i].quantity = 0

          let sd = this.data.search_dish
          for (let i in app.globalData.dish_group)
            for (let j in sd)
              if (sd[j]._id == app.globalData.dish_group[i]._id)
                sd[j].quantity = app.globalData.dish_group[i].quantity

          this.setData({
            search_dish: sd
          })
        })
        .catch(err => {
          console.log(err.data);
        })
    }
    else {
      this.setData({
        search_dish: null
      })
      wx.showToast({
        icon: 'none',
        title: '搜索词为空',
      })
    }
  },

  // 删除所输入的内容
  clear_search(e) {
    let search_text = this.data.search_text
    this.setData({
      search_text: '',
      clearsearch: false
    })
  },

  // 返回菜单
  returnMenu(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },

  /* 点击减号 */
  bindMinus: function (e) {
    let sd = this.data.search_dish
    for (let i in sd) {
      if (sd[i]._id == e.target.dataset.item._id && sd[i].quantity > 0) {
        sd[i].quantity -= 1;
        // 将进行增删操作后的新数据赋值给全局数组
        for (let j in app.globalData.dish_group)
          if (app.globalData.dish_group[j].dish_name == sd[i].dish_name)
            app.globalData.dish_group[j].quantity = sd[i].quantity
      }
    }

    // 将数值与状态写回  
    this.setData({
      search_dish: sd,
    });

  },

  /* 点击加号 */
  bindPlus: function (e) {
    console.log(e);
    let sd = this.data.search_dish
    for (let i in sd) {
      if (sd[i]._id == e.target.dataset.item._id) {
        sd[i].quantity += 1;
        // 将进行增删操作后的新数据赋值给全局数组
        for (let j in app.globalData.dish_group)
          if (app.globalData.dish_group[j].dish_name == sd[i].dish_name)
            app.globalData.dish_group[j].quantity = sd[i].quantity
      }
    }

    // 将数值与状态写回  
    this.setData({
      search_dish: sd,
    });

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