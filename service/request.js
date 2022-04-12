const app = getApp();
import {hostName} from '../config/config.default'

const request = config => {
  wx.showNavigationBarLoading()
  config = {
    ...config,
    url: hostName + config.url,
    header: {
      Authorization: 'Bearer ' + wx.getStorageSync("token") || '',
    }
  }
  const result = new Promise((resolve, reject) => {
    wx.request({
      success: res => {
        wx.hideNavigationBarLoading()
        resolve(res)
      },
      fail: error => {
        wx.hideNavigationBarLoading()
        reject(error)
      },
      ...config
    })
  })
  return result
}

export default request