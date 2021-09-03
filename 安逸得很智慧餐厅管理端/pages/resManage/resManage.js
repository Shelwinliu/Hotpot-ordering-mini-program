// pages/resManage/resManage.js
// 音频信息
let app = getApp()
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.loop = true
innerAudioContext.src = app.globalData.mp3Src
let isPlaying = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dishChosen: [],
    animate: 1,
    roc: 0,
    flag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取订单信息
    this.getOrderInfo()
    //监听新订单
    this.watchOrder()
  },

  // 获取订单信息
  getOrderInfo() {
    wx.cloud.callFunction({
      name: 'get_orderInfo',
      success: res => {
        console.log('获取成功', res.result.data);

        this.setData({
          dishChosen: res.result.data
        })
        console.log(this.data.dishChosen);

        if (this.data.dishChosen.length != 0) {
          this.setData({
            animate: 0,
            roc: 1
          })
        }

        console.log(this.data.dishChosen);
      },
      fail: err => {
        console.log('获取失败', err);
      }
    })
  },

  // 实时监听是否存在新订单
  watchOrder() {
    // flag用来判断是否重复弹出订单提示框
    let flag
    wx.cloud.database().collection('orderInfo').watch({
      onChange: snapshot => {
        // 监控数据发生变化时触发
        console.log('docs\'s changed events', snapshot.docChanges)
        console.log('query result snapshot after the event', snapshot.docs)
        console.log('is init data', snapshot.type === 'init')

        console.log(this.data.dishChosen.length);
        console.log(Object.keys(snapshot.docs).length);

        // 新订单为空时，重新加载动画
        if (this.data.dishChosen.length == 0) {
          this.setData({
            animate: 1,
            roc: 0
          })
        }

        // 只有增加新订单时才会有提示音
        if (snapshot.docChanges && snapshot.docChanges.length > 0 && Object.keys(snapshot.docs).length > this.data.dishChosen.length) {
          console.log(snapshot.docs);
          // 存储制作未完成的订单
          this.setData({
            dishChosen: snapshot.docs
          })

          // 判断是否隐藏已完成的订单
          console.log(this.data.dishChosen);

          console.log('有新用户下单');
          innerAudioContext.seek(0)
          innerAudioContext.play()
          innerAudioContext.onPlay(() => {
            console.log('开始播放');
            isPlaying = true
          })
          if (!flag) {
            flag = true
            wx.showModal({
              title: '有新订单！',
              content: '新订单来啦，请及时制作',
              showCancel: false,
              success: (e) => {
                if (e.confirm) {
                  innerAudioContext.stop()
                  isPlaying = false,
                    flag = false
                  if (this.data.dishChosen.length != 0)
                    this.setData({
                      animate: 0,
                      roc: 1
                    })
                }
              }
            })
          }
        }
      },
      onError: (err) => {
        console.error(err)
      }
    })
  },

  // 制作完成
  finished(e) {
    console.log(e.target.dataset.id);
    let id = e.target.dataset.id
    let ds = this.data.dishChosen
    // 存储已完成的订单
    let df = []

    wx.showModal({
      cancelColor: 'cancelColor',
      content: '是否已制作完成',
      showCancel: true,
      cancelText: '否',
      confirmText: '是',
      success: (e) => {
        console.log(e);
        if (!e.cancel) {
          // 更新火箭动画
          if (this.data.dishChosen.length != 0)
            this.setData({
              animate: 0,
              roc: 1
            })

          // 完成时间
          let date = new Date()
          let finishTime = date.getFullYear() + '年' + parseInt(date.getMonth() + 1) + '月' + date.getDate() + '日' + date.getHours() + '时' + date.getMinutes() + '分'

          // 隐藏已完成的订单
          for (let i in ds)
            if (ds[i]._id == id) {
              ds[i].hide = 1
              // 添加到已完成订单
              wx.cloud.database().collection('orderFinished')
                .add({
                  data: {
                    diner_name: ds[i].diner_name,
                    orderList: ds[i].orderList,
                    remark: ds[i].remark,
                    totalPrice: ds[i].totalPrice,
                    finishTime: finishTime
                  }
                })
              // 更新ds数组
              ds.splice(i, 1)
            }

          // 删除已完成的订单
          wx.cloud.database().collection('orderInfo')
            .doc(id)
            .remove()
            .then(res => {
              console.log('删除成功', res);
            }).catch(err => {
              console.log('删除失败, err');
            })

          // 更新dishChosen数组
          this.setData({
            dishChosen: ds,
          })

          console.log(this.data.dishChosen);
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
    innerAudioContext.src = app.globalData.mp3Src
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