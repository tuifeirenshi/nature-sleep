[English](UPDATING_MEDIA.md) | 简体中文

# 更新播放素材

1. 替换前先向作者预览并确认网上来源。在两种语言的素材目录及许可记录中填写来源 URL、作者、许可证、下载日期、再分发和修改依据、处理步骤及 SHA-256；不确定之处如实保留。
2. 只有选定的播放文件放进 `web/media/`，下载候选和原始本机证据放在播放目录外。在 `web/tracks.js` 中填写明确的音视频路径，并将封面放进 `web/media/covers/`。
3. 同步修改 `.gitignore` 中 `web/media/*` 下方的精确文件白名单。现有 MP4/WAV/MP3 已由 `.gitattributes` 配置 LFS；新增其他大文件格式前先配置 LFS。不要用批量 `git add -f` 绕过忽略规则。
4. 文件名或曲目变化时，同步更新 `android/build.gradle` 中的 `videoNames`、音频包含列表及封面处理，以及 `scripts/prepare-videos.ps1` 中的视频列表。只修改 `tracks.js` 不会更新 Android 打包清单。
5. 运行 `node tools/check-media.cjs`、`git check-ignore --no-index web/media/<文件名>` 和 `git lfs ls-files`。确认选定播放文件没有被忽略，本机候选和签名文件仍被忽略。文件检查不能证明授权，也不检测编码。
6. 提交前查看 `git diff --cached --stat` 和 `git diff --cached --name-only`。预览播放、视频切换、封面和手机/电脑布局。只有明确要求时才打包 APK，并单独验证构建与真机表现。

另见[当前素材目录](MEDIA_CATALOG.zh-CN.md)和[许可记录](../licensing/THIRD_PARTY_LICENSES.zh-CN.md)。归档处理脚本只记录早期工作，不代表可以复现所有当前成品。
