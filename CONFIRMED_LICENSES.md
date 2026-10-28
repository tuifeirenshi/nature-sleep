# 已确认许可依据清单

核查日期：2026-10-28  
范围：当前网页预览 `web/tracks.js` 的 7 个音频和 7 个视频。  
说明：这里的“已确认”表示官方页面能找到相应许可依据；不代表作者对本项目出具了单独书面授权。

## 已确认来源许可

### 音频：7/7，Freesound CC0

本次访问 7 个 Freesound 条目均返回 HTTP 200，并在页面 HTML 中检出 Creative Commons 0 (CC0) 标记。CC0 允许复制、修改和再分发，通常也允许商业使用。

| 音景 | 条目 | 当前文件 |
|---|---|---|
| 热带雨林 | [Freesound 422052](https://freesound.org/people/florianreichelt/sounds/422052/) | `web/media/rain-jungle-balanced.wav` |
| 海浪 | [Freesound 867642](https://freesound.org/people/bassimat/sounds/867642/) | `web/media/waves-balanced.wav` |
| 溪流 | [Freesound 446019](https://freesound.org/people/BurghRecords/sounds/446019/) | `web/media/stream-balanced.wav` |
| 夜间虫鸣 | [Freesound 751467](https://freesound.org/people/Borgory/sounds/751467/) | `web/media/forest-night-balanced.wav` |
| 篝火 | [Freesound 714566](https://freesound.org/people/LilMati/sounds/714566/) | `web/media/campfire-balanced.wav` |
| 助眠音乐 | [Freesound 320048](https://freesound.org/people/vumseplutten1709/sounds/320048/) | `web/media/sleep-music-balanced.wav` |
| 脑波助眠 | [Freesound 138394](https://freesound.org/people/Robert%20Yourell/sounds/138394/) | `web/media/brainwave-balanced.wav` |

### 视频：4/7，Mixkit Video Free License

以下 4 个当前使用的 Mixkit 条目页均返回 `data-license="videoFree"`。官方许可页明确允许下载、复制、修改、分发、公开表演和广播，并允许商业和非商业项目。

| 音景 | 条目 | 当前文件 |
|---|---|---|
| 热带雨林 | [Mixkit 22728](https://mixkit.co/free-stock-video/rainforest-22728/) | `web/media/rain-loop4k.mp4` |
| 海浪 | [Mixkit 5016](https://mixkit.co/free-stock-video/waves-coming-to-the-beach-5016/) | `web/media/waves-4k.mp4` |
| 溪流 | [Mixkit 51585](https://mixkit.co/free-stock-video/flying-over-a-relaxing-creek-full-of-rock-on-the-51585/) | `web/media/stream-clear.mp4` |
| 助眠音乐 | [Mixkit 40047](https://mixkit.co/free-stock-video/moon-detail-40047/) | `web/media/music-moon.mp4` |

许可原文：[Mixkit Video Free License](https://mixkit.co/license/modal/videoFree/)。

## Pexels 视频：3/3，页面已核实

以下 3 个 Pexels 视频已在 2026-10-28 通过真实浏览器逐项打开。页面均显示 Free 许可、作者和与当前画面相符的标题；Pexels 官方许可允许用于 app 并允许修改，同时禁止把视频作为 stock photo 或 wallpaper 平台再分发。

| 音景 | 条目 | 作者、标题和许可 | 当前文件 |
|---|---|---|---|
| 夜间虫鸣 | [Pexels 29644229](https://www.pexels.com/video/spectacular-star-trails-over-forest-at-night-29644229/) | Dubang chang；Spectacular Star Trails Over Forest at Night；Free | `web/media/summer-night4k.mp4` |
| 篝火 | [Pexels 31206562](https://www.pexels.com/video/31206562/) | Shanto Debnath；Warm and Inviting Campfire Flames；Free | `web/media/campfire-close.mp4` |
| 脑波助眠 | [Pexels 28561463](https://www.pexels.com/video/28561463/) | Chandresh Uike；Dynamic Futuristic Waveform Animation；Free | `web/media/binaural-calm-light.mp4` |

通用许可：[Pexels License](https://www.pexels.com/license/)。

## 当前结论

- 已确认有明确来源许可标记：**7 个音频 + 4 个 Mixkit 视频**。
- Pexels 的 3 个视频已在真实浏览器中逐项核实作者、标题和 Free 许可。详细记录见 `PEXELS_BROWSER_VERIFICATION_2026-10-28.md`。
- Mixkit Video Free License 的 User Terms 仍包含“类似或竞争产品/服务”限制；当前应用是播放器而不是素材平台，未发现其与 Mixkit 竞争，但这不是 Mixkit 的个案书面答复。
- 完整哈希和处理链见 `ASSET_LICENSE_AUDIT.md`、`MEDIA_PROVENANCE_CURRENT.md`、`CC0_AUDIO_SOURCES.md`。
