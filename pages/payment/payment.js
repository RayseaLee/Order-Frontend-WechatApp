// pages/payment/payment.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {createOrder} from '../../service/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartInfo: [],
    cartNum: 0,
    totalPrice: 0,
    remark: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Toast.loading({
      message: '加载中...', 
      forbidClick: true,
      loadingType: 'spinner',
      duration: 500
    });
    const eventChannel = this.getOpenerEventChannel()
    // eventChannel.emit('acceptDataFromOpenedPage', {data: 'test'});
    // eventChannel.emit('someEvent', {data: 'test'});
    eventChannel.on('orderInfoPage', (data) => {
      console.log(data)
      this.setData({
        cartInfo: data.cartInfo,
        cartNum: data.cartNum,
        totalPrice: data.totalPrice
      })
    })
  },
  handleBlur(event) {
    this.setData({
      remark: event.detail.value
    })
  },
  handlePay() {
    Dialog.confirm({
      title: '提示',
      message: '确认支付？',
      zIndex: 10001
    }).then(() => {
      this.emitOrderStatus()
      this.API_createOrder('进行中')
    }).catch(() => {
      Toast({
        message: '已取消',
        position: 'bottom',
        zIndex: 10001
      })
      this.emitOrderStatus()
      this.API_createOrder('待支付')
    })
  },
  API_createOrder(status) {
    const goodsInfo = []
    this.data.cartInfo.forEach(item => {
      goodsInfo.push({
        good_id: item.id,
        name: item.name,
        goodsPics: [
          {
            pic_url: item.url
          }
        ],
        number: item.num,
        params: item.params || '',
        unit_price: item.price,
        total_price: item.price*item.num
      })
    })
    createOrder({
      total_price: this.data.totalPrice,
      discount_price: 0,
      deal_price: this.data.totalPrice,
      number: this.data.cartNum,
      remark: this.data.remark,
      status,
      goodsInfo: goodsInfo
    }).then(result => {
      const data = {
        ...result.data.data.orderInfo,
        goodsInfo: goodsInfo
      }
      wx.navigateTo({
        url: '../orderDetail/orderDetail',
        success: res => {
          res.eventChannel.emit('orderInfoDetail', data)
        },
        fail: err => {
          console.log(err)
        }
      })
      console.log(data)
    }).catch(err => {
      Toast(err)
      wx.navigateBack({
        delta: 1
      })
      console.log(err)
    })
  },
  // 向首页发送订单状态信息
  emitOrderStatus() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('haveOrder', {opr: 'clear'})
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