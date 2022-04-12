// pages/orderDetail/orderDetail.js
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { updateOrderStatus } from '../../service/api';
import { formatTime } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    storeInfo: {},
    storeAddress: '',
    // latitude: 27.898258,
    // longitude: 112.920678,
    // distance: '',
    isCollapse: true,
    remainingTime: 900000,
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
    // TODO 需要一定权限才能调用该接口
    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success (res) {
    //     const distance = this.getDistance(res.latitude, res.longitude, this.data.latitude, this.data.longitude)
    //     this.setData({
    //       distance
    //     })
    //     console.log(this.data.distance);
    //   }
    //  })
    this.setData({
      storeInfo: wx.getStorageSync('storeInfo'),
      storeAddress: wx.getStorageSync('storeAddress')
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        navH: app.globalData.navHeight // 给刚刚声明的变量附上全局获取的nav高度
      })
      wx.hideLoading()
    }, 1000)
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('orderInfoDetail', (data) => {
      data.order_time = formatTime(new Date(Date.parse(data.order_time)))
      this.setData({ orderInfo: data })
      if(this.data.orderInfo.status == '待支付') {
        const remainingTime = this.handleRemainingTime(this.data.orderInfo.order_time, Date.now())
        if (remainingTime <= 0) {
          this.timeFinish()
        } else {
          this.setData({
            remainingTime: remainingTime
          })
        }
      }
    })
  },
  navigateToIndex() {
    wx.switchTab({
      url: '../../pages/index/index'
    })
  },
  timeFinish() {
    const finish_time = formatTime(new Date(Date.parse(this.data.orderInfo.order_time) + 60 * 15 * 1000))
    this.API_updateOrderStatus(finish_time, '已取消')
  },
  handleRemainingTime(startDate, currentTime) {
    return Date.parse(startDate) + 60 * 15 * 1000 - currentTime
  },
  getLocation() {
    wx.openLocation({
      latitude: 27.898258,
      longitude: 112.920678,
      name: this.data.storeInfo.name,
      address: this.data.storeAddress,
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  changeCollapse() {
    this.setData({
      isCollapse: !this.data.isCollapse
    })
  },
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.storeInfo.phone,
      success(res) {
        console.log(res)
      },
      fail(err) {
        Toast('已取消')
      }
    })
  },
  goBack() {
    wx.switchTab({
      url: '../order/order'
    })
  },
  // 取消订单
  cancelOrder() {
    const finish_time = formatTime(new Date())
    this.API_updateOrderStatus(finish_time, '已取消')
  },
  // 确认支付
  confirmPay(){
    this.API_updateOrderStatus(null, '进行中')
  },
  API_updateOrderStatus(finish_time, status) {
    updateOrderStatus({
      id: this.data.orderInfo.id,
      status,
      finish_time
    }).then(res => {
      console.log(res)
      const {status, finish_time} = res.data.data
      this.setData({
        ['orderInfo.status']: status,
        ['orderInfo.finish_time']: formatTime(new Date(Date.parse(finish_time)))
      })
    }).catch(err => {
      console.log(err)
      Toast(err)
    })
  },

  // /**
  //  * 
  //  * @param {*用户的纬度} lat1
  //  * @param {*用户的经度} lng1
  //  * @param {*商家的纬度} lat2
  //  * @param {*商家的经度} lng2
  //  * @retrun 两点的距离
  //  */
  // getDistance(lat1, lng1, lat2, lng2) {
  //   var radLat1 = this.Rad(lat1);
  //   var radLat2 = this.Rad(lat2);
  //   var a = radLat1 - radLat2;
  //   var b = this.Rad(lng1) - this.Rad(lng2);
  //   var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  //   s = s * 6378.137;
  //   s = Math.round(s * 10000) / 10000;
  //   s = s.toFixed(2) + 'km' //保留两位小数
  //   console.log('经纬度计算的距离:' + s)
  //   return s
  // },

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
})