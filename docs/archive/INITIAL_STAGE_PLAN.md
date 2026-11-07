[English](#english) | [简体中文](#简体中文)

# Archived Initial-Stage Plan

## English

This plan described an earlier development stage and is retained as historical context. Its version numbers, file paths, proposed steps, and completion criteria are not current instructions. Follow the current bilingual README and current source/license records instead. This archive does not describe the current release. Statements below about missing Git setup, planned features, media policy, and timer behavior describe that earlier stage, not today's project.

### Scope of the historical plan

Stabilize Android and organize the project so tracks, interface changes, and bug fixes are easier to maintain. Do not rush decisions on a code license, pricing, advertising, Google Play, Windows, iOS, or macOS. Start recording and checking media provenance, license categories, and public source/APK redistribution rights immediately, rather than waiting until upload.

Public-release inventory references: `../licensing/PROJECT_LICENSES.md`, `../licensing/PROJECT_LICENSES.zh-CN.md`, `../media/MEDIA_CATALOG.md`, and `../media/MEDIA_CATALOG.zh-CN.md`. This is a historical plan, not the current release structure.

### Baseline at that stage

- Project: `D:\codex\rain-sleep`; desktop launcher: `open-preview.cmd`; preview: `http://127.0.0.1:8768`.
- APK: an early prerelease package, not the current release; build entry: `build.ps1`.
- Web interface: `web\index.html`, `web\app.js`, and `web\style.css`.
- Android page assets: copied from `web` to `android\package-assets` during the build.
- Background audio: `android\src\com\rainsleep\app\RainService.java`; page bridge: `android\src\com\rainsleep\app\MainActivity.java`.
- Seven scenes: rainforest, waves, stream, night insects, campfire, sleep music, and brainwave sleep.

### Step 0: Freeze a recoverable version

Purpose: return to an installable baseline if later changes fail.

1. Retain the early prerelease APK; do not overwrite historical test packages.
2. Create local Git history and a checkpoint named `v14-before-cleanup`. Explain Git as a code save point; this step creates no GitHub repository and uploads nothing.
3. Back up APKs and large media separately instead of repeatedly adding copies to code history.
4. Start the desktop preview and record whether each of the seven scenes plays.
5. Record five timer cases: setting before playback, changing during playback, canceling, pausing/resuming, and reaching zero.
6. Append dated/versioned results to `TEST_LOG.md`.

Completion: a clear before-change record, a reinstallable v14 APK, and a recoverable local code checkpoint.

### Step 0.5: Record sources and licenses

Purpose: avoid discovering too late that a video or sound cannot be distributed with public source or an installer.

1. Use the seven groups in the media catalogs as the reference; not every old file under `web\media` is active.
2. Register both video and audio for each scene: 14 packaged files. Record original item URL/ID, creator, download date, license at download, SHA-256, processed filename, and processing. Existing audit notes had filenames/source clues but not all 14 download-evidence records.
3. Assess public source redistribution and public APK redistribution separately. Commercial use or private listening permission alone does not establish permission to publish original files.
4. Mark unclear sources or insufficient evidence as pending in personal debug versions, especially the brainwave video and applicability of Mixkit terms; refer to the license records.
5. Check sound-effect coverage for offline APK distribution and music coverage for looping, crossfades, and app delivery. Ask the source provider or replace unclear material rather than guessing.
6. Retain downloaded license/item pages, screenshots or PDFs, license-text versions, and processing records so later webpage changes do not erase the original basis.

Key distinctions in the original plan:

- Downloading or personally using a file does not establish permission to publish it for everyone.
- Publishing code and publishing a complete APK are separate distributions. The APK still distributes embedded audio/video even if the source repository omits it.
- Attribution records a source; it does not itself grant permission. Record unclear rights as pending.
- Pricing and a formal code license need not be decided yet, but each file's source/APK rights determine whether it is retained, replaced, or omitted.
- The project had no Git repository at that stage. Before creating GitHub history, ignore `dist` APKs, `tools\rain-sleep.keystore`, plaintext script passwords, Android tool downloads, old media, and scratch files. The APK then measured approximately 562 MiB and `web\media` approximately 2.17 GB; ordinary GitHub Git rejected files above 100 MiB.

Completion criteria in that original plan: each file has source/processing evidence and a conclusion of public-source allowed, public-APK allowed, replacement needed, or written confirmation pending. Pending files were to be excluded from public source and installers. This historical criterion does not replace later recorded release decisions.

### Step 1: Separate track data from playback code

Purpose: add a sound by editing one record rather than searching multiple code locations. Proposed file: `web\tracks.js`.

```js
{
  id: 'campfire',
  name: '篝火',
  icon: 'flame',
  video: 'campfire-close',
  audio: 'campfire-balanced',
  title: '听火焰轻轻作响'
}
```

1. Move the `tracks` array from `web\app.js` into `web\tracks.js`.
2. Store audio filenames explicitly and remove implicit filename construction.
3. Load `tracks.js` before `app.js` in `index.html`.
4. Continue copying shared web scripts for Android so desktop and APK use one list.
5. Add a scene by supplying video, audio, and a record in `tracks.js`.

Completion: a test scene requires only resources and a track record, without changing timer, playback, switching, or layout code.

### Step 2: Standardize resource paths and names

Purpose: avoid missing videos and mismatched web/Android resources. Use `web\media` and one scene ID per pair. Historical proposed pairs:

- `rain-jungle-balanced.wav` + `rain-loop4k.mp4`
- `waves-balanced.wav` + `waves-4k.mp4`
- `stream-balanced.wav` + `stream-clear.mp4`
- `forest-night-balanced.wav` + `summer-night.mp4`
- `campfire-balanced.wav` + `campfire-close.mp4`
- `sleep-music-balanced.wav` + `music-moon.mp4`
- `binaural-balanced.wav` + `binaural-calm-light.mp4`

1. Add explicit `audio` and `video` fields; do not guess names in playback code.
2. Add a check for missing or empty files per track.
3. Check audio sample rate, channels, and peaks; reprocess excessively loud/quiet material before replacing it.
4. Verify videos can decode at least their first frame to avoid empty playback backgrounds.

Completion: all seven scenes pass one check and use the same filenames on web and Android.

### Step 3: Fix playback and timer rules

Purpose: settle confusing behavior before further visual work. These were proposed rules at that stage:

1. With no timer, show “Continuous playback”.
2. A timer set before playback begins counting down when playback starts.
3. Changing it during playback restarts the full selected duration.
4. Clicking the selected duration cancels the timer and restores continuous playback.
5. Pausing stops the current session, clears its timer, and removes timer selection highlights.
6. Resuming does not restore the old countdown unless a future remember-timer setting is added.
7. At zero, fade audio out, stop playback, and show “Timer ended”.

Review `web\app.js`, `RainService.java`, and the web/Android status bridge in `MainActivity.java`. Completion: both platforms follow all seven rules; scene switching does not reset the timer unless the user changes it.

### Step 4: Use data-driven responsive layout

Purpose: display one content set across phone, tablet, and desktop without breaking layout when scenes are added.

1. Generate scene buttons from `tracks.js`.
2. Use a horizontal scrollable list, one row on wide screens and horizontal swiping on narrow ones.
3. Avoid per-scene fixed positions or a special patch for the seventh item.
4. Keep one play button, one timer area, and one settings entry.
5. Provide clear pressed, selected, and disabled states without abrupt blue browser highlights.
6. Minimal mode only hides video and retains audio; it does not change scene/timer rules.

Completion: check 390 × 844 phone, 600 × 1024 tablet, 1280 × 800 landscape, and 1440 × 900 desktop. No horizontal overflow or button overlap; scene scrolling works.

### Step 5: Establish a test checklist before generating an APK

After each code change, the original plan prescribed:

1. Desktop preview: page load, all seven scenes, play/pause, and seven timer rules.
2. Browser console: no unhandled JavaScript errors; video failure leaves controls usable.
3. Check all four viewport sizes.
4. Run `powershell -ExecutionPolicy Bypass -File .\build.ps1`.
5. Keep only the latest three installable APKs under `dist`.
6. Install on at least one Android 8.0+ device and test locked-screen playback, notification pause, scene switching, timer changes, expiry, and reopening the app.
7. Mark the new APK installable only after device testing passes.

Completion: record passed/failed/not tested for each case; “should work” is not device-test evidence. This is an archived workflow, not authorization to build APKs automatically.

### Work intentionally deferred at that stage

- Do not migrate to Flutter, React Native, or another framework. Java + WebView + local assets already covers phones/tablets; migration adds compatibility work.
- Do not stream videos from the network; offline sleep playback avoids interruptions.
- Defer pricing, ads, analytics, stores, and code-license decisions, but perform step 0.5 first. A code license cannot license third-party media.
- Do not publish the current APK, entire folder, or whole `tools` directory without excluding/checking keys, passwords, SDK downloads, old material, and large media.
- Promise no Windows/iOS/macOS release; preserve reusable web UI and track data.
- Do not blindly add more scenes; stabilize the existing seven first.

### Deliverables by stage

| Stage | Historical deliverable |
| --- | --- |
| 0 | `TEST_LOG.md` and a recoverable v14 APK |
| 0.5 | Archived provenance and per-file distribution conclusions; replacement or written-confirmation plans for unclear material |
| 1 | `web\tracks.js`; new scenes without playback-logic changes |
| 2 | Resource checker and passing record |
| 3 | Consistent web/Android timer behavior |
| 4 | Four viewport screenshots and no-overflow record |
| 5 | New signed APK, version, test results, and known limits |

The original recommendation was to begin at step 0 and proceed in order, rather than changing audio, UI, Android service, and build workflow simultaneously.

## 简体中文

本计划描述的是早期开发阶段，仅作为历史背景保留。文中的版本号、文件路径、拟定步骤和完成标准都不是当前指引。请以当前双语 README 和当前素材/授权记录为准。本存档不代表当前发布内容。以下“尚未建立 Git”、拟定功能、素材发布门槛和定时行为均属于当时记录；历史打包流程不代表授权自动生成 APK。

### 计划范围

这份计划只处理当前阶段：把 Android 版本做稳定，把结构整理成容易添加音景、修改界面和修复问题的形态。现在不必仓促决定代码许可证、收费方式、广告、Google Play、Windows、iOS 或 macOS 版本；但素材来源、许可类别和能否随公开源码/APK 再发布必须从现在开始核查和记录，不能等到上传前临时补。

公开准备的素材许可盘点见 `../licensing/PROJECT_LICENSES.md` / `../licensing/PROJECT_LICENSES.zh-CN.md`；素材目录见 `../media/MEDIA_CATALOG.md` / `../media/MEDIA_CATALOG.zh-CN.md`。本计划是早期历史记录，不代表当前发布结构。

### 当前基线

- 项目目录：`D:\codex\rain-sleep`
- 电脑预览：双击 `open-preview.cmd`
- 预览地址：`http://127.0.0.1:8768`
- 当前阶段记录中的安装包：早期预发布 APK（不代表当前 `v1.0.0`）
- 构建脚本：`build.ps1`
- 电脑界面和音景入口：`web\index.html`、`web\app.js`、`web\style.css`
- Android 页面资源：构建时从 `web` 复制到 `android\package-assets`
- Android 后台声音：`android\src\com\rainsleep\app\RainService.java`
- Android 页面桥接：`android\src\com\rainsleep\app\MainActivity.java`
- 当前网页预览音景：热带雨林、海浪、溪流、夜间虫鸣、篝火、助眠音乐、脑波助眠

**工作顺序**

### 第 0 步：冻结一个可回退版本

目的：以后每次修改出问题，都能回到当前能安装的版本。

执行：

1. 保留早期预发布 APK，不要覆盖历史测试文件。
2. 建立只在本机使用的 Git 版本记录，并保存一个名字为 `v14-before-cleanup` 的检查点。Git 可以把它理解成代码的“存档点”：改坏时能找回之前状态；这里不会创建 GitHub 仓库，也不会上传代码。
3. APK 和大型媒体文件继续单独备份，不要把它们每次的副本都塞进代码存档，避免存档迅速变得很大。
4. 在电脑上启动预览，逐个点击 7 个音景，记录能否播放。
5. 记录定时器的 5 个场景：播放前设置、播放中改时间、取消、暂停后再播放、倒计时到 0。
6. 把测试结果写入 `TEST_LOG.md`，每次修改都追加日期和版本。

完成标准：有一份明确的“修改前结果”，v14 还能重新安装，而且本机能看到一个可恢复的代码存档点。

### 第 0.5 步：建立素材来源和许可记录

目的：避免做到最后才发现某段视频或声音不能随公开代码或安装包分发。

执行：

1. 以 `../media/MEDIA_CATALOG.md` / `../media/MEDIA_CATALOG.zh-CN.md` 中记录的 7 组音景为参考，不要把 `web\media` 里所有旧素材都当成仍在使用。
2. 每个音景要登记视频和声音两项，也就是一共 14 个当前打包文件。每项找到原始素材页面、条目编号、作者、下载日期和下载时许可类别；把这些信息与文件 SHA-256、加工后的文件名及处理方式对应起来。审计文档里已有文件名和来源线索，但还没有凑齐 14 份下载证据。
3. 分开记录两个问题：原媒体是否能放进公开源码仓库；原媒体是否能装入并公开分发 APK。仅仅可以商用/个人播放，不自动证明可以公开原始文件。
4. 对当时找不到来源或许可依据不足的素材（尤其脑波助眠视频及 Mixkit 视频条款适用性），先在个人调试版本中标记待核实；相关历史记录见 `../licensing/PROJECT_LICENSES.md` / `../licensing/PROJECT_LICENSES.zh-CN.md`。
5. 重点核查音效许可是否覆盖本应用的离线 APK，音乐许可是否覆盖当前循环、淡入淡出处理和应用交付。若条款仍不清楚，应询问素材方或替换，不能靠猜。
6. 保存下载当时的许可页面、条目页截图/PDF、许可文本版本和处理记录。之后即使网页变化，也能知道当时依据的条款。

先理解这几件事：

- 你自己下载到电脑、自己在 APK 里使用，不代表你有权把原素材公开给所有人下载。
- 公开“代码”和公开“完整 APK”是两种发布。APK 里包含视频和声音，所以即使 GitHub 仓库不放媒体，公开 APK 也还是在分发媒体。
- 来源署名是记录来源，不是授权本身。条款没写清楚时，先记“待确认”，不要推断成可以。
- 现在不需要决定盈利方式或正式开源许可证；先确认这 14 个文件分别能否随源码、随 APK 分发。这个结论会决定公开版本是保留、替换还是不带某段素材。
- 项目目录当前还没有 Git 仓库。正式开始建立 GitHub 仓库前，需要先加忽略规则，排除 `dist` 里的 APK、`tools\rain-sleep.keystore`、脚本里的明文密码、`tools` 下的 Android 工具包、旧素材和临时文件。当前 APK 单个约 562 MiB，GitHub 普通 Git 拒绝超过 100 MiB 的文件；整个 `web\media` 目录约 2.17 GB，也不应直接作为源码历史提交。

完成标准：当前每个音视频都有来源和处理记录；每项都有“可公开源码 / 可公开 APK / 需替换 / 待书面确认”结论。任何“待确认”都不能进入公开仓库或公开安装包。

### 第 1 步：先把“音景资料”从播放代码中分离

目的：以后增加一个声音只改一条资料，不需要在多个地方找代码。

计划新增：`web\tracks.js`。

每个音景只保留这些字段：

```js
{
  id: 'campfire',
  name: '篝火',
  icon: 'flame',
  video: 'campfire-close',
  audio: 'campfire-balanced',
  title: '听火焰轻轻作响'
}
```

执行：

1. 把 `web\app.js` 顶部的 `tracks` 数组移到 `web\tracks.js`。
2. 把音频文件名也放进资料中，删除播放代码里的隐含拼接规则。
3. `index.html` 先加载 `tracks.js`，再加载 `app.js`。
4. Android 构建脚本继续复制整个 `web` 目录中的公共脚本，所以电脑和 APK 仍使用同一份列表。
5. 增加音景时只需：放入视频、放入音频、在 `tracks.js` 加一条记录。

完成标准：新增一个测试音景时，只改资源目录和 `tracks.js`，不改定时器、播放、切换、界面布局代码。

### 第 2 步：统一音景资源目录和命名

目的：避免“视频有了但代码找不到”“安卓和网页用的不是同一份文件”。

统一放置：`web\media`。

每个音景使用同一个 ID：

- `rain-jungle-balanced.wav` + `rain-loop4k.mp4`
- `waves-balanced.wav` + `waves-4k.mp4`
- `stream-balanced.wav` + `stream-clear.mp4`
- `forest-night-balanced.wav` + `summer-night.mp4`
- `campfire-balanced.wav` + `campfire-close.mp4`
- `sleep-music-balanced.wav` + `music-moon.mp4`
- `binaural-balanced.wav` + `binaural-calm-light.mp4`

执行：

1. 给每条资料增加 `audio` 和 `video` 字段，禁止在代码中猜文件名。
2. 建立一个资源检查脚本，逐条检查视频和音频是否存在、文件大小是否为 0。
3. 检查音频采样率、声道和峰值，发现明显过响或过小就重新处理后再替换。
4. 检查视频是否至少能读取首帧，避免切换时出现空播放器画面。

完成标准：运行一次检查脚本，7 个音景全部通过；网页和 APK 使用同名资源。

### 第 3 步：固定播放状态和定时器规则

目的：先把最容易造成用户困惑的交互定死，再继续美化界面。

统一规则：

1. 没有选择定时，显示“持续播放”。
2. 播放前设置定时，点击播放后开始倒计时。
3. 播放中改定时，倒计时从新的完整时长重新开始。
4. 点击当前已选时间，取消定时并恢复“持续播放”。
5. 点击暂停，停止本次播放并清除定时；所有定时按钮取消高亮。
6. 暂停后重新播放，不自动恢复旧倒计时，除非以后专门增加“记住定时”的设置。
7. 到 0 时先淡出声音，再停止播放，并显示“定时已结束”。

需要检查的文件：

- 网页定时逻辑：`web\app.js`
- Android 定时逻辑：`android\src\com\rainsleep\app\RainService.java`
- 网页和 Android 状态同步：`web\app.js`、`android\src\com\rainsleep\app\MainActivity.java`

完成标准：网页和 APK 对上述 7 条规则表现一致；切换音景不会重置定时，除非用户主动改定时。

### 第 4 步：把界面调整为“数据驱动”和可适配布局

目的：手机、平板、电脑显示同一套内容，增加音景不会破坏排版。

执行：

1. 音景按钮继续由 `tracks.js` 自动生成。
2. 使用横向可滚动列表；宽屏显示一排，窄屏允许左右滑动。
3. 不给每个音景写固定位置，不用第七个项目的特殊补丁。
4. 只保留一个播放按钮、一个定时区域、一个设置入口。
5. 保持按钮有明确的按下、选中、禁用状态；禁用时不显示突兀的蓝色浏览器高亮。
6. 设置里的极简模式只负责隐藏视频并保留音频，不改变音景和定时规则。

完成标准：至少检查 390×844 手机、600×1024 平板、1280×800 横屏、1440×900 电脑四种尺寸；无横向溢出、按钮不重叠、音景列表能滑动。

### 第 5 步：建立固定的测试表，再生成 APK

每次改代码都按这个顺序：

1. 电脑预览：页面打开、7 个音景逐个切换、播放/暂停、定时器 7 条规则。
2. 浏览器控制台：没有未处理的 JavaScript 错误，视频切换失败时界面仍可操作。
3. 四种窗口尺寸：手机、平板、横屏、桌面。
4. 执行 `powershell -ExecutionPolicy Bypass -File .\build.ps1`。
5. 检查 `dist` 中只保留最近 3 个可安装 APK。
6. 在至少一台 Android 8.0 以上设备安装，测试锁屏播放、通知栏暂停、切换音景、修改定时、到时停止、重新打开应用。
7. 真机通过后，才把新 APK 标为可安装版本。

完成标准：测试表中每项都有“通过/失败/未测试”，不能用“应该没问题”代替真机结果。

### 现在暂时不做的事

- 不迁移到 Flutter、React Native 或其他框架。当前 Java + WebView + 本地资源已经能覆盖手机和平板，迁移会增加新的兼容问题。
- 不把视频改成联网播放。离线资源更适合睡眠场景，也避免网络中断。
- 不急着决定代码许可证、开源方式、收费、广告、统计和应用商店发布；但是先做第 0.5 步素材核查。代码许可证由你了解基本区别并准备公开时再定，且它不能替第三方素材授权。
- 不上传当前 APK、整个项目文件夹或 `tools` 目录作为公开项目；签名密钥、构建密码、SDK 工具包、旧素材和大体积媒体需要先排除或逐项确认。
- 不承诺 Windows、iOS、macOS 的正式版本；先保留可复用的网页界面和音景资料结构。
- 不继续盲目增加音景数量；先把现有 7 个的播放、音量、淡入淡出和定时行为稳定下来。

### 每一阶段的交付物

完成第 0 步：`TEST_LOG.md` 和可回退的 v14 APK。

完成第 0.5 步：来源证据和每项分发结论归档；不明素材有替换或书面确认方案。

完成第 1 步：`web\tracks.js`，增加音景不再改播放逻辑。

完成第 2 步：资源检查脚本和通过记录。

完成第 3 步：网页与 Android 定时规则一致。

完成第 4 步：手机、平板、电脑四种尺寸截图和无溢出记录。

完成第 5 步：新的已签名 APK、版本号、测试结果和已知限制。

当前建议从第 0 步开始。第 0 步完成后，再进行第 1 步；不要一次改动音频、界面、Android 服务和构建流程四类内容。
