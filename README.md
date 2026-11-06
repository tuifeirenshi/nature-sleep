English | [简体中文](README.zh-CN.md)

# Nature Sleep

Nature Sleep is a personal experimental Android sound player with seven soundscapes and matching video backgrounds. The project is evolving; features, media, and documentation may change. Audio experiences vary. The app does not promise to improve sleep and is not a substitute for medical advice or treatment.

![Phone preview (web preview)](docs/screenshots/v1.0-phone.png)

![Desktop preview (web preview)](docs/screenshots/v1.0-desktop.png)

These screenshots show the v1.0 web preview; the current interface may differ.

This is a **source-available project**, not a project distributed under a standard open-source code license. The public repository can be viewed and forked on GitHub. No additional permission is granted for copying, modifying, commercial use, or redistribution of the code outside GitHub's platform permissions. Third-party media and icons remain subject to their own licenses. Forks, modified builds, and personal builds are not official releases.

## Preview and Installation

- Desktop preview: install Node.js and make `node` available on PATH. On Windows, double-click `open-preview.cmd` to open `http://127.0.0.1:8768/` in the default browser.
- Android: download `nature-sleep-v1.0.1.apk` from [GitHub Releases](https://github.com/tuifeirenshi/nature-sleep/releases). Its Android version name is `1.0.1`.
- Android 8.0 or later; phones and tablets are supported. Background behavior may vary with device-specific battery management.

## Source and Build

Large media files use Git LFS. Install Git LFS before cloning, then run:

```powershell
git lfs install
git clone https://github.com/tuifeirenshi/nature-sleep.git
cd nature-sleep
git lfs pull
git lfs ls-files
```

The last command should list 14 current audio/video files. If media is missing, check that `git lfs pull` succeeded and that `web/media/` contains the actual files rather than small LFS pointer text files.

The Android app uses the official Android Gradle Plugin and Gradle Wrapper. On Windows, install Node.js, JDK 21, Android SDK Platform 35, Build Tools 35.0.0, and FFmpeg with libx264 on PATH; set `JAVA_HOME` and `ANDROID_SDK_ROOT`. To sign a release, first create the ignored `tools/signing.local.properties` from `tools/signing.example.properties` and provide your own keystore and credentials. Without signing configuration the release APK is unsigned. Run `.\build.ps1` in PowerShell. It creates separate 4K H.264 video copies targeting 9 Mbps; the campfire uses 30 fps and other frame rates are retained. Web source media is unchanged. The Gradle 8.9 wrapper verifies its download SHA-256. Keep signing credentials private; losing the signing key can prevent updates.

## Repository Guide

- `web/`: player interface and current media; `android/`: Android app and media controls.
- `scripts/`: video preparation and local preview; `docs/`: licensing, media, release and development records.
- `tools/`: checks and historical media/QA experiments. Some older scripts contain machine-specific paths and are not portable; do not assume they apply to the current version.
- `docs/archive/`: historical notes, not current instructions.

## Media, Contributions, and Status

See [PROJECT_LICENSES.md](docs/licensing/PROJECT_LICENSES.md) for third-party license evidence and unresolved permission questions, and [MEDIA_CATALOG.md](docs/media/MEDIA_CATALOG.md) for file paths, hashes, technical details, and processing records. Some platform terms still require further confirmation; a pending status is not a grant of permission. Historical files in Git may no longer be used and are not evidence of redistribution rights. The current playback list is `web/tracks.js`.

Issues, suggestions, and Pull Requests are welcome, but there is no review or response deadline and merging is not guaranteed. External code contributions will not be merged until code licensing and contribution permissions are decided. Media contributions must include source URL, author, license, download date, redistribution and modification permissions, and SHA-256, and must be confirmed by the project author. No public project email is provided; use GitHub Issues or Discussions. GitHub does not guarantee a notification for every fork. See [CONTRIBUTING.md](docs/development/CONTRIBUTING.md) and [AI_RULES.md](docs/development/AI_RULES.md).

This is a personal experimental project. No long-term maintenance, bug-free operation, or compatibility with every device is promised. Windows, iOS, and macOS support is undecided and has no timeline.
