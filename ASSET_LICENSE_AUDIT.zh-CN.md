# 当前音视频素材授权审计

核查日期：2026-10-28
适用范围：电脑预览网页 `web/tracks.js` 当前引用的 7 个音景，共 7 个视频和 7 个音频。
用途：记录来源、核查结果、文件哈希和公开分发前的缺口。本记录不是法律意见，也不代表已经取得作者书面授权。

## 总结

- 7 条音频的 Freesound 条目均可访问；本次请求到的条目 HTML 均含 Creative Commons 0 (CC0) 标记。CC0 通常允许复制、修改和再分发，但应保留条目/许可证据及处理记录。
- 4 段当前视频来自 Mixkit，条目页均标记 `videoFree`；Video Free License 列出下载、复制、修改和分发等许可。User Terms 对类似或竞争产品/服务另有限制，针对本应用以及公开 Git/LFS、APK 分发方式尚无个案书面答复。
- 3 段当前视频来自 Pexels，已在真实浏览器中逐项打开；页面均显示 Free 许可、作者及与当前画面相符的标题。Pexels 条款对独立素材再分发有限制；本应用公开仓库和 APK 内嵌素材的具体适用方式仍需按完整条款评估。
- 当前 7 个音频和 7 个视频均记录了来源页面或平台许可依据，但这不等于每一种公开再分发方式都已确认。许可类型、链接、作者、哈希与核对说明见下表；状态汇总见 `THIRD_PARTY_NOTICES.md`。

## 当前 14 项

哈希为本机当前文件 SHA-256。音频许可状态指来源条目的许可标记，不自动覆盖成品加工记录或其他第三方权利。

