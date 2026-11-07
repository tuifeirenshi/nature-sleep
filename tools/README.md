English | [简体中文](README.zh-CN.md)

# Tool and Script Index

Run commands from the repository root. Current JavaScript checks use Node.js built-in modules and need no npm packages.

| Entry | Status and purpose |
| --- | --- |
| `open-preview.cmd` | Current Windows preview entry; calls `scripts/preview/open-preview.ps1` and `server.cjs` |
| `build.ps1` | Current Windows APK entry; checks media, prepares video copies, and invokes Gradle. Run only when an APK build is requested |
| `scripts/prepare-videos.ps1` | Current FFmpeg processing for APK video copies; original web media is preserved |
| `scripts/resolve-release-apk.ps1` | Reads Gradle's output metadata to locate the signed or unsigned output; does not build or verify an APK signature |
| `tools/check-media.cjs` | Current file/schema check: `node tools/check-media.cjs`; not a codec, licensing, or device test |
| `tools/check-docs.cjs` | `node tools/check-docs.cjs`: checks opening language navigation, relative Markdown links, and linked headings; does not test remote websites or translation quality |
| `tools/signing.example.properties` | Public template only; copy to ignored `signing.local.properties` and supply your own local key |
| `tools/archive/media/` | Historical downloads, generation experiments, and media processing scripts; not current build steps |
| `tools/archive/qa/` | Historical browser tests tied to old UI selectors, local paths, or private runtime dependencies; not a supported current test suite |
| `tools/archive/references/` | Saved search/download pages and Android repository metadata; not current configuration |

Archived file contents are preserved. Their relative paths may no longer resolve after relocation, and absolute paths may point to the original author's machine. Do not run archived scripts in the current checkout without reviewing and adapting them in a separate workspace. Some scripts generate synthetic audio; their presence is historical and does not mean those outputs are currently used. `web/tracks.js` and the [media catalog](../docs/media/MEDIA_CATALOG.md) identify current playback files.

Local downloaded candidates, SDK archives, keys, and scratch files have not been moved into the public archive. Renames are recorded in Git; use `git log --follow -- <path>` to inspect a file's history. See [documentation](../docs/README.md) and [media update instructions](../docs/media/UPDATING_MEDIA.md).
