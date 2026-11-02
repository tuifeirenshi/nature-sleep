English | [简体中文](MEDIA_CATALOG.zh-CN.md)

# Current Media Catalog and Processing Record

Audit date: 2026-10-28. This catalog describes the 14 files used by the current web playlist in `web/tracks.js`, their local paths, recorded hashes, technical metadata, and processing-chain gaps. License conclusions are kept separately in `../licensing/PROJECT_LICENSES.md`.

## Current Web Playlist Files

| Track | Video file / SHA-256 | Recorded video metadata and source reference | Audio output / SHA-256 | Retained source file / SHA-256 | Recorded processing/provenance |
|---|---|---|---|---|---|
| Rainforest | `web/media/rain-loop4k.mp4`<br>`65427242CD317E93D694111BB94B871ACA4AD09961BA1F9EAF61BA211033C20` | Mixkit item 22728; title “Raining in a cloud forest full of tall trees.” | `web/media/rain-jungle-balanced.wav`<br>`0C3A05F8086E66F4B0172C4BF1C322BFE7AFEC3181FAA7A6768135512AFADF5A` | `tools/cc0-audio/replacements/rain-jungle-online.mp3`<br>`CCC718A44325BF104510B694C9D94937A56C2417C777C8781B4DC53B0E54A91C` | Source MP3 hash matches the 2026-10-27 record; WAV output hash matches the current main record. |
| Waves | `web/media/waves-4k.mp4`<br>`D10EC7D89415DFDC80D80A1733219459C8EC28F57D5FADACE20B5C419C50E97B` | Mixkit item 5016; title “Waves coming to the beach.” | `web/media/waves-balanced.wav`<br>`51D90AC089A9682CB56D11F8962156477DF9B19F933F588F6A56C1549C9D2719` | `tools/cc0-audio/replacements/waves-online.mp3`<br>`16E5CC70990C0248889A9AADF9C8F2DC0650DFB2CA4E10A13A125B6E60B3B25E` | Item ID is from existing records; source and output hashes differ from older records. The processing script/parameters do not yet reproduce the current output. |
| Stream | `web/media/stream-clear.mp4`<br>`CD2A8521087709A644922573206C566B4C58C33418D1E23D11CA1B124FE0DDD1` | Mixkit item 51585; title “Flying over a relaxing creek full of rock on the countryside.” | `web/media/stream-balanced.wav`<br>`004793FEACACD224D4D076C17273F16D40CCA52CF7F4EC9879D275AB1E287221` | `tools/cc0-audio/stream-preview.mp3`<br>`59A18DB8C6FAFBD3F3CEC5C46BF5F878F5E55DE76167A242119AFCC4AC0F854E` | Source MP3 hash matches an older record; output WAV hash differs. The processing script/parameters do not yet reproduce the current output. |
| Night insects | `web/media/summer-night4k.mp4`<br>`1C07CEB1354B43F4A36BCEA3DE6BDC19EF26609AE2C36DFA88573B120287E953` | Pexels item 29644229; “Spectacular Star Trails Over Forest at Night”; 3840×2160, 12 sec. Browser verification recorded on 2026-10-28. | `web/media/forest-night-balanced.wav`<br>`7CF7AD952C338A1E7C807BC4C9F339EED8971012BC03424C297A66E2E54D54D3` | `tools/cc0-audio/replacements/forest-night-new.mp3`<br>`95F72949D317DEAFB2EFABFE27B6A557E25C9BFCD66ED71C1C709855B53FCCDE` | Source MP3 hash matches existing records; output WAV hash differs from older records. |
| Campfire | `web/media/campfire-close.mp4`<br>`E9EEDC3602D1917C7A6B6FB1BF9F5C685E38F24DCF49462E766925517CA57943` | Pexels item 31206562; “Warm and Inviting Campfire Flames”; 3840×2160, 6 sec. Browser verification recorded on 2026-10-28. | `web/media/campfire-balanced.wav`<br>`241B4D9EAEC752FBEFA229F03605DAD22AB64493524CA47888379DCDD3E5AA7F` | `tools/cc0-audio/replacements/campfire-new.mp3`<br>`C00456052185C6782AA43987977DB4A966EBEA4252BAE892DF7A803E4E35EC22` | Source MP3 hash matches existing records; output WAV hash differs from older records. |
| Sleep music | `web/media/music-moon.mp4`<br>`7B9EFE5457973C67714565D4CAE30FEE1DD5BF6300D2E417B9683297E10C67AE` | Mixkit item 40047; title “Skyline of a desert with the moon at night.” Older item number 3350 was incorrect. This file has the same hash as the retained `tools/moon-detail.mp4` copy. | `web/media/sleep-music-balanced.wav`<br>`3F5C0F494480B7C4E4019F0F8DADB95C30740A44D333191F09C3AFB9BAFB7818` | `tools/cc0-audio/replacements/sleep-music-new.mp3`<br>`40FF0E6E19271303A2339ECDD1A77C3E62FC49012D01272957FBAFF5D72FCEC0` | Source MP3 hash matches existing records; output WAV hash differs from older records. |
| Brainwave sleep | `web/media/binaural-calm-light.mp4`<br>`E53FE5B2AAA5560B0C466A35E5C46D115B3C7028F0EA0F30CFA9EEBA9BC1FE5E` | Pexels item 28561463; “Dynamic Futuristic Waveform Animation”; 3840×2160, 20 sec. Browser verification recorded on 2026-10-28. | `web/media/brainwave-balanced.wav`<br>`FC3F79181FADBB4CC6EC1CD552B3A45AC5D95ADF40F8E13F697F8755BCFA25BF` | `tools/cc0-audio/replacements/yourell-theta-138394.mp3`<br>`89F37100B1F33BDDBB47651EB5528EF2AF16E6E4A0855A33262BF3484BD8699F` | Official HQ preview MP3. Output is a 120-second loop with a 3-second end-to-start crossfade and loudness normalization; command: `tools/process-yourell-theta.cjs`. |

