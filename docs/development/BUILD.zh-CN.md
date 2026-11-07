[English](BUILD.md) | 简体中文

# Android 构建指南

这是当前 Windows 构建流程。只有明确要求时才生成 APK。只需电脑预览时，查看[预览指南](PREVIEW.zh-CN.md)。

## 环境准备

- Git 和 Git LFS，并下载实际的 14 个播放媒体文件，见[下载源码](PREVIEW.zh-CN.md#下载源码)。
- PATH 中可调用的 Node.js，供 `tools/check-media.cjs` 使用。
- JDK 21，并配置 `JAVA_HOME`；Android Gradle Plugin 要求 Java 17 及以上。
- Android SDK Platform 35、Build Tools 35.0.0。将 `ANDROID_SDK_ROOT` 指向 SDK 目录；入口脚本也接受 `ANDROID_HOME`。
- PATH 中可调用的 `ffmpeg.exe`，且包含 `libx264` 编码器。
- PowerShell，以及容纳原素材、压缩视频副本、打包资源、Gradle 缓存和 APK 的空间。具体需求取决于已下载文件及缓存。

当前 Gradle Wrapper 为 8.9，Android Gradle Plugin 为 8.7.3。Wrapper 校验下载的 SHA-256。依赖配置优先使用已设置的镜像，保留官方仓库作为后备；下载异常时检查 `settings.gradle` 和 `gradle/wrapper/gradle-wrapper.properties`。

## 本机签名

把 `tools/signing.example.properties` 复制为已被忽略的 `tools/signing.local.properties`，填写自己的密钥路径、存储密码、密钥密码和别名。非绝对路径按项目根目录解释。不要提交密钥、密码或填写后的配置。密钥遗失可能影响后续更新同一签名的应用。

不配置签名也可以生成构建文件，但未签名 APK 不能直接安装。文件名不代表签名已验证；发布前需要单独检查实际签名。

## 构建入口

需要打包时，在仓库根目录运行：

```powershell
.\build.ps1
```

当前顺序为：

1. `tools/check-media.cjs` 检查曲目字段与非空媒体文件。
2. `scripts/prepare-videos.ps1` 生成独立的 4K H.264 视频副本，目标平均码率 9 Mbps。篝火为 30 帧/秒，其余帧率及原分辨率保持；网页原素材不变。
3. `gradlew.bat :app:assembleRelease` 调用官方 Android Gradle Plugin；`android/build.gradle` 同步选定的网页资源。
4. `scripts/resolve-release-apk.ps1` 读取 Gradle 输出记录，报告本次实际生成的文件。

`gradlew` 和 `gradlew.bat` 是标准构建入口，不是历史脚本。直接调用 Gradle 不会自动准备压缩视频，本文流程使用 `build.ps1`。目前没有完整记录其他主机平台的打包流程。

## 输出与发布检查

| 配置 | `android/build/outputs/apk/release/` 下的输出 |
| --- | --- |
| 有效签名配置 | `app-release.apk` |
| 未配置签名 | `app-release-unsigned.apk` |

压缩视频位于 `android/build/compressed-video-4k-9m/`，打包网页资源位于 `android/package-assets/`，均为生成文件且被 Git 忽略。构建不会自动发布 Release 或替换已有附件。公开的 `nature-sleep-v1.0.1.apk` 是分发文件名，不是 Gradle 默认输出名。

发布前核对实际 APK 的版本、签名证书、内嵌媒体、SHA-256 和 Android 真机行为。文件结构检查与浏览器预览不能证明真机兼容性。本机分发副本与源码分开保管，仅保留计划中的近期版本。

[构建迁移与历史标签](BUILD_MIGRATION.zh-CN.md) · [当前工具](../../tools/README.zh-CN.md)
