English | [简体中文](UPDATING_MEDIA.zh-CN.md)

# Updating Playback Media

1. Preview and select the online source with the author before replacing media. Record its URL, creator, license, download date, redistribution/modification evidence, processing steps, and SHA-256 in both language catalogs and license records. Retain uncertainty explicitly.
2. Place only selected playback files in `web/media/`; keep downloaded candidates and original local evidence outside the playback directory. Update `web/tracks.js` with explicit audio/video paths and add a cover in `web/media/covers/`.
3. Update the exact file allowlist under `web/media/*` in `.gitignore`. Current MP4/WAV/MP3 types are covered by `.gitattributes`; configure LFS before adding a new large format. Never bypass the ignore rules with a bulk `git add -f`.
4. Update `videoNames`, audio includes, and cover handling in `android/build.gradle`, plus the video list in `scripts/prepare-videos.ps1` when filenames or tracks change. Updating `tracks.js` alone does not update Android packaging.
5. Run `node tools/check-media.cjs`, `git check-ignore --no-index web/media/<filename>`, and `git lfs ls-files`. An approved playback file should not be ignored; local candidates and signing files must remain ignored. The file check does not establish licensing or validate codecs.
6. Inspect `git diff --cached --stat` and `git diff --cached --name-only` before committing. Preview playback, video switching, covers, and both phone/desktop layouts. Only build an APK when explicitly requested; validate that build and its device behavior separately.

See the [current catalog](MEDIA_CATALOG.md) and [license record](../licensing/THIRD_PARTY_LICENSES.md). Archived processing scripts are evidence of earlier work, not a reproducible recipe for every current output.