| 音景 | 视频来源与状态 | 音频来源与状态 |
|---|---|---|
| 热带雨林 | Mixkit [22728](https://mixkit.co/free-stock-video/rainforest-22728/)，页面可访问，HTML 标记 `videoFree`，标题为 “Raining in a cloud forest full of tall trees”。现文件 `web/media/rain-loop4k.mp4`，SHA-256 `65427242CD317E93D694111BB94B871ACA4AD09961BA1F9EAFC61BA211033C20`。Video Free License 允许分发；User Terms 的竞争产品限制仍需书面解释。 | Freesound [422052](https://freesound.org/people/florianreichelt/sounds/422052/)，作者 florianreichelt；本次页面可访问并出现 CC0 标记。来源文件 `tools/cc0-audio/replacements/rain-jungle-online.mp3` SHA-256 `CCC718A44325BF104510B694C9D94937A56C2417C777C8781B4DC53B0E54A91C`；网页成品 `web/media/rain-jungle-balanced.wav` SHA-256 `0C3A05F8086E66F4B0172C4BF1C322BFE7AFEC3181FAA7A6768135512AFADF5A`。 |
| 海浪 | Mixkit [5016](https://mixkit.co/free-stock-video/waves-coming-to-the-beach-5016/)，页面可访问，HTML 标记 `videoFree`，标题为 “Waves coming to the beach”。现文件 `web/media/waves-4k.mp4`，SHA-256 `D10EC7D89415DFDC80D80A1733219459C8EC28F57D5FADACE20B5C419C50E97B`。Video Free License 允许分发；竞争产品限制仍需书面解释。 | Freesound [867642](https://freesound.org/people/bassimat/sounds/867642/)，作者 bassimat；本次页面可访问并出现 CC0 标记。来源文件 `tools/cc0-audio/replacements/waves-online.mp3` SHA-256 `16E5CC70990C0248889A9AADF9C8F2DC0650DFB2CA4E10A13A125B6E60B3B25E`；成品 `waves-balanced.wav` SHA-256 `51D90AC089A9682CB56D11F8962156477DF9B19F933F588F6A56C1549C9D2719`。来源和成品哈希与早期记录不同，处理链需复核。 |
| 溪流 | Mixkit [51585](https://mixkit.co/free-stock-video/flying-over-a-relaxing-creek-full-of-rock-on-the-51585/)，页面可访问，HTML 标记 `videoFree`，标题为 “Flying over a relaxing creek full of rock on the countryside”。现文件 `web/media/stream-clear.mp4`，SHA-256 `CD2A8521087709A644922573206C566B4C58C33418D1E23D11CA1B124FE0DDD1`。Video Free License 允许分发；竞争产品限制仍需书面解释。 | Freesound [446019](https://freesound.org/people/BurghRecords/sounds/446019/)，作者 BurghRecords；本次页面可访问并出现 CC0 标记。来源文件 `tools/cc0-audio/stream-preview.mp3` SHA-256 `59A18DB8C6FAFBD3F3CEC5C46BF5F878F5E55DE76167A242119AFCC4AC0F854E`；成品 `stream-balanced.wav` SHA-256 `004793FEACACD224D4D076C17273F16D40CCA52CF7F4EC9879D275AB1E287221`。成品哈希与早期记录不同，处理链需复核。 |
| 夜间虫鸣 | Pexels [29644229](https://www.pexels.com/video/spectacular-star-trails-over-forest-at-night-29644229/)，作者 Dubang chang；标题 “Spectacular Star Trails Over Forest at Night”，显示 Free，3840×2160；真实浏览器核实。现文件 `web/media/summer-night4k.mp4`，SHA-256 `1C07CEB1354B43F4A36BCEA3DE6BDC19EF26609AE2C36DFA88573B120287E953`。 | Freesound [751467](https://freesound.org/people/Borgory/sounds/751467/)，作者 Borgory；本次页面可访问并出现 CC0 标记。来源文件 `tools/cc0-audio/replacements/forest-night-new.mp3` SHA-256 `95F72949D317DEAFB2EFABFE27B6A557E25C9BFCD66ED71C1C709855B53FCCDE`；成品 `forest-night-balanced.wav` SHA-256 `7CF7AD952C338A1E7C807BC4C9F339EED8971012BC03424C297A66E2E54D54D3`。成品哈希与早期记录不同，处理链需复核。 |
| 篝火 | Pexels [31206562](https://www.pexels.com/video/31206562/)，作者 Shanto Debnath；标题 “Warm and Inviting Campfire Flames”，显示 Free，3840×2160；真实浏览器核实。现文件 `web/media/campfire-close.mp4`，SHA-256 `E9EEDC3602D1917C7A6B6FB1BF9F5C685E38F24DCF49462E766925517CA57943`。 | Freesound [714566](https://freesound.org/people/LilMati/sounds/714566/)，作者 LilMati；本次页面可访问并出现 CC0 标记。来源文件 `tools/cc0-audio/replacements/campfire-new.mp3` SHA-256 `C00456052185C6782AA43987977DB4A966EBEA4252BAE892DF7A803E4E35EC22`；成品 `campfire-balanced.wav` SHA-256 `241B4D9EAEC752FBEFA229F03605DAD22AB64493524CA47888379DCDD3E5AA7F`。成品哈希与早期记录不同，处理链需复核。 |
| 助眠音乐 | Mixkit CDN 下载脚本 `tools/clear-scenes.ps1` 使用视频编号 40047；对应可访问页面 [40047](https://mixkit.co/free-stock-video/moon-detail-40047/) 的 HTML 标记 `videoFree`，标题是 “Skyline of a desert with the moon at night”。此前写作 3350 是错误的。现文件 `web/media/music-moon.mp4` SHA-256 `7B9EFE5457973C67714565D4CAE30FEE1DD5BF6300D2E417B9683297E10C67AE`，与 `tools/moon-detail.mp4` 同哈希。Video Free License 允许分发；竞争产品限制仍需书面解释。 | Freesound [320048](https://freesound.org/people/vumseplutten1709/sounds/320048/)，作者 vumseplutten1709；本次页面可访问并出现 CC0 标记。来源文件 `tools/cc0-audio/replacements/sleep-music-new.mp3` SHA-256 `40FF0E6E19271303A2339ECDD1A77C3E62FC49012D01272957FBAFF5D72FCEC0`；成品 `sleep-music-balanced.wav` SHA-256 `3F5C0F494480B7C4E4019F0F8DADB95C30740A44D333191F09C3AFB9BAFB7818`。成品哈希与早期记录不同，处理链需复核。 |
| 脑波助眠 | Pexels [28561463](https://www.pexels.com/video/28561463/)，作者 Chandresh Uike；标题 “Dynamic Futuristic Waveform Animation”，显示 Free，3840×2160；真实浏览器核实。现文件 `web/media/binaural-calm-light.mp4`，SHA-256 `E53FE5B2AAA5560B0C466A35E5C46D115B3C7028F0EA0F30CFA9EEBA9BC1FE5E`。 | Freesound [138394](https://freesound.org/people/Robert%20Yourell/sounds/138394/)，作者 Robert Yourell；作者说明为约 8 Hz、缓慢变化的 Theta 脑波引导音，页面标注 CC0。官方 HQ 试听 MP3 保存在 `tools/cc0-audio/replacements/yourell-theta-138394.mp3`，SHA-256 `89F37100B1F33BDDBB47651EB5528EF2AF16E6E4A0855A33262BF3484BD8699F`；输出 `web/media/brainwave-balanced.wav` SHA-256 `FC3F79181FADBB4CC6EC1CD552B3A45AC5D95ADF40F8E13F697F8755BCFA25BF`，由 `tools/process-yourell-theta.cjs` 制作。 |

## 官方许可页面与本次访问结果

- Mixkit [Video Free License](https://mixkit.co/license/modal/videoFree/)：当前使用条目为 22728、5016、51585、40047，均记录为 `videoFree`。User Terms 的竞争产品限制对本应用及素材分发方式是否适用，尚未获个案书面解释。
- Pexels [License](https://www.pexels.com/license/)：2026-10-28 通过真实浏览器逐项核实 29644229（Dubang chang）、31206562（Shanto Debnath）、28561463（Chandresh Uike）；均显示 Free。具体条款对本项目公开仓库与 APK 内嵌素材的适用方式仍需按完整许可判断，见 `PEXELS_BROWSER_VERIFICATION_2026-10-28.zh-CN.md`。
- Freesound 当前七个条目均 HTTP 200，响应 HTML 中均检出 Creative Commons 0 标记；使用 CC0 官方说明：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。建议另保存每个条目页的本地副本或 PDF，并记录下载日期。

## 待办：发布可下载版本前

1. 保留 Mixkit 条目和 Video Free License 记录；若未来应用增加素材搜索、下载或素材库功能，重新评估 User Terms。
2. 将本次 Pexels 浏览器核对的条目 URL、作者、许可和下载日期作为发行归档，详见 `PEXELS_BROWSER_VERIFICATION_2026-10-28.zh-CN.md`。
3. 为 7 条音频保存条目页与 CC0 标记证据；记录来源文件、处理脚本/参数、输出文件哈希。当前五条输出 WAV 哈希与早期记录不一致，优先补可复现处理记录。
4. 检查最终 GitHub 提交、APK 和其他下载包是否实际包含媒体文件。源码采用何种项目许可证，不会自动改变第三方音视频素材的许可。

## 关联记录

- 当前网页清单和 14 个文件的哈希：`MEDIA_PROVENANCE_CURRENT.zh-CN.md`
- 当前音频来源、处理链及历史条目区分：`CC0_AUDIO_SOURCES.zh-CN.md`
- 当前播放器配置：`web/tracks.js`
- Mixkit 条款咨询草稿：`MIXKIT_PERMISSION_REQUEST_DRAFT.md`（草稿不是已发送请求，也不是许可答复）
