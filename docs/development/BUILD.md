English | [简体中文](BUILD.zh-CN.md)

# Android Build Guide

This is the current Windows build workflow. Build an APK only when explicitly requested. For desktop-only use, follow the [preview guide](PREVIEW.md).

## Prerequisites

- Git and Git LFS, with the actual 14 playback media files downloaded; see [source setup](PREVIEW.md#download-the-source).
- Node.js on PATH for `tools/check-media.cjs`.
- JDK 21 with `JAVA_HOME` configured; the Android Gradle Plugin requires Java 17 or later.
- Android SDK Platform 35 and Build Tools 35.0.0. Set `ANDROID_SDK_ROOT` to the SDK directory (`ANDROID_HOME` is also accepted by the entry script).
- FFmpeg with the `libx264` encoder, available as `ffmpeg.exe` on PATH.
- PowerShell and enough disk space for original media, compressed video copies, packaged assets, Gradle caches, and APK output. Required space depends on the downloaded files and caches.

Gradle Wrapper is version 8.9 and the Android Gradle Plugin is 8.7.3. The wrapper verifies its download SHA-256. Dependency settings currently prefer configured mirrors with canonical repositories as fallbacks; inspect `settings.gradle` and `gradle/wrapper/gradle-wrapper.properties` when diagnosing download problems.

## Local Signing

Copy `tools/signing.example.properties` to the ignored `tools/signing.local.properties`. Fill in your own keystore path, store/key passwords, and key alias. Paths are interpreted relative to the project root unless absolute. Never commit keys, passwords, or the filled configuration. Losing a key may prevent updates to an app signed with it.

Signing is optional for producing a build, but an unsigned APK cannot be installed directly. Do not mistake a filename for evidence of a valid signature; verify release signatures separately before distribution.

## Build Entry

From the repository root, when a build is requested:

```powershell
.\build.ps1
```

The current sequence is:

1. `tools/check-media.cjs` checks track fields and nonempty media files.
2. `scripts/prepare-videos.ps1` prepares separate 4K H.264 video copies at a target average 9 Mbps. Campfire uses 30 fps; other frame rates and source resolution are retained. Original web media is unchanged.
3. `gradlew.bat :app:assembleRelease` uses the official Android Gradle Plugin; `android/build.gradle` synchronizes the selected web assets.
4. `scripts/resolve-release-apk.ps1` reads Gradle output metadata and reports the file actually produced.

`gradlew` and `gradlew.bat` are standard build entry files, not historical scripts. Direct Gradle invocation does not automatically prepare compressed videos; use `build.ps1` for this documented workflow. Other host platforms do not have a documented complete packaging workflow here.

## Outputs and Release Checks

| Configuration | Output under `android/build/outputs/apk/release/` |
| --- | --- |
| Valid signing configuration | `app-release.apk` |
| No signing configuration | `app-release-unsigned.apk` |

Prepared video copies live under `android/build/compressed-video-4k-9m/`; packaged web assets live under `android/package-assets/`. All are generated and ignored by Git. A build does not automatically publish a Release or replace an existing release attachment. The public filename `nature-sleep-v1.0.1.apk` is a distribution name, not the default Gradle output name.

Before publishing, check the actual APK's version, signing certificate, packaged media, SHA-256, and behavior on Android devices. File/schema checks and browser previews do not establish device compatibility. Keep local distribution copies separately from source and retain only the intended recent releases.

[Build migration and historical tags](BUILD_MIGRATION.md) · [Current tools](../../tools/README.md)
