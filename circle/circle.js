Component({
  properties: {
    controlWidth: {
      type: Number,
      value: 1200
    },
    fullValue: {
      // 目标值,总值
      type: Number,
      value: 50
    },
    expectValue: {
      // 期望值
      type: Number,
      value: 40
    },
    currentValue: {
      // 实际值
      type: Number,
      value: 25
    },
    backgroundColor: {
      // 总背景色
      type: String,
      value: '#ccc'
    },
    expectColor: {
      // 期望条背景色
      type: String,
      value: 'gray'
    },
    currentColor: {
      // 完成条背景色
      type: String,
      value: 'green'
    },
    textColor: {
      type: String,
      value: 'gray'
    },
    speed: {
      type: Number,
      value: 0.8
    }
  },

  ready() {
    // 换算rpx到canvas中
    wx.getSystemInfo({
      success: res=>{
        this.width = res.windowWidth/750 * this.data.controlWidth
      }
    })
    
    this.ctx = wx.createCanvasContext('circle', this)
    // 圆弧起点
    this.start = 0.75 * Math.PI
    // 圆弧半径
    this.radius = this.width / 2 - 24;
    // 圆弧原心坐标
    this.x = this.y = this.width / 2
    // 目标终点值
    this.fullEnd = this.start + 1.5 * Math.PI
    // 期望终点值
    this.expectEnd = this.start + this.data.expectValue / this.data.fullValue * 1.5 * Math.PI
    // 实际终点值
    this.currentEnd = this.start + this.data.currentValue / this.data.fullValue * 1.5 * Math.PI
    // 过程值
    this.full = this.expect = this.current = this.start
    // 动画完成flag
    this.fullFlag = this.expectFlag = this.currentFlag = false
    this.text = 0

    setTimeout(_ => {
      this.timer = setInterval(_ => {
        this.draw()
      }, 50 * (1 - this.data.speed))
    }, 400)

  },

  methods: {
    drawRadius(color, current, target, lineWidth, radius) {
      this.ctx.beginPath()
      this.ctx.setLineWidth(lineWidth)

      // 设置圆弧渐变颜色,营造立体感
      const grd = this.ctx.createCircularGradient(this.x, this.y, radius * 1.4)
      grd.addColorStop(0.7, color)
      grd.addColorStop(1, 'white')
      if (current !== 'full') {
        this.ctx.setStrokeStyle(grd)
      } else {
        this.ctx.setStrokeStyle(color)
      }

      this.ctx.arc(this.x, this.y, radius, this.start, this[current])
      if (this[current] < target) {
        // 减速运动
        let speed = (target - this[current]) / 20
        speed = speed < 0.001 ? 0.001 : speed // 设置最低速度,不然会无限趋近
        this[current] = this[current] + speed
      } else {
        this[current + 'Flag'] = true
      }
      this.ctx.stroke()
      this.ctx.closePath()
    },
    draw() {
      this.drawRadius(this.data.backgroundColor, 'full', this.fullEnd, this.width/10-4, this.radius - 2)
      this.drawRadius(this.data.expectColor, 'expect', this.expectEnd, this.width/10, this.radius)
      this.drawRadius(this.data.currentColor, 'current', this.currentEnd, this.width/10+4, this.radius + 2)

      // 画文本
      if (this.fullFlag && this.expectFlag && this.currentFlag) {
        // 进度画完后直接设置text到最终值
        this.text = this.data.currentValue
      }
      this.ctx.setFillStyle(this.data.textColor)

      // 画百分比数值,设置字体大小与位置
      this.ctx.setTextAlign('center')
      this.ctx.setFontSize(this.width / 4.5)
      this.ctx.fillText(this.text, this.width / 2 - this.width / 16, this.width / 1.8)

      // 测量百分比数值宽度,以适配%位置
      const txtWidth = this.ctx.measureText(this.text).width

      // 画%,设置%字体与位置
      this.ctx.setTextAlign('left')
      this.ctx.setFontSize(this.width / 8)
      this.ctx.fillText('%', this.width * 7 / 16 + txtWidth / 2, this.width / 2)
      if (this.text < this.data.currentValue) {
        this.text = this.text + 1
      }

      this.ctx.draw()
      if (this.fullFlag && this.expectFlag && this.currentFlag) {
        clearInterval(this.timer)
      }
    }
  }
})
