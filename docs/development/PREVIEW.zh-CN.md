[English](PREVIEW.md) | 简体中文

# 本地网页预览

网页预览使用 Node.js 和当前检出的网页资源，不需要 Android SDK，也不会生成 APK。

## 下载源码

安装 Git、Git LFS 和 Node.js 后运行：

```powershell
git lfs install
git clone https://github.com/tuifeirenshi/nature-sleep.git
cd nature-sleep
git lfs pull
git lfs ls-files
node tools/check-media.cjs
```

当前播放清单有七组音视频；`git lfs ls-files` 应列出 14 个播放媒体文件。源码 ZIP 可能只包含指针。`check-media.cjs` 检查字段与文件非空，不检测编码、授权或 LFS 下载完整性。播放异常时，检查媒体是否缺失或仍是很小的指针文本。

## 启动预览

Windows 上双击根目录的 `open-preview.cmd`，它会按需启动 `scripts/preview/server.cjs`，并用默认浏览器打开 `http://127.0.0.1:8768/`。Node.js 须能从 PATH 调用。

也可直接在终端运行：

```powershell
node scripts/preview/server.cjs
```

打开同一 localhost 地址，结束时在该终端按 Ctrl+C 停止。服务器只监听 `127.0.0.1`，不对局域网开放。端口被占用时先确认占用进程，不要重复启动多个副本。修改网页文件后刷新；检查旧资源缓存时使用强制刷新。

## 预览结果的范围

检查曲目切换、播放/暂停、定时修改、设置/语言，以及手机、平板和电脑布局。浏览器结果不能证明 Android 后台播放、锁屏控制、设备渲染或 APK 内嵌内容正常。

[Android 构建指南](BUILD.zh-CN.md) · [当前工具](../../tools/README.zh-CN.md) · [截图说明](../screenshots/README.zh-CN.md)