## Pexels Browser Verification and Video Technical Records

On 2026-10-28, these pages were opened individually in a real browser; the records are not based on search snippets or guesses. The Pexels License page states that videos may be used in apps and modified, and may not be redistributed as a stock-photo or wallpaper platform. The specific application of the full terms to the public source repository and APK packaging remains recorded in `../licensing/PROJECT_LICENSES.md`.

| Item | Creator | Page title | Recorded specification | Current file |
|---|---|---|---|---|
| 29644229 | Dubang chang | Spectacular Star Trails Over Forest at Night | 3840 × 2160; 12 seconds | `web/media/summer-night4k.mp4` |
| 31206562 | Shanto Debnath | Warm and Inviting Campfire Flames | 3840 × 2160; 6 seconds | `web/media/campfire-close.mp4` |
| 28561463 | Chandresh Uike | Dynamic Futuristic Waveform Animation | 3840 × 2160; 20 seconds | `web/media/binaural-calm-light.mp4` |

The three current Pexels files were recorded as hash-matching local copies saved by item number. Their page titles, creators, specifications, current file paths, and local-copy hash checks are summarized above.

## Audio Processing and Historical Hashes

`tools/process-cc0-audio.cjs` documents 44.1 kHz, stereo PCM WAV, 120 seconds, loudness normalization, and 3-second fades/loop crossfades. It does not reproduce all current outputs. Five current output WAV hashes (Waves, Stream, Night insects, Campfire, and Sleep music) differ from older records; some source-file mappings also differ. Do not present old hashes as current output hashes.

Current source candidates are retained under `tools/cc0-audio/`; current playback WAVs are under `web/media/`. Existing records associate the source files with Freesound items; the Rainforest page was automatically rechecked and displayed “Creative Commons 0.” Saved copies of each source page and reproducible processing records for five outputs are still missing. Filenames and hashes alone do not establish source or license.

## Icon Source Files

The Lucide Leaf-derived icon files are `web/lucide.js`, `web/leaf.svg`, and `android/res/drawable/ic_leaf.xml`. License and notice requirements are recorded in [PROJECT_LICENSES.md](../licensing/PROJECT_LICENSES.md).

Older source batches recorded in previous versions of the audio-source document include item IDs 765980, 635104, 446019, 750874, 588401, 867839, and 75309 with multiple WAV hashes. Except for the sources mapped above, these are historical research records, not the current source inventory. The old binaural-beat audio is not the current web audio.

## Mixkit Permission Inquiry Draft (Unsent)

This draft was moved here from a separate file because it is project correspondence, not a license. It has not been sent and is not evidence of permission. Do not send it without the project owner's explicit approval.

**Suggested recipient:** `terms@help.envato.com`

**Subject:** Permission to embed Mixkit Stock Video Free clips in a sleep-sound Android app

```text
Hello,

I am developing a free Android sleep-sound player called Rain Sleep. It bundles seven Mixkit Stock Video Free clips as background visuals for seven audio scenes.

The app does not provide stock-media search, downloads, licensing, or a media library. Users only play the finished scenes in the app. The videos are modified only by cropping, looping, and fade transitions, and are distributed inside the APK. The project may later be shared as source code for personal and open-source development.

Is this use permitted under the Mixkit Stock Video Free License and User Terms, including the restriction against using an Item to build a “similar or competitive product or service”? Is attribution optional for this use? Please confirm whether distributing the finished APK and the corresponding source project to users is allowed.

The current clip pages are:

- https://mixkit.co/free-stock-video/rainforest-22728/
- https://mixkit.co/free-stock-video/waves-coming-to-the-beach-5016/
- https://mixkit.co/free-stock-video/flying-over-a-relaxing-creek-full-of-rock-on-the-51585/
- https://mixkit.co/free-stock-video/starry-sky-framed-by-trees-100824/
- https://mixkit.co/free-stock-video/campfire-burning-wood-logs-in-the-dark-22730/
- https://mixkit.co/free-stock-video/moon-in-the-sky-a-snowy-forest-3350/
- https://mixkit.co/free-stock-video/abstract-video-of-a-liquid-with-dark-ink-flowing-44818/

Thank you.

Regards,

[Your name]
```

Before sending, replace the bracketed name, send from the project owner's own email, and retain the sent message, replies, dates, and attachments. Until a clear reply is received, do not claim Mixkit approved this app in the public repository or download page.

## Scope and Remaining Catalog Gaps

- This is the current web-preview inventory. It does not independently prove which files were packaged in any particular APK.
- Actual download dates were not recorded for all 14 media items; the audit date is not a substitute.
- Source hashes help detect file changes but do not prove licensing. Archive each source page, license page, creator/item ID, download date, original hash, processing command, and output hash.
- The canonical current playback list is `web/tracks.js`; license status and permission questions are in `docs/licensing/PROJECT_LICENSES.md`.
