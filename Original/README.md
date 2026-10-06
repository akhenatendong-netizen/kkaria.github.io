# CrazyBee — 方案 A · Original

独立的 React + TypeScript + Three.js + Vite 品牌官网源码。

首页为原版 IP 与光晕互动场景。

此项目固定为方案 A，不包含 A/B 切换入口。其他页面内容、用户与商家角色及品牌资源与对比版一致。

## 上传 GitHub

1. 解压本压缩包。
2. 新建 GitHub 仓库，将解压后的全部文件和文件夹上传到仓库根目录，确保 `package.json` 与 `index.html` 位于根目录。
3. 不要只上传 ZIP 文件：GitHub 不会自动解压它。

## 本地运行

使用 Node.js 22 LTS，执行：

```sh
npm ci
npm run dev
```

## 构建

```sh
npm run build
npm run preview
```

构建产物位于 `dist/`。压缩包包含源码、锁文件、配置和品牌素材，不包含 `node_modules` 或生成文件。

## 说明

这是品牌网站预览；优惠与餐厅内容不是实时交易数据。现有团餐入口为 https://order.crazybee.life/delivery ，商务邮箱为 business@crazybee.life。

素材路径以 `/assets/` 开头，默认用于域名根目录部署；若使用 GitHub Pages 仓库子路径，发布前需配置相应资源基础路径。上传源码本身不会自动发布网站。
