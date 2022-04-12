// pages/order.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {getOrderInfo} from '../../service/api'
const app = new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: [],
    tabIndex: 0,
    trigger: false,
    queryList: {
      0: '',
      1: '进行中',
      2: '待支付',
      3: '已完成',
      4: '已取消'
    },
    storeInfo: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    Toast.loading({
      message: '加载中...', 
      forbidClick: true,
      loadingType: 'spinner',
      duration: 800
    });
    this.setData({
      storeInfo: wx.getStorageSync('storeInfo')
    })
  },

  // tabs页改变
  onTabsChange(event) {
    this.setData({
      tabIndex: event.detail.index
    })
    console.log('tabsChange');
    this.handleRefresh()
  },
  // 下拉刷新
  handleRefresh() {
    this.setData({
      trigger: true
    })
    console.log('handleRefresh');
    this.API_getOrderInfo(this.data.tabIndex)
  },
  orderDetail(e) {
    wx.navigateTo({
      url: '../orderDetail/orderDetail',
      success: res => {
        res.eventChannel.emit('orderInfoDetail', e.target.dataset.orderinfo)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  API_getOrderInfo(tabIndex) {
    getOrderInfo({
      status: this.data.queryList[tabIndex],
      pageSize: '',
      pageNum: ''
    }).then(res => {
      console.log(res)
      if(res.data.meta.status == 200) {
        this.setData({
          orderInfo: res.data.data.orders
        })
      }
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      this.setData({
        trigger: false
      })
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
  async onShow() {
    this.getTabBar().init()
    await app.checkToken()
    this.API_getOrderInfo(this.data.tabIndex)
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
})