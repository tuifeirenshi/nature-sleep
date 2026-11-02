# Third-Party Notices

English | [简体中文](THIRD_PARTY_NOTICES.zh-CN.md)

This notice is based on the current web playlist in `web/tracks.js` and the existing audit, dated 2026-10-28. A platform license label is not case-specific written confirmation for every distribution method used by this project. Some terms still need review for inclusion in a public source repository, Git LFS, and the APK. “Pending” does not mean permission has been granted.

## Current Audio and Video

| Track | Media | Source and creator | License record | File SHA-256 | Status |
|---|---|---|---|---|---|
| Rainforest | Video `rain-loop4k.mp4` | [Mixkit 22728](https://mixkit.co/free-stock-video/rainforest-22728/); creator not captured in the existing audit | Video Free License marker recorded; applicability of platform terms to this app still needs review | `65427242CD317E93D694111BB94B871ACA4AD09961BA1F9EAFC61BA211033C20` | Platform basis recorded; redistribution scope pending review |
| Rainforest | Audio `rain-jungle-balanced.wav` | [Freesound 422052](https://freesound.org/people/florianreichelt/sounds/422052/), florianreichelt | CC0 marker recorded | `0C3A05F8086E66F4B0172C4BF1C322BFE7AFEC3181FAA7A6768135512AFADF5A` | CC0 source recorded; processed output provenance recorded |
| Waves | Video `waves-4k.mp4` | [Mixkit 5016](https://mixkit.co/free-stock-video/waves-coming-to-the-beach-5016/); creator not captured in the existing audit | Video Free License marker recorded; applicability of platform terms to this app still needs review | `D10EC7D89415DFDC80D80A1733219459C8EC28F57D5FADACE20B5C419C50E97B` | Platform basis recorded; redistribution scope pending review |
| Waves | Audio `waves-balanced.wav` | [Freesound 867642](https://freesound.org/people/bassimat/sounds/867642/), bassimat | CC0 marker recorded | `51D90AC089A9682CB56D11F8962156477DF9B19F933F588F6A56C1549C9D2719` | CC0 source recorded; processing chain needs reconciliation with older hash record |
| Stream | Video `stream-clear.mp4` | [Mixkit 51585](https://mixkit.co/free-stock-video/flying-over-a-relaxing-creek-full-of-rock-on-the-51585/); creator not captured in the existing audit | Video Free License marker recorded; applicability of platform terms to this app still needs review | `CD2A8521087709A644922573206C566B4C58C33418D1E23D11CA1B124FE0DDD1` | Platform basis recorded; redistribution scope pending review |
| Stream | Audio `stream-balanced.wav` | [Freesound 446019](https://freesound.org/people/BurghRecords/sounds/446019/), BurghRecords | CC0 marker recorded | `004793FEACACD224D4D076C17273F16D40CCA52CF7F4EC9879D275AB1E287221` | CC0 source recorded; processing chain needs reconciliation with older hash record |
| Night insects | Video `summer-night4k.mp4` | [Pexels 29644229](https://www.pexels.com/video/spectacular-star-trails-over-forest-at-night-29644229/), Dubang chang | Pexels Free license page was checked in a browser | `1C07CEB1354B43F4A36BCEA3DE6BDC19EF26609AE2C36DFA88573B120287E953` | Source and license recorded; redistribution packaging scope must follow Pexels terms |
| Night insects | Audio `forest-night-balanced.wav` | [Freesound 751467](https://freesound.org/people/Borgory/sounds/751467/), Borgory | CC0 marker recorded | `7CF7AD952C338A1E7C807BC4C9F339EED8971012BC03424C297A66E2E54D54D3` | CC0 source recorded; processing chain needs reconciliation with older hash record |
| Campfire | Video `campfire-close.mp4` | [Pexels 31206562](https://www.pexels.com/video/31206562/), Shanto Debnath | Pexels Free license page was checked in a browser | `E9EEDC3602D1917C7A6B6FB1BF9F5C685E38F24DCF49462E766925517CA57943` | Source and license recorded; redistribution packaging scope must follow Pexels terms |
| Campfire | Audio `campfire-balanced.wav` | [Freesound 714566](https://freesound.org/people/LilMati/sounds/714566/), LilMati | CC0 marker recorded | `241B4D9EAEC752FBEFA229F03605DAD22AB64493524CA47888379DCDD3E5AA7F` | CC0 source recorded; processing chain needs reconciliation with older hash record |
| Sleep music | Video `music-moon.mp4` | [Mixkit 40047](https://mixkit.co/free-stock-video/moon-detail-40047/); creator not captured in the existing audit | Video Free License marker recorded; applicability of platform terms to this app still needs review | `7B9EFE5457973C67714565D4CAE30FEE1DD5BF6300D2E417B9683297E10C67AE` | Platform basis recorded; redistribution scope pending review |
| Sleep music | Audio `sleep-music-balanced.wav` | [Freesound 320048](https://freesound.org/people/vumseplutten1709/sounds/320048/), vumseplutten1709 | CC0 marker recorded | `3F5C0F494480B7C4E4019F0F8DADB95C30740A44D333191F09C3AFB9BAFB7818` | CC0 source recorded; processing chain needs reconciliation with older hash record |
| Brainwave sleep | Video `binaural-calm-light.mp4` | [Pexels 28561463](https://www.pexels.com/video/28561463/), Chandresh Uike | Pexels Free license page was checked in a browser | `E53FE5B2AAA5560B0C466A35E5C46D115B3C7028F0EA0F30CFA9EEBA9BC1FE5E` | Source and license recorded; redistribution packaging scope must follow Pexels terms |
| Brainwave sleep | Audio `brainwave-balanced.wav` | [Freesound 138394](https://freesound.org/people/Robert%20Yourell/sounds/138394/), Robert Yourell | CC0 marker recorded; author describes an approximately 8 Hz gradually varying theta binaural exercise | `FC3F79181FADBB4CC6EC1CD552B3A45AC5D95ADF40F8E13F697F8755BCFA25BF` | CC0 source and processing script recorded |

## Audio Processing

The seven playback WAV files are processed outputs. Source downloads, processing scripts, and historical hashes are documented in `CC0_AUDIO_SOURCES.md`, `tools/process-*.cjs`, and `MEDIA_PROVENANCE_CURRENT.md`. Some output hashes differ from older records; the hashes above follow the audit dated 2026-10-28. Individual download dates were not recorded for all 14 assets; the audit date is not a substitute for each download date.

## Icon

The leaf icon is based on the Lucide `Leaf` vector icon, using Lucide v1.8.0. The bundled `web/lucide.js` header identifies the ISC license. Project files include `web/leaf.svg`, `android/res/drawable/ic_leaf.xml`, and `leaf-icon.png` exported from the vector. The icon is not an original work created independently by the project author. Preserve Lucide's copyright and ISC license notice with the Lucide software.

## License References and Historical Files

- Lucide ISC: https://github.com/lucide-icons/lucide/blob/main/LICENSE
- Mixkit Video Free License: https://mixkit.co/license/
- Pexels License: https://www.pexels.com/license/
- Freesound CC0 1.0: https://creativecommons.org/publicdomain/zero/1.0/

Git history may retain older media and candidates that are not in the current playlist. Historical presence does not mean current use or verified redistribution permission. See `ASSET_LICENSE_AUDIT.md`, `RECORDED_LICENSE_EVIDENCE.md`, and `MEDIA_PROVENANCE_CURRENT.md` for the detailed audit and known gaps.
