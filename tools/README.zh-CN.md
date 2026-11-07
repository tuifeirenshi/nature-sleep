[English](README.md) | 简体中文

# 工具与脚本索引

以下命令从仓库根目录运行。当前 JavaScript 检查只使用 Node.js 内置模块，不需要安装 npm 依赖。

| 入口 | 状态和用途 |
| --- | --- |
| `open-preview.cmd` | 当前 Windows 预览入口，调用 `scripts/preview/open-preview.ps1` 与 `server.cjs` |
| `build.ps1` | 当前 Windows APK 入口：检查素材、准备视频副本、调用 Gradle。只在明确要求打包时运行 |
| `scripts/prepare-videos.ps1` | 当前 APK 视频副本的 FFmpeg 处理流程，保留网页原素材 |
| `scripts/resolve-release-apk.ps1` | 读取 Gradle 输出记录，定位已签名或未签名文件；不构建 APK，也不验证签名 |
| `tools/check-media.cjs` | 当前文件和资料结构检查：`node tools/check-media.cjs`；不检测编码、授权或真机兼容性 |
| `tools/check-docs.cjs` | `node tools/check-docs.cjs`：检查开头语言导航、Markdown 相对链接和目标标题，不检测外部网页或翻译质量 |
| `tools/signing.example.properties` | 公开模板，复制为被忽略的 `signing.local.properties`，自行填写本机密钥信息 |
| `tools/archive/media/` | 历史下载、生成实验及素材处理脚本，不属于当前构建步骤 |
| `tools/archive/qa/` | 历史浏览器测试，依赖旧界面选择器、本机路径或私人运行环境，不属于当前受支持的测试套件 |
| `tools/archive/references/` | 保存的搜索、下载页面及 Android 仓库元数据，不是当前配置 |

归档文件内容保持原样。移动后其中的相对路径可能失效，绝对路径也可能指向原作者电脑。不要直接在当前项目运行；如需研究，应先在独立工作目录审阅和适配。部分脚本用于生成合成音频，仅保留历史，不代表当前应用使用其输出。当前播放文件以 `web/tracks.js` 和[素材目录](../docs/media/MEDIA_CATALOG.zh-CN.md)为准。

本机下载候选、SDK 压缩包、密钥和临时文件没有移入公开归档。移动记录保存在 Git 中，可通过 `git log --follow -- <路径>` 查看历史。另见[文档目录](../docs/README.zh-CN.md)和[更新素材流程](../docs/media/UPDATING_MEDIA.zh-CN.md)。
