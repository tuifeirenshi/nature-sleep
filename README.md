English | [简体中文](README.zh-CN.md)

# Nature Sleep

English | [简体中文](README.zh-CN.md)

Nature Sleep is a personal experimental Android sound player with seven soundscapes and matching video backgrounds. The project is evolving; features, media, and documentation may change. Audio experiences vary. The app does not promise to improve sleep and is not a substitute for medical advice or treatment.

![Phone preview (web preview)](docs/screenshots/v1.0-phone.png)

![Desktop preview (web preview)](docs/screenshots/v1.0-desktop.png)

This is a **source-available project**, not a project distributed under a standard open-source code license. The public repository can be viewed and forked on GitHub. No additional permission is granted for copying, modifying, commercial use, or redistribution of the code outside GitHub's platform permissions. Third-party media and icons remain subject to their own licenses. Forks, modified builds, and personal builds are not official releases.

## Preview and Installation

- Desktop preview: on Windows, double-click `打开雨林预览.cmd`, then visit `http://127.0.0.1:8768/`.
- Android: download `nature-sleep-v1.0.apk` from GitHub Releases. This is the first public, fresh-install package; its Android version name is `1.0.0`.
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

The Android build requires PowerShell, Java 21, Node.js, Android SDK Platform 35, and Android Build Tools 35.0.0. SDK build tools are not included in Git; the current script reads them from `tools/plat/android-35` and `tools/bt/android-15`. Install them with Android Studio SDK Manager and place them in those directories before building. Run `./build.ps1` in PowerShell. Signing credentials remain local and must not be committed. Use `tools/signing.example.properties` as a template for the ignored local file `tools/signing.local.properties`. Losing the signing key can prevent updates signed as the same app.

## Media, Contributions, and Status

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), [ASSET_LICENSE_AUDIT.md](ASSET_LICENSE_AUDIT.md), and [MEDIA_PROVENANCE_CURRENT.md](MEDIA_PROVENANCE_CURRENT.md) for media and icon sources and their recorded license status. Some platform terms still require further confirmation; a pending status is not a grant of permission. Historical files in Git may no longer be used and are not evidence of redistribution rights. The current playback list is `web/tracks.js`.

Issues, suggestions, and Pull Requests are welcome, but there is no review or response deadline and merging is not guaranteed. External code contributions will not be merged until code licensing and contribution permissions are decided. Media contributions must include source URL, author, license, download date, redistribution and modification permissions, and SHA-256, and must be confirmed by the project author. No public project email is provided; use GitHub Issues or Discussions. GitHub does not guarantee a notification for every fork. See [CONTRIBUTING.md](CONTRIBUTING.md) and [AI_RULES.md](AI_RULES.md).

This is a personal experimental project. No long-term maintenance, bug-free operation, or compatibility with every device is promised. Windows, iOS, and macOS support is undecided and has no timeline.
