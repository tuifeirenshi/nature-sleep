const $ = id => document.getElementById(id);
const native = typeof Android !== 'undefined';
const responsive = document.createElement('link');
responsive.rel = 'stylesheet';
responsive.href = 'responsive.css';
document.head.append(responsive);
if (native && Android.getStatusBarInsetDp) document.documentElement.style.setProperty('--status-inset', Android.getStatusBarInsetDp() + 'px');

const tracks = window.SLEEP_TRACKS;
const initialTrack = native && Android.getTrack ? Android.getTrack() : null;
let motionOff = localStorage.getItem('nature-motion-off') === 'true';
document.body.classList.toggle('motion-off', motionOff);
let selected = tracks.find(t => t.id === initialTrack) || tracks[0];
let playing = false, loading = false, deadline = 0, chosen = 0;
let ctx, buffer, gain, masterGain, sources = [], epoch = 0, active = 0, blend = false;
let timerExpanded = false;
const films = [$('filmA'), $('filmB')];
const buffers = new Map();

$('sounds').innerHTML = tracks.map(track => `<button data-track="${track.id}" aria-pressed="false" title="${track.name}"><i data-lucide="${track.icon}"></i><span>${track.name}</span></button>`).join('');
function icons() { lucide.createIcons(); }
function paint() {
  document.querySelectorAll('[data-track]').forEach(button => { button.classList.toggle('selected', button.dataset.track === selected.id); button.setAttribute('aria-pressed', String(button.dataset.track === selected.id)); button.disabled = loading; });
  $('playingLabel').textContent = selected.name + ' · 自然原声';
  document.querySelector('h1').textContent = selected.title;
  $('play').disabled = loading;
  $('play').innerHTML = `<i data-lucide="${playing ? 'pause' : 'play'}"></i>`;
  $('play').setAttribute('aria-label', playing ? '暂停声音' : '播放声音');
  $('status').textContent = loading ? '声音加载中…' : playing ? '让自然的声音陪你入眠' : '闭上眼睛，慢慢放松';
  icons();
}

