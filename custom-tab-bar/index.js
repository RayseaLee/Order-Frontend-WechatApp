// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 0,
    list: [
      {
        text:"首页",
        url:"/pages/index/index",
        icon: 'wap-home-o'
      },
      {
        text:"订单",
        url:"/pages/order/order",
        icon: 'orders-o'
      },
      {
        text:"购物车",
        url:"/pages/cart/cart",
        icon: 'cart-o'
      },
      {
        text:"我的",
        url:"/pages/mine/mine",
        icon: 'user-o'
      },
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      wx.switchTab({
        url: this.data.list[event.detail].url,
      })
      // event.detail 的值为当前选中项的索引
      this.setData({ active: event.detail });
    },
    init() {
      const page = getCurrentPages().pop();
      this.setData({
      　 active: this.data.list.findIndex(item => item.url === `/${page.route}`)
      });
    }
  }
})
