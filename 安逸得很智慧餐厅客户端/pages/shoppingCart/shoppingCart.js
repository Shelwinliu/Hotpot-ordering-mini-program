// pages/shoppingCart/shoppingCart.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dish_group: [],
    dish_type: 0,
    totalAmount: 0,
    userInfo: null,
    remark: null,
    dishChosen: [],
    orderTime: null,
    flag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 全局变量赋值
    this.setData({
      dish_group: app.globalData.dish_group,
      userInfo: app.globalData.g_userInfo
    })
    console.log(this.data.userInfo);

    let dg = this.data.dish_group
    let type = 0
    let amount = 0

    for (let i in dg) {
      if (dg[i].quantity > 0) {
        type++
        amount += dg[i].quantity * dg[i].dish_price
      }
    }
    console.log(dg);
    // 控制支付功能是否能使用
    if(type > 0) this.setData({
      flag: 1
    })

    this.setData({
      dish_type: type,
      totalAmount: amount,
      dishChosen: this.data.dishChosen
    })
  },

  // 清空所选菜品
  cleanUp(e) {
    console.log(this.data.dish_group);
    wx.showModal({
      cancelColor: 'cancelColor',
      content: '挑了好久，全都不要了吗~',
      showCancel: true,
      cancelText: '狠心删除',
      confirmText: '继续保留',
      success: (e) => {
        console.log(e);
        if (e.cancel) {
          this.setData({
            dish_group: null,
            dish_type: 0,
            totalAmount: 0,
            dishChosen: null,
            flag: 0
          })
          // 修改全局变量的quantity
          for (let i in app.globalData.dish_group)
            app.globalData.dish_group[i].quantity = 0

        }
      }
    })

  },

  /* 点击减号 */
  bindMinus(e) {
    let dg = this.data.dish_group
    console.log(dg);
    // console.log(e.target.dataset.item._id);
    let type = 0
    let amount = 0
    for (let i in dg) {
      if (dg[i]._id == e.target.dataset.item._id && dg[i].quantity > 0) {
        dg[i].quantity--;
      }
      if (dg[i].quantity > 0) {
        // 更新菜品道数以及总价格
        type++
        amount += dg[i].quantity * dg[i].dish_price
        console.log(this.data.dish_type);
      }
    }

    // 将数值与状态写回  
    this.setData({
      dish_group: dg,
      dish_type: type,
      totalAmount: amount,
    });
    if(type == 0) this.setData({
      flag: 0
    })
    // 将进行增删操作后的新数据赋值给全局数组
    app.globalData.dish_group = dg

  },

  /* 点击加号 */
  bindPlus(e) {
    let amount = 0
    let dg = this.data.dish_group
    for (let i in this.data.dish_group) {
      if (dg[i]._id == e.target.dataset.item._id) {
        dg[i].quantity += 1;
        // this.data.curDishNum ++
      }
      if (dg[i].quantity > 0)
        amount += dg[i].quantity * dg[i].dish_price
    }

    // 将数值与状态写回  
    this.setData({
      dish_group: dg,
      totalAmount: amount
      // curDishNum: this.data.curDishNum
    });

    app.globalData.dish_group = dg

  },

  // 用户留言
  inputRemark(e) {
    console.log(e.detail.value);
    this.data.remark = e.detail.value
    console.log(this.data.remark);
  },

  // 返回点单页
  returnOrder() {
    wx.navigateTo({
      url: '../order/order',
    })
  },

  // 用户支付订单后系统自动上传订单信息
  uploadOrder() {
    // 检测购物车是否有商品,没有商品则不能提交订单
    if(this.data.flag) {
      // 获取下单时间
    let date = new Date()
    this.data.orderTime = date.getFullYear() + '年' + parseInt(date.getMonth() + 1) + '月' + date.getDate() + '日' + date.getHours() + '时' + date.getMinutes() + '分'
    console.log(this.data.orderTime);

    let dg = this.data.dish_group
    let j = 0
    // 判断是否已选择锅底
    let flag = 0
    for (let i in dg) {
      if (dg[i].quantity > 0) {
        this.data.dishChosen[j] = dg[i]
        j++;
        if (dg[i].dishClassify == '锅底（必点）')
          flag = 1
      }
    }
    console.log(this.data.dishChosen);

    if (flag) {
      this.storage('orderInfo')
      this.storage('myOrder')
    }
    else wx.showModal({
      cancelColor: 'cancelColor',
      title: '您还未点锅底',
      content: '请返回点单页选择锅底',
      confirmText: '留在此页',
      cancelText: '返回点单',
      showCancel: true,
      success: (e) => {
        if (e.cancel) this.returnOrder()
      }
    })
    }
  },

  // 将订单信息存储到数据库中
  storage(databaseName) {
    wx.cloud.database().collection(databaseName)
        .add({
          data: {
            diner_name: this.data.userInfo.nickName,
            orderList: this.data.dishChosen,
            remark: this.data.remark,
            totalPrice: this.data.totalAmount,
            orderTime: this.data.orderTime,
          }
        }).then(res => {
          console.log('上传成功', res.data);
          if(databaseName == 'orderInfo')
          wx.showToast({
            title: '支付成功',
          })
          this.setData({
            dish_group: null,
            dish_type: 0,
            totalAmount: 0,
            flag: 0
          })
          // 修改全局变量的quantity
          for (let i in app.globalData.dish_group)
            app.globalData.dish_group[i].quantity = 0
        }).catch(err => {
          console.log('上传失败', err.data);
        })
  },

  // 查看订单
  check() {
      wx.navigateTo({
      url: '../viewOrder/viewOrder',
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
