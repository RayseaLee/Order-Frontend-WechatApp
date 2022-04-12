// app.js
import Toast from './miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from './miniprogram_npm/@vant/weapp/dialog/dialog';
import {checkToken} from './service/api'
App({
  globalData: {
    navHeight: 0  // 声明一个全局变量用于记录小程序头部的高度
  },
  onLaunch() {
    wx.getSystemInfo({
        success: res => {
          this.globalData.navHeight = res.statusBarHeight + 46; // 赋值导航高度
        }, fail(err) {
        console.log(err);
      }
    })
  },
  onShow() {
    this.login().then(res => {
      console.log('code:' + res)
      this.globalData.code = res
    }).catch(err => {
      wx.showToast({
        title: err.message,
        duration: 1000
      })
    })
  },
  login() {
    return new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            const code = res.code
            resolve(code)
          },
          fail: err => {
            reject(err)
          }
        })
    })
  },
  async checkToken() {
    const hasToken = wx.getStorageSync("token")
    if (!hasToken) {
      this.toAuthLogin()
      return
    } else {
      const res = await checkToken()
      const {status} = res.data.meta
      if (status !=  200) {
        this.toAuthLogin()
        return
      } else {
        return 'TokenCheckSuccess'
      }
    }
  },
  // 跳转登录页
  toAuthLogin() {
    Dialog.confirm({
      title: '登录',
      message: '请先授权登录',
      zIndex: 10001
    }).then(() => {
      wx.navigateTo({
        url: '../authLogin/authLogin',
        success: res => {
          console.log(res)
        },
        fail: err => {
          console.log(err)
        }
      })
    }).catch(() => {
      Toast({
        message: '已取消',
        position: 'bottom',
        zIndex: 10001
      })
    })
  },
})

