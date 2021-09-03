// pages/order/order.js
let app = getApp()
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dish_group: [],
    curNav: 1,
    curDishNum: 0,
    dish_value: 0,//初始数量
    dish_id: 0,
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      wx.hideLoading({
        success: (res) => { },
      })
    }, 2000);
    // 获取轮播图
    this.get_carouselList()
    // 获取菜品
    this.get_dishList()
  },

  // 获取轮播图
  get_carouselList() {
    wx.cloud.database().collection('carousel').get()
      .then(res => {
        console.log('获取轮播图成功', res);
        this.setData({
          graph: res.data
        })
      })
  },

  // 获取并显示菜单信息
  get_dishList() {
    wx.cloud.callFunction({
      name: 'get_dishData',
      success: res => {
        console.log('获取成功', res.result.data);
        // 通过云函数获取菜品信息
        this.setData({
          dish_group: res.result.data
        })
        // 记录用户选择加入购物车的不同菜品数量
        for (let i in this.data.dish_group) {
          this.data.dish_group[i].quantity = 0
        }

        // 全局变量赋值
        // 第一次进入点单页，未进行购物车的删减操作
        if (app.globalData.dish_group.length == 0)
          app.globalData.dish_group = this.data.dish_group
        else {
          // 计算全局数组中quantity总数，当用户从购物车进行删减操作后返回点单页时要对购物车图标右上角的数字进行刷新
          let dishNum = 0
          for (let i in app.globalData.dish_group)
            dishNum += app.globalData.dish_group[i].quantity
          // 当用户从购物车进行删减操作后返回点单页时要对dish_group进行刷新
          this.setData({
            dish_group: app.globalData.dish_group,
            curDishNum: dishNum
          })
        }
      },
      fail: err => {
        console.log('获取菜单失败', err);
      }
    })
  },

  // 左侧分类栏点击事件
  switchRightTab(e) {
    let id = e.target.dataset.id;
    // console.log(id);
    this.setData({
      curNav: id
    })
  },

  // 进入搜索页面
  searchDish() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  // 进入购物车页面
  enterMall() {
    wx.navigateTo({
      url: '/pages/shoppingCart/shoppingCart',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /* 点击减号 */
  bindMinus: function (e) {
    for (let i in this.data.dish_group) {
      if (this.data.dish_group[i]._id == e.target.dataset.item._id && this.data.dish_group[i].quantity > 0) {
        // 同时改变选择菜品的数量和购物车数量
        this.data.dish_group[i].quantity -= 1;
        this.data.curDishNum--
      }

    }
    // 将数值与状态写回  
    this.setData({
      dish_group: this.data.dish_group,
      curDishNum: this.data.curDishNum
    });

  },

  /* 点击加号 */
  bindPlus: function (e) {
    for (let i in this.data.dish_group) {
      if (this.data.dish_group[i]._id == e.target.dataset.item._id) {
        // 同时改变选择菜品的数量和购物车数量
        this.data.dish_group[i].quantity += 1;
        this.data.curDishNum++
      }
    }
    // 将数值与状态写回  
    this.setData({
      dish_group: this.data.dish_group,
      curDishNum: this.data.curDishNum
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (getCurrentPages().length != 0) {
      //刷新当前页面的数据
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }
  },

  // 测试滚动条距离，使分类栏固定
  onPageScroll(e) {
    // console.log(e.scrollTop)
    this.setData({
      scrollTop: e.scrollTop
    })
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