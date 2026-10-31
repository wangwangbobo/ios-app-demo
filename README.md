# Lucia · 出行，不必慌张

一款原生 SwiftUI 旅行助手（iOS 18+）：五个主 Tab、全局悬浮助手、按天展开的旅行计划、可拖点位的城市漫步、用户贴文社区、拍照翻译。

**在线体验：<https://wangwangbobo.github.io/ios-app-demo/>** —— 打开就是可点的 App：五个 Tab、拖动路线点位、社区频道、拍照扫描、AI 助手都能真的操作。原生 SwiftUI 源码在 [`Lucia/`](Lucia/)。

## 界面

- **行程**：当日信息（天气、故宫预约、日落）与 4 天旅行计划，按天展开停留点
- **计划**：Citywalk 路线地图、点位编辑（可拖动）、右上角生成笔记、底栏相似路线与「问问 Lucia」入口
- **社区**：平台用户贴文图片流，可搜索、筛选、收藏、查看详情，也能发布本地活动
- **翻译**：实时对话、离线语句、拍照即译（预置菜单与路牌样本，走完整扫描识别流程）
- **我的**：景点预约优先，一键预约与凭证；机票酒店折叠为可选的外部信息
- 全局：AI 助手浮层、地点详情、笔记海报、发布帖子、排序编辑、大字模式

## 运行

```bash
open Lucia.xcodeproj
```

选择 `Lucia` scheme 和 iPhone 模拟器，⌘R 运行。

装到真机：Xcode → Settings → Accounts 登录自己的 Apple ID，把 Signing & Capabilities 里的 Team 换成自己的账号（免费账号即可，签名 7 天有效）。

## 打包 IPA

```bash
./build-ipa.sh
```

会构建真机 Release、注入应用图标、输出 `distribution/Lucia-1.0.0-unsigned.ipa`。未签名包需要用 Sideloadly / AltStore 用自己的 Apple ID 重签后才能装到 iPhone。

## 目录

```
index.html           可交互网页版入口（GitHub Pages）
app.css / app.js     网页版样式与交互
Lucia/               SwiftUI 源码
Lucia.xcodeproj      工程与共享 scheme
AppIcon.png          1024 应用图标（打包时按尺寸注入）
build-ipa.sh         真机构建 + 图标注入 + 打 IPA
```

## 说明

- 工程无第三方依赖，地图用 SwiftUI Canvas 手绘，不接 MapKit。
- 地图点位、社区内容、活动、餐厅热度、翻译结果均为本地演示数据，不连接真实服务。
- 拍照翻译是本地模拟流程，不调用相机与 OCR；AI 助手回复为本地脚本化内容。
- 设计语言：奶油纸底 `#F4ECDC`、墨线描边、硬偏移阴影、荧光色块与贴纸涂鸦。
