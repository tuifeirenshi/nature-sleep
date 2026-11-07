English | [简体中文](PREVIEW.zh-CN.md)

# Local Web Preview

The web preview uses Node.js and the checked-out web assets. It does not require an Android SDK or build an APK.

## Download the Source

Install Git, Git LFS, and Node.js, then run:

```powershell
git lfs install
git clone https://github.com/tuifeirenshi/nature-sleep.git
cd nature-sleep
git lfs pull
git lfs ls-files
node tools/check-media.cjs
```

The current playlist has seven audio/video pairs; `git lfs ls-files` should list 14 playback media files. A source ZIP may contain pointers instead of media. `check-media.cjs` checks fields and nonempty files, not codec validity, licensing, or complete LFS download integrity. Inspect missing media or small pointer files if playback fails.

## Start the Preview

On Windows, double-click `open-preview.cmd` in the repository root. It starts `scripts/preview/server.cjs` if needed and opens `http://127.0.0.1:8768/` in the default browser. Node.js must be available on PATH.

The server can also run directly in a terminal:

```powershell
node scripts/preview/server.cjs
```

Open the same localhost address and stop that terminal process with Ctrl+C when finished. The server listens only on `127.0.0.1`, not the local network. If the port is already occupied, identify the process instead of starting multiple copies. Refresh after editing web files; bypass browser cache when checking stale resources.

## Scope of Preview Results

Test scene switching, play/pause, timer changes, settings/languages, and phone/tablet/desktop layouts. Browser results do not prove Android background playback, lock-screen controls, device-specific rendering, or APK contents.

[Android build guide](BUILD.md) · [Current tools](../../tools/README.md) · [Screenshots](../screenshots/README.md)
