# CrazyBee Group Delivery

完整的单文件团购交互演示：选餐、预约、填写联系人、模拟支付、订单跟踪、取件码、取消及退款。

## 直接打开

双击 `index.html` 即可。字体、图片和脚本已全部内嵌，无需安装依赖或构建。

## 上传 GitHub 并发布

1. 解压 ZIP，将里面的 `index.html`、`README.md` 和 `.nojekyll` 上传到仓库根目录。不要只上传 ZIP，也不要将入口放在额外的子文件夹中。
2. 提交到 `main` 分支。
3. 仓库 **Settings → Pages → Build and deployment**，Source 选择 **Deploy from a branch**。
4. Branch 选择 **main**，文件夹选择 **/(root)**，保存。
5. 部署完成后，从 Pages 设置页打开网站链接。

如果仓库使用其他默认分支，请选择实际上传文件的分支。GitHub Pages 可用性取决于仓库可见性和账户方案。

[GitHub 官方发布说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 演示说明

- 无后端，不会产生真实付款、退款、订单、客服消息或进群操作。
- 订单页的演示推进按钮用于测试配送、到达和取件流程。
- 配送前三小时及之后不可取消。
- 演示信息可能保存在当前浏览器本地；不要输入真实敏感信息。
- 菜品图来源在页面底部 Photo credits 中；店名、价格均为示例。
- 包内不含 API 密钥，不依赖本地文件路径。

此包用于静态展示与交互评审，不是生产交易系统。图片与品牌素材的权利归各自权利人所有。
