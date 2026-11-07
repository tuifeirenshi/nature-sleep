[English](BUILD_MIGRATION.md) | 简体中文

# 构建迁移：从手工工具到 Gradle

根据 Git 历史于 2026-11-07 整理。根目录 `build.ps1` 沿用原名称，但当前内容已改为调用 Gradle，不是旧手工实现。迁移已包含在[提交 84dd541](https://github.com/tuifeirenshi/nature-sleep/commit/84dd5410041325914573fc4624c6826d62a53149)和 [v1.0.1 快照](https://github.com/tuifeirenshi/nature-sleep/tree/v1.0.1)中。

## 历史与当前流程

| 方面 | v1.0.0 手工构建 | 当前 Gradle 构建 |
| --- | --- | --- |
| 编译与打包 | 脚本直接编排 `javac`、D8、AAPT、zipalign、apksigner | 由 Android Gradle Plugin 统一组织 Android 构建 |
| 依赖 | 本机 `tools/bt`、`tools/plat` 中的工具 | SDK 环境配置及 Gradle Wrapper |
| 配置 | PowerShell 中拼接打包参数与版本号 | `android/build.gradle` 及根目录 Gradle 配置 |
| 素材 | 历史脚本明确复制来源媒体 | 视频准备脚本与 Gradle 资源同步 |
| 输出 | 历史脚本写入 `dist/` | Gradle release 输出目录，按元数据识别签名/未签名文件 |

旧工具本身也是 Android 工具；此次迁移采用标准构建编排方式，没有替换应用框架。应用仍由 Java、WebView 和共用网页资源组成。

## 迁移原因

- 使用 Android 标准工程构建流程，减少手工串联工具的维护负担。
- 集中 SDK、版本、资源和签名配置，便于检查修改。
- 固定 Gradle 版本并校验下载分发包的哈希。
- 区分当前源码与生成中间文件，区分 APK 视频副本与网页原素材。

以上是维护方面的收益，不代表无 Bug、可逐字节重建旧 APK 或兼容所有设备。既有素材来源与处理链缺口仍单独记录。

## 旧构建保留在哪里

- [v1.0.0 源码快照](https://github.com/tuifeirenshi/nature-sleep/tree/v1.0.0)
- [v1.0.0 原始 build.ps1](https://github.com/tuifeirenshi/nature-sleep/blob/v1.0.0/build.ps1)
- [归档实验及其原路径](../../tools/archive/README.zh-CN.md)

不必把每版旧脚本复制到当前根目录。Git 标签保存完整版本背景。研究旧版时，在独立目录恢复对应标签，并检查该版本的依赖和签名要求。标签不包含私人签名密钥、所有原始工具下载，也不保证能重建完全相同的旧 APK。不要为适应今天的结构而重写已发布标签。

## 当前入口

`build.ps1` 是 Windows 构建入口。`gradlew`、`gradlew.bat`、`build.gradle`、`settings.gradle`、`gradle.properties` 和 `gradle/wrapper/` 均为当前标准构建文件，保留在所需位置。预览入口仍为 `open-preview.cmd`。

[当前构建指南](BUILD.zh-CN.md) · [版本记录](../release/README.zh-CN.md)
