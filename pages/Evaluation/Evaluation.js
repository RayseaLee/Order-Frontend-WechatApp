// pages/Evaluation/Evaluation.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { createEvaluation } from '../../service/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeName: '',
    orderInfo: {},
    scoreValue: 5,
    textValue: '',
    checked: false,
    scoreList: {
      1: '超烂啊，太差了',
      2: '味道有点差',
      3: '中规中矩嘛',
      4: '不错，值得推荐',
      5: '太赞了，强力推荐'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    Toast.loading({
      message: '加载中...', 
      forbidClick: true,
      loadingType: 'spinner',
      duration: 500
    });
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('evaluateOrder', (data) => {
      this.setData({
        storeName: data.storeName,
        orderInfo: data.orderInfo
      })
    })
  },

  onScoreChange(event) {
    this.setData({
      scoreValue: event.detail
    })
  },
  onCheckChange(event) {
    this.setData({
      checked: event.detail
    })
  },
  handleInput(event) {
    this.setData({
      textValue: event.detail.value
    })
  },
  handleCancel() {
    wx.navigateBack()
  },
  handleSubmit() {
    this.API_createEvaluation({
      order_id: this.data.orderInfo.id,
      content: this.data.textValue,
      score: this.data.scoreValue,
      anonymous: this.data.checked,
      evaluation_time: new Date(),
    })
  },
  API_createEvaluation(data){
    createEvaluation(data).then(res => {
      if(res.data.meta.status === 201) {
        wx.navigateBack()
      }
    }).catch(err => {
      console.log(err)
      Toast('评价失败')
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
})