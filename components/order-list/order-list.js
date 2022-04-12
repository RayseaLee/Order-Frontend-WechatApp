// components/order-list/order-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderInfo: {
      type: Object,
      value: {}
    },
    storeName: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    remainingTime: 60 * 15 * 1000
  },
  // observers: {
  //   'orderInfo.status': function(field) {
  //     // 使用 setData 设置 this.data.some.field 本身或其下任何子数据字段时触发
  //     // （除此以外，使用 setData 设置 this.data.some 也会触发）
  //     field === this.data.some.field
  //   },
  // },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateToIndex() {
      wx.switchTab({
        url: '../../pages/index/index'
      })
    },
    handleRemainingTime(startDate, currentTime) {
      return Date.parse(startDate) + 60 * 15 * 1000 - currentTime
    },
  },
  // attached() {
  //   console.log(this.properties.orderInfo.status);
  //   if (this.properties.orderInfo.status == '待支付') {
  //     const remainingTime = this.handleRemainingTime(this.properties.orderInfo.order_time, Date.now())
  //     console.log(remainingTime)
  //     if (remainingTime <= 0) {
  //       // this.setData({
  //       //   ['orderInfo.status']: '已取消'
  //       // })
  //       console.log('已取消')
  //     } else {
  //       this.setData({
  //         remainingTime: remainingTime
  //       })
  //       console.log(this.data.remainingTime)
  //     }
  //   }
  // }
})
