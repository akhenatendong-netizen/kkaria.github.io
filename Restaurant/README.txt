CrazyBee — Original App UI revision

完整解压后打开 index.html；请将 demos 和 assets 保留在同一目录。GitHub Pages 上传 index.html、assets、demos 和 .nojekyll。source 为完整可编辑源码。

App 原版素材取自用户提供的 Figma 文件 aHCc8gyl0YlcGNpDsm7iSm：
主页 1531:25234；搜索建议 1492:23032；搜索结果 1492:20957；Discover Restaurant 1539:26538；Coupon 1531:26122；餐厅详情 1813:28455；订单确认 1903:15216；Special Events 809:3437；Boba 670:34472；签到 675:17721。

独立手机 HTML：
home.html / search.html / results.html / discover.html / restaurant.html / offer.html / checkout.html / events.html / event.html / delivery.html，均位于 demos 文件夹。搜索输入支持键盘输入与回车，手机上使用系统键盘；Restaurant / Coupon 标签可切换。

还原了紫色礼盒活动主视觉、红色活动海报、活动卡片、签到二维码和原设计的餐厅/菜品素材。原设计中的历史日期与占位内容仅供演示。付款、核销不会产生实际交易。

10 家餐厅 Logo 为单排无缝循环播放，鼠标悬停或键盘聚焦暂停；减弱动态效果偏好下可手动横向浏览。

源码：npm install；npm run dev；npm run build（含重新生成手机 HTML）。
