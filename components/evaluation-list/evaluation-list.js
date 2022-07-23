// components/evaluation-list/evaluation-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    evaluationInfo: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    storeScore: 0,
    favorableRate: '',
    scoreList: {
      1: '超烂啊，太差了',
      2: '味道有点差',
      3: '中规中矩嘛',
      4: '不错，值得推荐',
      5: '太赞了，强力推荐'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      let scoreTotal = 0
      this.properties.evaluationInfo.forEach(item => {
        scoreTotal = scoreTotal + Number(item.score)
      })
      this.setData({
        storeScore: (scoreTotal / this.data.evaluationInfo.length).toFixed(1),
        favorableRate: (scoreTotal / (5*this.data.evaluationInfo.length) * 100).toFixed(0) + '%'
      })
    }
  },
  observers: {
    'evaluationInfo': function(data) {
      this.init()
    },
  },
  // 生命周期钩子-在组件实例进入页面节点树时执行
  // attached() {
    
    
  // }
})
