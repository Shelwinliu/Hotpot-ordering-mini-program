

#  									                                        详细设计说明

## 1. 功能概述

​		“安逸得很”点餐小程序分为管理员端和用户端。管理员端可实现订单管理、员工管理、菜品管理、库存管理、财务管理、餐厅基本信息管理、餐桌管理的功能；用户端可实现用户一键授权登录、点单（分为到店点单和预约点单）、购物车管理、结账、查看订单、购买代金券的功能。



## 2.  功能模块 ##

![image-20210514182257828.png](https://i.loli.net/2021/05/15/5SYKwvyBgcCdP41.png)



## 3.  部分功能概述及代码片段 ##

### 3.1 将数据库的菜单信息在界面上显示 

![image-20210514184108356.png](https://i.loli.net/2021/05/15/tVAeRrT7q2mOncl.png)

```
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
```



### 3.2 对购物车中菜品进行增删操作并显示在购物车界面

![image-20210515013737849.png](https://i.loli.net/2021/05/15/kKTfEUBZudzlV9Q.png)



```javascript
// pages/order/order.js
/* 删除指定的购物车菜品 */
  bindMinus: function (e) {
    for (let i in this.data.dish_group) {
      if (this.data.dish_group[i]._id == e.target.dataset.item._id && this.data.dish_group[i].quantity > 0) {
        // 同时改变选择菜品的数量和购物车数量
        this.data.dish_group[i].quantity -= 1;
        this.data.curDishNum --
      }

    }
    // 将数值与状态写回  
    this.setData({
      dish_group: this.data.dish_group,
      curDishNum: this.data.curDishNum
    });

  },

  /* 添加菜品到购物车 */
  bindPlus: function (e) {
    for (let i in this.data.dish_group) {
      if (this.data.dish_group[i]._id == e.target.dataset.item._id) {
        // 同时改变选择菜品的数量和购物车数量
        this.data.dish_group[i].quantity += 1;
        this.data.curDishNum ++
      }
    }
    // 将数值与状态写回  
    this.setData({
      dish_group: this.data.dish_group,
      curDishNum: this.data.curDishNum
    });
  },
      
--------------------------------------------------------------------------

// pages/shoppingCart/shoppingCart.js
/* 将所选菜品添加至购物车 */
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

    this.setData({
      dish_type: type,
      totalAmount: amount,
      dishChosen: this.data.dishChosen
    })
  },
```



### 3.3 管理端随时监听用户提交的新订单

![image-20210515013856728.png](https://i.loli.net/2021/05/15/HtsWNEPjZA15D76.png)

```javascript
// pages/shoppingCart/shoppingCart.js
// 用户支付订单后系统自动上传订单信息
  uploadOrder() {
    // 获取下单时间
    let date = new Date()
    let orderTime = date.getFullYear() + '年' + parseInt(date.getMonth() + 1) + '月' + date.getDate() + '日' + date.getHours() + '时' + date.getMinutes() + '分'
    console.log(orderTime);

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
      wx.cloud.database().collection('orderInfo')
        .add({
          data: {
            diner_name: this.data.userInfo.nickName,
            orderList: this.data.dishChosen,
            remark: this.data.remark,
            totalPrice: this.data.totalAmount,
            orderTime: orderTime,
          }
        }).then(res => {
          console.log('上传成功', res.data);
          wx.showToast({
            title: '支付成功',
          })
        }).catch(err => {
          console.log('上传失败', err.data);
        })
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
  },
      
------------------------------------------------------------------  
      
// pages/resManage/resManage.js
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
```



## 4. To-do List

- [x] 已完成项目1

  用户端可实现用户一键授权登录、点单（分为到店点单和预约点单）、购物车管理、结账的功能。

- [x] 已完成项目2

  管理员端暂时只能实现查看新订单、更改订单状态以及删除已完成订单的功能

- [ ] 待办事项1

  用户端需完善个人中心功能，使用户能查看历史订单

- [ ] 待办事项2

  管理员端最好能添加订单修改和管理员工的功能