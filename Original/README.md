# CrazyBee A-Original — 可直接打开 / GitHub Pages 版

## 直接查看

双击本文件旁边的 `index.html`。脚本、字体、品牌图片和 3D 场景代码已内嵌，无需安装依赖或启动服务器。

## GitHub Pages

1. 解压，将根目录 `index.html` 上传到你的 GitHub 仓库根目录，替换旧的同名文件；也可上传全部内容（包括 `.nojekyll` 和源码目录）。不要把 ZIP 本身作为网页上传。
2. 仓库 **Settings → Pages → Build and deployment**，Source 选择 **Deploy from a branch**，Branch 选择 **main**（或实际上传文件的分支），目录选择 **/(root)**，点击 Save。
3. 等部署完成后打开 Pages 提供的网址；如仍看到旧页，强制刷新。

`index.html` 已是完整发布页面，支持仓库子路径，不需要 GitHub Actions 构建。

## 继续开发

完整 React + TypeScript + Three.js + Vite 源码在 `source/`。

```sh
cd source
npm ci
npm run dev
```

修改后执行 `npm run build:portable`，自动重新生成上一级可直接发布的 `index.html`。
常规 Vite 构建为 `npm run build`；本包的便携发布入口使用 `build:portable`。

3D 交互需要浏览器开启 WebGL。团餐跳转等外部链接仍需要联网。此包不包含真实交易数据。
