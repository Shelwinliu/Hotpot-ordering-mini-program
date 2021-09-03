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
      name: 'get_finishedOrder',
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
    let flag
    let ds_unfinshed = []
    let i = 0

    wx.cloud.database().collection('orderFinished').watch({
      onChange: snapshot => {
        // 监控数据发生变化时触发
        console.log('docs\'s changed events', snapshot.docChanges)
        console.log('query result snapshot after the event', snapshot.docs)
        console.log('is init data', snapshot.type === 'init')

        console.log(this.data.dishChosen.length);
        console.log(Object.keys(snapshot.docs).length);

        // 只有增加新订单时才会有提示音
        if (snapshot.docChanges && snapshot.docChanges.length > 0) {
          console.log(snapshot.docs);
          // 新完成的订单
          this.setData({
            dishChosen: snapshot.docs
          })

          if(this.data.dishChosen.length == 0) {
            this.setData({
              animate: 1,
              roc: 0
            })
          }
        
          console.log(this.data.dishChosen);
          if (this.data.dishChosen.length != 0)
                  this.setData({
                    animate: 0,
                    roc: 1
                  })
        }
      },
      onError: (err) => {
        console.error(err)
      }
    })
  },

  // 删除已完成的订单
  del(e) {
    let ds = this.data.dishChosen
    console.log(e.target.dataset.id);
    let id = e.target.dataset.id

    wx.showModal({
      cancelColor: 'cancelColor',
      content: '确定要删除这条订单信息吗',
      confirmText: '确定',
      cancelText: '取消',
      success: (e) => {
        if(!e.cancel) {
          for(let i in ds)
          if(ds[i]._id == id) {
            ds.splice(i, 1)
            // 更新数组
            this.setData({
              dishChosen: ds
            })
            // 更新数据库
            wx.cloud.database().collection('orderFinished')
            .doc(id)
            .remove()
          }
          // 更新动画状态
          if(ds.length == 0) {
            this.setData({
              animate: 1,
              roc: 0
            })
          }
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