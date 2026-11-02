[English](CC0_AUDIO_SOURCES.md) | 简体中文

# 当前预览音频来源与处理记录

核查日期：2026-10-28
当前网页清单：以 `web/tracks.js` 为准。网页实际使用 7 条音频，最后一条是脑波助眠；旧粉红噪音素材不属于当前网页清单。

Freesound 条目页在核查时标注 Creative Commons 0 (CC0)。CC0 通常允许复制、修改和分发，包括商业使用且不要求署名。该结论只适用于对应来源上传者提供的录音，不覆盖页面以外的第三方权利，也不替代保留页面和许可证据。官方许可文本：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。

## 当前实际文件

| 音景 | Freesound 条目 / 作者 | 当前网页成品 / SHA-256 | 留存来源文件 / SHA-256 | 当前核查说明 |
|---|---|---|---|---|
| 热带雨林 | [422052](https://freesound.org/people/florianreichelt/sounds/422052/) / florianreichelt | `web/media/rain-jungle-balanced.wav`<br>`0C3A05F8086E66F4B0172C4BF1C322BFE7AFEC3181FAA7A6768135512AFADF5A` | `tools/cc0-audio/replacements/rain-jungle-online.mp3`<br>`CCC718A44325BF104510B694C9D94937A56C2417C777C8781B4DC53B0E54A91C` | 来源 MP3 哈希与 2026-10-27 记录相符；输出 WAV 哈希与当前主记录相符。 |
| 海浪 | [867642](https://freesound.org/people/bassimat/sounds/867642/) / bassimat | `web/media/waves-balanced.wav`<br>`51D90AC089A9682CB56D11F8962156477DF9B19F933F588F6A56C1549C9D2719` | `tools/cc0-audio/replacements/waves-online.mp3`<br>`16E5CC70990C0248889A9AADF9C8F2DC0650DFB2CA4E10A13A125B6E60B3B25E` | 来源编号来自既有记录；当前来源哈希和输出哈希均不同于旧表所记。处理脚本/参数尚未能重现当前成品。 |
| 溪流 | [446019](https://freesound.org/people/BurghRecords/sounds/446019/) / BurghRecords | `web/media/stream-balanced.wav`<br>`004793FEACACD224D4D076C17273F16D40CCA52CF7F4EC9879D275AB1E287221` | `tools/cc0-audio/stream-preview.mp3`<br>`59A18DB8C6FAFBD3F3CEC5C46BF5F878F5E55DE76167A242119AFCC4AC0F854E` | 来源 MP3 哈希与旧记录一致；当前输出哈希不同于旧表。处理脚本/参数尚未能重现当前成品。 |
| 夜间虫鸣 | [751467](https://freesound.org/people/Borgory/sounds/751467/) / Borgory | `web/media/forest-night-balanced.wav`<br>`7CF7AD952C338A1E7C807BC4C9F339EED8971012BC03424C297A66E2E54D54D3` | `tools/cc0-audio/replacements/forest-night-new.mp3`<br>`95F72949D317DEAFB2EFABFE27B6A557E25C9BFCD66ED71C1C709855B53FCCDE` | 来源 MP3 哈希与既有记录一致；当前输出哈希不同于旧表。处理脚本/参数尚未能重现当前成品。 |
| 篝火 | [714566](https://freesound.org/people/LilMati/sounds/714566/) / LilMati | `web/media/campfire-balanced.wav`<br>`241B4D9EAEC752FBEFA229F03605DAD22AB64493524CA47888379DCDD3E5AA7F` | `tools/cc0-audio/replacements/campfire-new.mp3`<br>`C00456052185C6782AA43987977DB4A966EBEA4252BAE892DF7A803E4E35EC22` | 来源 MP3 哈希与既有记录一致；当前输出哈希不同于旧表。处理脚本/参数尚未能重现当前成品。 |
| 助眠音乐 | [320048](https://freesound.org/people/vumseplutten1709/sounds/320048/) / vumseplutten1709 | `web/media/sleep-music-balanced.wav`<br>`3F5C0F494480B7C4E4019F0F8DADB95C30740A44D333191F09C3AFB9BAFB7818` | `tools/cc0-audio/replacements/sleep-music-new.mp3`<br>`40FF0E6E19271303A2339ECDD1A77C3E62FC49012D01272957FBAFF5D72FCEC0` | 来源 MP3 哈希与既有记录一致；当前输出哈希不同于旧表。处理脚本/参数尚未能重现当前成品。 |
| 脑波助眠 | [138394](https://freesound.org/people/Robert%20Yourell/sounds/138394/) / Robert Yourell | `web/media/brainwave-balanced.wav`<br>`FC3F79181FADBB4CC6EC1CD552B3A45AC5D95ADF40F8E13F697F8755BCFA25BF` | `tools/cc0-audio/replacements/yourell-theta-138394.mp3`<br>`89F37100B1F33BDDBB47651EB5528EF2AF16E6E4A0855A33262BF3484BD8699F` | 页面标题为 Yourell_Theta_Vary_Speed_Simple_01.wav；作者说明这是由两个正弦波构成的经典 Theta 脑波引导音，约 8 Hz，速度缓慢变化；页面标注 CC0。归档的是官方 HQ 试听 MP3；成品为 120 秒循环，首尾 3 秒交叉淡化并响度归一化。处理命令见 `tools/process-yourell-theta.cjs`。 |

## 处理链完整性

`tools/process-cc0-audio.cjs` 说明了 44.1 kHz、双声道、PCM WAV、120 秒、响度归一化以及 3 秒淡入淡出/循环交叉淡化的处理方式。但它不能复现表中全部当前输出：当前海浪、溪流、夜间虫鸣、篝火、助眠音乐五条 WAV 的 SHA-256 与早期记录不同，且当前配置使用的来源文件也有差异。不要把旧表中的输出哈希说成当前成品哈希。

当前可直接核对的事实是：来源候选文件均保存在 `tools/cc0-audio/`，当前 WAV 均保存在 `web/media/`，两者各自哈希如上；对应 Freesound 条目曾在旧记录中被标记 CC0，且雨林条目页本次自动核查重新确认出现 `Creative Commons 0`。尚缺逐个来源页的保存副本以及 5 条输出的可复现加工记录。公开发行前应补齐，不能仅凭音频文件名推定处理来源。

## 历史来源（不属于当前网页成品）

`CC0_AUDIO_SOURCES.md` 以前的表格混合了多个替换批次，包括 765980、635104、446019、750874、588401、867839、75309 等条目及不同版本 WAV 哈希。除当前表中实际对应的来源外，其他记录仅供历史追查；不要将这些旧链接/哈希当作当前版本授权清单。历史的“双耳节拍”音频也已不是网页当前音频。

下载候选来源的哈希可以帮助确认本机文件是否被改动，但哈希本身不证明许可。每项正式归档建议另存：条目页、许可证页、作者/条目编号、下载日期、原始下载文件哈希、处理命令和成品哈希。
