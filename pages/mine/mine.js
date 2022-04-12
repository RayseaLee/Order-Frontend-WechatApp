//index.js
//获取应用实例
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
import { checkToken } from '../../service/api';
Page({
  data: {
    userInfo: {},
    hasUserInfo: false
  },
  onLoad() {
    Toast.loading({
      message: '加载中...', 
      forbidClick: true,
      loadingType: 'spinner',
      duration: 500
    });
  },
  async onShow () {
    this.getTabBar().init();
    const res = await checkToken()
    const {status} = res.data.meta
    if (status != 200) {
      this.setData({
        userInfo: {},
        hasUserInfo: false
      })
    } else {
      this.setData({
        userInfo: wx.getStorageSync('user'),
        hasUserInfo: true
      })
    }
  },
  //退出登录
  quit: function() {
    try {
      wx.removeStorageSync('token')
      wx.removeStorageSync('user')
      this.setData({
        userInfo: {},
        hasUserInfo: false,
      })
      wx.showToast({
        title: '退出登录',
        icon: 'none',
        duration: 1000
      })
    } catch (e) {
      console.log(e);
    }
  },
})