// index.js
// 获取应用实例
import { getSideBarInfo, getGoodsInfo, getStoreInfo, getCouponInfo } from '../../service/api'
// import _ from '../../node_modules/lodash'
const app = getApp()

Page({
  data: {
    // 分类列表
    cateList: [],
    // 商品列表
    goodsList: [],
    // 侧边栏
    activeKey: 0,
    // 离顶部的距离
    scrollTop: 0,
    scrollTo: 0,
    // 店铺信息
    storeInfo: {},
    // 店铺完整地址
    storeAddress: '',
    // 优惠信息
    couponInfo: ''
  },
  // 页面滚动回调
  onPageScroll(e) {
    console.log(e)
    this.setData({scrollTop: e.scrollTop})
  },
  // 侧边栏变化回调
  onSideChange(event) {
    console.log(event.detail)
    this.setData({activeKey: event.detail})
    wx.pageScrollTo({
      selector: `#cate-${event.detail}`,
      duration: 300,
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  // Tabs页变化回调
  onTabsChange() {
    if(this.data.scrollTop != 0) {
      console.log(this.data.scrollTop)
      wx.pageScrollTo({
        scrollTop: this.data.scrollTop,
        duration: 0
      })
    }
  },
  onPhoneCall() {
    wx.setClipboardData({
      data: this.data.storeInfo.phone,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  // 页面加载完成回调
  onLoad() {
    // 获取侧边栏信息
  //   this.API_getSideBarInfo()
  //   // 获取商品信息
  //   this.API_getAllGoods()
  },
  // 页面展示回调
  onShow: async function () {
    this.getTabBar().init()
    if(this.data.cateList.length == 0) {
      await this.API_getSideBarInfo()
    }
    if(this.data.goodsList == 0) {
      await this.API_getGoodsInfo()
    }
    this.API_getStoreInfo()
    this.API_getCouponInfo()
  },
  // 网络请求：获取侧边栏分类信息
  async API_getSideBarInfo() {
    await getSideBarInfo().then(res => {
      console.log(res)
      if(res.data.meta.status === 200) {
        this.setData({ cateList: res.data.data })
      }
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: err.errMsg,
        icon: 'none',
        duration: 2000
      })
    })
  },
  // 网络请求：获取商品信息
  async API_getGoodsInfo() {
    await getGoodsInfo().then(res => {
      console.log(res)
      if(res.data.meta.status === 200) {
        const goods = [...this.data.cateList]
        goods.forEach((item1, index) => {
          goods[index].goods = []
          res.data.data.forEach(item2 => {
          if(item2.category_id == item1.id) {
            goods[index].goods.push(item2)
          }
          })
        })
        console.log(goods)
        this.setData({ goodsList: goods })
      }
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: err.errMsg,
        icon: 'none',
        duration: 2000
      })
    })
  },
  // 网络请求:获取店铺信息
  API_getStoreInfo() {
    getStoreInfo().then(res => {
      console.log(res)
      const storeInfo = res.data.data
      if(res.data.meta.status === 200) {
        this.setData({
          storeInfo: storeInfo,
          storeAddress: storeInfo.province + storeInfo.city + storeInfo.county + storeInfo.address,
        })
      }
    })
  },
  API_getCouponInfo() {
    getCouponInfo().then(res => {
      console.log(res)
      if(res.data.meta.status === 200) {
        const data = res.data.data
        let coupon = ''
        data.forEach(item => {
          coupon = coupon + '满' + item.full + '减' + item.subtract + ';'
        })
        this.setData({couponInfo: coupon})
      }
    })
  }
})
