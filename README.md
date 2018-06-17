# circle-percent
微信小程序进度盘组件

## 组件参数
- full-value：Number，进度条的目标值
- expect-value：Number，进度条的当前期望值，也就是灰色达到的数值
-current-value：Number，进度条的实际完成值，也就是绿色达到的数值
- control-width：Number，控件宽高（宽高相同），单位为rpx
- background-color：String，最右侧未完成部分的颜色，也就是进度条的背景色
- expect-color：String, 期望完成但实际未完成部分的颜色值，如果currentValue>expectValue，则这部分颜色不会被显示
- current-color：String，实际完成部分的颜色
- speed: 动画速度
- text-color: 百分比文本颜色

