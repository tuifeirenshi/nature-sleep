English | [简体中文](BUILD_MIGRATION.zh-CN.md)

# Build Migration: Manual Tools to Gradle

Recorded from Git history on 2026-11-07. The current root `build.ps1` retains its familiar name but delegates to Gradle; it is not the old manual implementation. The migration is present in [commit 84dd541](https://github.com/tuifeirenshi/nature-sleep/commit/84dd5410041325914573fc4624c6826d62a53149) and the [v1.0.1 snapshot](https://github.com/tuifeirenshi/nature-sleep/tree/v1.0.1).

## Historical and Current Workflows

| Area | v1.0.0 manual build | Current Gradle build |
| --- | --- | --- |
| Compilation and packaging | Script directly orchestrated `javac`, D8, AAPT, zipalign, and apksigner | Android Gradle Plugin coordinates the Android build |
| Dependencies | Local tools under `tools/bt` and `tools/plat` | SDK environment configuration and Gradle Wrapper |
| Configuration | Packaging/version arguments in the PowerShell script | `android/build.gradle` and root Gradle configuration |
| Media | Explicit source-media copying in the historical script | Video preparation helper plus Gradle asset synchronization |
| Output | Historical script wrote into `dist/` | Gradle release output directory; metadata identifies signed/unsigned file |

The old tools were Android tools too; this change adopts their standard build orchestration rather than replacing the application framework. Java, WebView, and shared web assets remain the application's structure.

## Reasons for the Migration

- Use Android's standard project build lifecycle instead of manually coordinating each tool.
- Centralize SDK, version, asset, and signing configuration so changes are easier to inspect.
- Pin the Gradle version and verify its downloaded distribution checksum.
- Keep current source separate from generated intermediates and separate APK video copies from original web media.

These are maintenance benefits, not proof of bug-free output, bit-for-bit reproduction, or device compatibility. Existing media provenance and processing gaps remain documented separately.

## Where the Old Build Lives

- [v1.0.0 source snapshot](https://github.com/tuifeirenshi/nature-sleep/tree/v1.0.0)
- [Original v1.0.0 build.ps1](https://github.com/tuifeirenshi/nature-sleep/blob/v1.0.0/build.ps1)
- [Archived experiments and their original paths](../../tools/archive/README.md)

Do not copy each old script into the current root. Git tags preserve complete version context. For historical research, restore the tag into a separate directory and review its own dependencies and signing requirements. The tag alone does not include private signing keys, all original tool downloads, or a guarantee that the exact old APK can be reproduced. Never rewrite a published tag to make it look like the current project.

## Current Entry Points

`build.ps1` is the Windows build entry. `gradlew`, `gradlew.bat`, `build.gradle`, `settings.gradle`, `gradle.properties`, and `gradle/wrapper/` are current standard build files and stay at their required locations. Preview remains `open-preview.cmd`.

[Current build guide](BUILD.md) · [Release history](../release/README.md)
