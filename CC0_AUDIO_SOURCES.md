# Current Preview Audio Sources and Processing Records

English | [简体中文](CC0_AUDIO_SOURCES.zh-CN.md)

Audit date: 2026-10-28. The current web playlist is `web/tracks.js` and uses seven audio tracks; the last is brainwave sleep. Older pink-noise media is not in the current playlist.

The recorded Freesound item pages showed a Creative Commons 0 (CC0) marker. CC0 generally permits copying, modification, and distribution, including commercial use without attribution. This applies to the corresponding recording supplied by the uploader; it does not cover unrelated third-party rights or replace keeping source-page and license evidence. Official text: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

## Current Files

| Track | Freesound item / creator | Current web output / SHA-256 | Retained source / SHA-256 | Current check |
|---|---|---|---|---|
| Rainforest | [422052](https://freesound.org/people/florianreichelt/sounds/422052/) / florianreichelt | `web/media/rain-jungle-balanced.wav`<br>`0C3A05F8086E66F4B0172C4BF1C322BFE7AFEC3181FAA7A6768135512AFADF5A` | `tools/cc0-audio/replacements/rain-jungle-online.mp3`<br>`CCC718A44325BF104510B694C9D94937A56C2417C777C8781B4DC53B0E54A91C` | Source hash matches the 2026-10-27 record; output hash matches the current main record. |
| Waves | [867642](https://freesound.org/people/bassimat/sounds/867642/) / bassimat | `web/media/waves-balanced.wav`<br>`51D90AC089A9682CB56D11F8962156477DF9B19F933F588F6A56C1549C9D2719` | `tools/cc0-audio/replacements/waves-online.mp3`<br>`16E5CC70990C0248889A9AADF9C8F2DC0650DFB2CA4E10A13A125B6E60B3B25E` | Item ID is from existing records; source and output hashes differ from older records. Processing parameters do not yet reproduce the current output. |
| Stream | [446019](https://freesound.org/people/BurghRecords/sounds/446019/) / BurghRecords | `web/media/stream-balanced.wav`<br>`004793FEACACD224D4D076C17273F16D40CCA52CF7F4EC9879D275AB1E287221` | `tools/cc0-audio/stream-preview.mp3`<br>`59A18DB8C6FAFBD3F3CEC5C46BF5F878F5E55DE76167A242119AFCC4AC0F854E` | Source hash matches an older record; current output hash differs. Processing parameters do not yet reproduce the current output. |
| Night insects | [751467](https://freesound.org/people/Borgory/sounds/751467/) / Borgory | `web/media/forest-night-balanced.wav`<br>`7CF7AD952C338A1E7C807BC4C9F339EED8971012BC03424C297A66E2E54D54D3` | `tools/cc0-audio/replacements/forest-night-new.mp3`<br>`95F72949D317DEAFB2EFABFE27B6A557E25C9BFCD66ED71C1C709855B53FCCDE` | Source hash matches existing records; current output hash differs. Processing parameters do not yet reproduce the current output. |
| Campfire | [714566](https://freesound.org/people/LilMati/sounds/714566/) / LilMati | `web/media/campfire-balanced.wav`<br>`241B4D9EAEC752FBEFA229F03605DAD22AB64493524CA47888379DCDD3E5AA7F` | `tools/cc0-audio/replacements/campfire-new.mp3`<br>`C00456052185C6782AA43987977DB4A966EBEA4252BAE892DF7A803E4E35EC22` | Source hash matches existing records; current output hash differs. Processing parameters do not yet reproduce the current output. |
| Sleep music | [320048](https://freesound.org/people/vumseplutten1709/sounds/320048/) / vumseplutten1709 | `web/media/sleep-music-balanced.wav`<br>`3F5C0F494480B7C4E4019F0F8DADB95C30740A44D333191F09C3AFB9BAFB7818` | `tools/cc0-audio/replacements/sleep-music-new.mp3`<br>`40FF0E6E19271303A2339ECDD1A77C3E62FC49012D01272957FBAFF5D72FCEC0` | Source hash matches existing records; current output hash differs. Processing parameters do not yet reproduce the current output. |
| Brainwave sleep | [138394](https://freesound.org/people/Robert%20Yourell/sounds/138394/) / Robert Yourell | `web/media/brainwave-balanced.wav`<br>`FC3F79181FADBB4CC6EC1CD552B3A45AC5D95ADF40F8E13F697F8755BCFA25BF` | `tools/cc0-audio/replacements/yourell-theta-138394.mp3`<br>`89F37100B1F33BDDBB47651EB5528EF2AF16E6E4A0855A33262BF3484BD8699F` | Page title is `Yourell_Theta_Vary_Speed_Simple_01.wav`; the author describes a classic, gradually varying, approximately 8 Hz theta binaural guide made from two sine waves. The page shows CC0. The retained source is the official HQ preview MP3; output is a 120-second loop with a 3-second end-to-start crossfade and loudness normalization. See `tools/process-yourell-theta.cjs`. |

## Processing-Chain Completeness

`tools/process-cc0-audio.cjs` describes 44.1 kHz, stereo PCM WAV, 120-second duration, loudness normalization, and 3-second fades/loop crossfades. It does not reproduce all current outputs: the current Waves, Stream, Night insects, Campfire, and Sleep music WAV hashes differ from older records, and some source-file mappings also differ. Do not describe old output hashes as current.

Currently verifiable facts: source candidates are retained in `tools/cc0-audio/`, current WAV files are in `web/media/`, and their hashes are listed above. Existing records mark the corresponding Freesound items as CC0; the Rainforest item page was automatically rechecked and showed “Creative Commons 0.” Saved copies of each source page and reproducible processing records for five outputs are still missing. File names alone do not establish provenance.

## Historical Sources Not Used by the Current Web Outputs

Older versions of this file mixed replacement batches, including items 765980, 635104, 446019, 750874, 588401, 867839, and 75309, with multiple WAV hashes. Except for sources mapped to current files above, those records are for historical research and are not the current license inventory. The historical binaural-beat audio is also not the current web audio.

Source hashes can help detect local file changes but do not prove license rights. For each release asset, archive the item page, license page, creator/item ID, download date, original-file hash, processing command, and output hash.
