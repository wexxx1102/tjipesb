# 天津知识产权交易中心触摸屏展示软件

一个无需构建步骤的本地 Web 展示软件，适用于触摸屏、大屏导览和展厅场景。

## 功能

- 成果展示
  - 自动扫描 `resources/videos`、`resources/images`、`resources/ppt`
  - 展示视频、图片和 PPT/PDF 文件
  - 资源按“最新上传时间”优先展示，便于刷新后快速看到新增成果
- 成果管理
  - 支持上传视频、图片、PPT/PDF 成果文件
  - 支持录入成果名称、成果持有方、专利号、成果简介
  - 录入信息会在成果预览界面展示
  - 浏览器模式与 Tauri 容器模式均支持上传
- 交易项目查询
  - 内嵌 `https://zscq.tpre.cn/ListedTec/Index`
- 数据知识产权登记
  - 内嵌 `http://www.tjipe.com/data-asset/index`
- 官网展示
  - 内嵌 `http://www.tjipe.com`

## 启动方式

在当前目录执行：

```bash
python3 server.py
```

然后访问：

```text
http://127.0.0.1:8000
```

## 打包为 Windows EXE

当前这个项目目录已经补好了 Windows 打包文件，但由于我现在运行在 macOS 环境，不能直接在这里产出 Windows `exe`。

请在 Windows 电脑上打开本项目目录，双击运行：

```text
build_exe.bat
```

它会自动：

- 安装 `PyInstaller`
- 按 [tjipe_touchscreen.spec](/Users/wexxx/Downloads/tjipe/tjipe_touchscreen.spec) 打包
- 生成可执行程序目录到 `dist\天津知识产权交易中心触摸屏展示软件`

打包后的启动入口基于 [launcher.py](/Users/wexxx/Downloads/tjipe/launcher.py)，会自动启动本地服务并打开浏览器页面。

## Tauri 跨平台桌面版

当前项目已补好 `Tauri` 桌面版骨架，目录见：

- [package.json](/Users/wexxx/Downloads/tjipe/package.json)
- [tauri-bridge.js](/Users/wexxx/Downloads/tjipe/tauri-bridge.js)
- [src-tauri/Cargo.toml](/Users/wexxx/Downloads/tjipe/src-tauri/Cargo.toml)
- [src-tauri/tauri.conf.json](/Users/wexxx/Downloads/tjipe/src-tauri/tauri.conf.json)
- [src-tauri/src/main.rs](/Users/wexxx/Downloads/tjipe/src-tauri/src/main.rs)

这个版本的特点：

- 不需要部署服务器端
- 桌面程序直接打开当前前端页面
- 通过 `Tauri command` 直接读取本地 `resources` 目录
- 同一套代码可打包 `Windows` 和 `macOS`

### 运行方式

先安装：

- Node.js
- Rust
- Tauri 构建依赖

然后在项目目录执行：

```bash
npm install
npm run tauri:dev
```

### 打包方式

```bash
npm install
npm run tauri:build
```

打包完成后：

- Windows 会生成安装包或可执行文件
- macOS 会生成 `.app` 或安装包

### 说明

- 浏览器模式下，前端仍然通过 [server.py](/Users/wexxx/Downloads/tjipe/server.py) 的 `/api/media` 读取资源
- `Tauri` 模式下，前端会自动切换到本地桌面桥接，不经过 HTTP 资源接口
- `Tauri` 容器模式下已启用“新窗口同窗打开”增强：
  - 网页触发 `target="_blank"` 或 `window.open` 时，优先在当前容器窗口内打开
  - 更适合触摸一体机，避免跳出后无法回到主界面
- 资源目录仍然是：
  - `resources/videos`
  - `resources/images`
  - `resources/ppt`

## 资源上传说明

将文件放入以下目录后，刷新页面即可自动读取：

- `resources/videos`：视频文件，支持 `mp4`、`webm`、`mov`、`m4v`
- `resources/images`：图片文件，支持 `jpg`、`jpeg`、`png`、`gif`、`webp`、`bmp`
- `resources/ppt`：演示文件，支持 `ppt`、`pptx`、`pps`、`ppsx`、`pdf`

建议：

- 图片使用横版高清素材，适合触摸屏全卡片展示
- 视频优先使用 `mp4`
- PPT 如需更稳定预览，可同步放入导出的 `PDF`
- 视频封面支持同名图片自动匹配
  - 例如 `resources/videos/1.mp4`
  - 可对应放入 `resources/images/1.jpg` 或 `1.png`