let videoEpoch = 0, videoLoading = false;
const SWITCH_FADE_SECONDS = .7;
async function setBackground() {
  const token = ++videoEpoch, old = films[active], next = films[1 - active];
  videoLoading = true; blend = false; old.style.transition = ''; old.style.opacity = 1; next.pause(); next.style.transition = ''; next.style.opacity = 0;
  next.style.objectPosition = selected.id === 'forest-night' ? '35% center' : 'center'; next.style.filter = 'none'; next.preload = 'auto'; next.src = selected.video; next.load();
  try {
    await new Promise((resolve, reject) => { next.onloadeddata = resolve; next.onerror = reject; if (next.readyState >= 2) resolve(); });
    if (token !== videoEpoch) return;
    if (playing && !document.body.classList.contains('sleep')) { await next.play(); await new Promise(resolve => next.requestVideoFrameCallback ? next.requestVideoFrameCallback(resolve) : setTimeout(resolve, 100)); }
    if (token !== videoEpoch) return;
    if (!playing || document.body.classList.contains('sleep')) { next.pause(); try { next.currentTime = 0; } catch {} }
    next.style.transition = 'opacity 600ms'; old.style.transition = 'opacity 600ms'; next.style.opacity = 1; old.style.opacity = 0; active = 1 - active;
    await new Promise(resolve => setTimeout(resolve, 650));
    if (token !== videoEpoch) return;
    old.pause(); if (old.src === next.src) { try { old.currentTime = 0; } catch {} } else { old.src = next.src; old.preload = 'auto'; old.load(); }
    films.forEach(video => video.style.transition = ''); if (!playing || document.body.classList.contains('sleep')) next.pause();
  } catch (error) { console.warn('Video preparation failed', error); } finally { if (token === videoEpoch) videoLoading = false; }
}
function sourceGainAt(item, time) { const progress = item.fadeEnd <= item.fadeStart ? 1 : Math.max(0, Math.min(1, (time - item.fadeStart) / (item.fadeEnd - item.fadeStart))); return item.fadeFrom + (item.fadeTo - item.fadeFrom) * progress; }
function fadeSource(item, target, duration, now) { const current = sourceGainAt(item, now); item.gain.gain.cancelScheduledValues(now); item.gain.gain.setValueAtTime(current, now); item.gain.gain.linearRampToValueAtTime(target, now + duration); item.fadeFrom = current; item.fadeTo = target; item.fadeStart = now; item.fadeEnd = now + duration; }
function stopAudio(fadeSeconds = 0) { const now = ctx?.currentTime || 0; for (const item of [...sources]) { try { if (fadeSeconds > 0 && ctx && item.gain) { fadeSource(item, 0, fadeSeconds, now); item.source.onended = () => { item.source.disconnect(); item.gain.disconnect(); sources = sources.filter(source => source !== item); }; item.source.stop(now + fadeSeconds); } else { item.source.stop(); item.source.disconnect(); item.gain.disconnect(); sources = sources.filter(source => source !== item); } } catch { sources = sources.filter(source => source !== item); } } gain = null; }
function syncTimerSelection(min = chosen) { document.querySelectorAll('[data-min]').forEach(button => { const isSelected = +button.dataset.min === min; button.classList.toggle('selected', isSelected); button.setAttribute('aria-pressed', String(isSelected)); }); const custom = min > 0 && ![15, 30, 60].includes(min); $('custom').classList.toggle('selected', custom); $('custom').setAttribute('aria-pressed', String(custom)); }
async function audioStart(token, crossfade = false) { ctx ??= new AudioContext(); await ctx.resume(); const id = selected.id; let decoded = buffers.get(id); if (!decoded) { const response = await fetch(selected.audio); if (!response.ok) throw Error('音频加载失败'); decoded = await ctx.decodeAudioData(await response.arrayBuffer()); buffers.set(id, decoded); while (buffers.size > 2) buffers.delete(buffers.keys().next().value); } else { buffers.delete(id); buffers.set(id, decoded); } if (token !== epoch) return false; buffer = decoded; if (!masterGain) { masterGain = ctx.createGain(); masterGain.gain.value = 1; masterGain.connect(ctx.destination); } else if (!sources.length) { masterGain.gain.cancelScheduledValues(ctx.currentTime); masterGain.gain.setValueAtTime(1, ctx.currentTime); } const now = ctx.currentTime, fade = crossfade ? SWITCH_FADE_SECONDS : 0, fadeIn = crossfade ? SWITCH_FADE_SECONDS : 2; if (crossfade) for (const item of [...sources]) { fadeSource(item, 0, fade, now); item.source.onended = () => { item.source.disconnect(); item.gain.disconnect(); sources = sources.filter(source => source !== item); }; try { item.source.stop(now + fade); } catch {} } gain = ctx.createGain(); gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(1, now + fadeIn); gain.connect(masterGain); const source = ctx.createBufferSource(); source.buffer = decoded; source.loop = true; source.connect(gain); source.start(); sources.push({ source, gain, fadeFrom: 0, fadeTo: 1, fadeStart: now, fadeEnd: now + fadeIn }); return true; }
async function start(preserve = false) { if (playing || loading) return; const token = ++epoch; loading = true; paint(); try { if (native) { Android.setTrack(selected.id); Android.play(); } else if (!await audioStart(token)) return; if (token !== epoch) return; playing = true; if (!preserve && chosen) deadline = Date.now() + chosen * 60000; if (!document.body.classList.contains('sleep')) films[active].play().catch(console.warn); } catch (error) { stopAudio(); playing = false; if (native) Android.pause(); console.error(error); } finally { loading = false; paint(); } }
function pause() { ++epoch; ++videoEpoch; playing = false; loading = false; videoLoading = false; blend = false; deadline = 0; chosen = 0; syncTimerSelection(0); if (native) Android.pause(); stopAudio(); films.forEach(video => video.pause()); paint(); }
$('play').onclick = () => playing ? pause() : start();
document.querySelectorAll('[data-track]').forEach(button => button.onclick = async () => { if (loading || button.dataset.track === selected.id) return; const resume = playing, previous = selected; selected = tracks.find(track => track.id === button.dataset.track); paint(); if (native) { Android.setTrack(selected.id); await setBackground(); paint(); } else if (resume) { const token = ++epoch, background = setBackground(); try { if (await audioStart(token, true)) { playing = true; await background; } else if (token === epoch) selected = previous; } catch (error) { if (token === epoch) { selected = previous; await setBackground(); } console.warn('Audio switch failed', error); } finally { if (token === epoch) paint(); } } else { await setBackground(); paint(); } });
function setTimer(min) { chosen = min; deadline = playing && min ? Date.now() + min * 60000 : 0; syncTimerSelection(min); if (native) Android.setTimer(min); renderTimer(); }
function setTimerPanel(expanded) { timerExpanded = expanded; $('timerToggle').setAttribute('aria-expanded', String(expanded)); $('timerPanel').hidden = !expanded; if (!expanded) $('customRow').hidden = true; }
$('timerToggle').onclick = () => setTimerPanel(!timerExpanded);
document.querySelectorAll('[data-min]').forEach(button => button.onclick = () => { setTimer(chosen === +button.dataset.min ? 0 : +button.dataset.min); $('customRow').hidden = true; });
$('custom').onclick = () => { $('customRow').hidden = !$('customRow').hidden; };
$('apply').onclick = () => { const minutes = +$('minutes').value; if (Number.isInteger(minutes) && minutes >= 1 && minutes <= 720) { setTimer(minutes); $('customRow').hidden = true; } else $('minutes').reportValidity(); };
function renderTimer() { if (deadline) { const left = Math.max(0, deadline - Date.now()); $('countdown').textContent = `${String(Math.floor(left / 60000)).padStart(2, '0')}:${String(Math.floor(left / 1000) % 60).padStart(2, '0')} 后停止`; if (!native && masterGain && ctx) masterGain.gain.setTargetAtTime(Math.min(1, left / 30000), ctx.currentTime, .2); if (left === 0) { pause(); $('status').textContent = '定时已结束，晚安'; } } else { $('countdown').textContent = chosen ? (playing ? `${chosen} 分钟后停止` : `播放后 ${chosen} 分钟停止`) : '持续播放'; if (!native && playing && masterGain && ctx) masterGain.gain.setTargetAtTime(1, ctx.currentTime, .2); } }
setInterval(renderTimer, 250);
function animate() { if (playing && !videoLoading && !document.body.classList.contains('sleep')) { const video = films[active], next = films[1 - active]; if (video.duration && video.currentTime >= video.duration - 3) { if (!blend) { blend = true; next.currentTime = 0; next.play().catch(console.warn); } const progress = Math.min(1, (video.currentTime - (video.duration - 3)) / 3); video.style.opacity = 1 - progress; next.style.opacity = progress; if (progress >= .995 || video.ended) { video.pause(); video.style.opacity = 0; next.style.opacity = 1; active = 1 - active; blend = false; } } } requestAnimationFrame(animate); }
animate();
function setMinimal(enabled, refreshBackground = true) { document.body.classList.toggle('minimal', enabled); document.body.classList.toggle('sleep', enabled); localStorage.setItem('nature-minimal', String(enabled)); $('minimalMode').checked = enabled; if (enabled) { videoEpoch++; videoLoading = false; blend = false; films.forEach(video => video.pause()); } else if (refreshBackground) setBackground(); }
function setMixAudio(enabled, notifyNative = true) { localStorage.setItem('nature-mix-audio', String(enabled)); $('mixAudio').checked = enabled; if (native && notifyNative) Android.setMixAudio(enabled); }
function setMotionOff(enabled) { motionOff = enabled; localStorage.setItem('nature-motion-off', String(enabled)); document.body.classList.toggle('motion-off', enabled); $('motionOff').checked = enabled; }
function openSettings() { const page = $('settingsPage'); $('homePage').hidden = true; page.hidden = false; page.setAttribute('aria-hidden', 'false'); document.body.classList.add('settings-open'); requestAnimationFrame(() => page.classList.add('visible')); }
function closeSettings() { const page = $('settingsPage'); page.classList.remove('visible'); setTimeout(() => { page.hidden = true; page.setAttribute('aria-hidden', 'true'); $('homePage').hidden = false; document.body.classList.remove('settings-open'); }, motionOff ? 0 : 240); }
$('settings').onclick = openSettings; $('settingsBack').onclick = closeSettings;
$('minimalMode').onchange = () => setMinimal($('minimalMode').checked); $('mixAudio').onchange = () => setMixAudio($('mixAudio').checked); $('motionOff').onchange = () => setMotionOff($('motionOff').checked);
document.addEventListener('pointerdown', event => { const button = event.target.closest('button'); if (!button || motionOff) return; button.classList.remove('pressing'); void button.offsetWidth; button.classList.add('pressing'); setTimeout(() => button.classList.remove('pressing'), 240); });
window.nativeState = state => { const restored = tracks.find(track => track.id === state.track); if (typeof state.mixAudio === 'boolean') setMixAudio(state.mixAudio, false); if (loading) return; playing = Boolean(state.playing); if (restored && restored.id !== selected.id) { selected = restored; setBackground(); paint(); } deadline = state.deadline; chosen = state.minutes; syncTimerSelection(chosen); paint(); renderTimer(); if (!playing) films.forEach(video => video.pause()); else if (!document.body.classList.contains('sleep')) films[active].play().catch(console.warn); };
setMinimal(localStorage.getItem('nature-minimal') === 'true', false); setMixAudio(localStorage.getItem('nature-mix-audio') === 'true', false); setMotionOff(motionOff); paint(); syncTimerSelection(0); setTimerPanel(false); if (!document.body.classList.contains('sleep')) setBackground(); if (native) { Android.setVolume(1); Android.sync(); }
