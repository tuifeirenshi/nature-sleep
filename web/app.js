const $ = id => document.getElementById(id);
const native = typeof Android !== 'undefined';
const responsive = document.createElement('link');
responsive.rel = 'stylesheet';
responsive.href = 'responsive.css';
document.head.append(responsive);
if (native && Android.getStatusBarInsetDp) document.documentElement.style.setProperty('--status-inset', Android.getStatusBarInsetDp() + 'px');

const tracks = window.SLEEP_TRACKS;
const languages = window.SLEEP_I18N;
const languageIds = ['en', 'zh-CN', 'es', 'ja', 'pt-BR', 'de', 'fr', 'ko', 'it', 'ru'];
let language = languages[localStorage.getItem('nature-language')] ? localStorage.getItem('nature-language') : 'zh-CN';
const initialTrack = native && Android.getTrack ? Android.getTrack() : null;
localStorage.removeItem('nature-motion-off');
let selected = tracks.find(t => t.id === initialTrack) || tracks[0];
let playing = false, loading = false, deadline = 0, chosen = 0;
let ctx, buffer, gain, masterGain, sources = [], epoch = 0, active = 0, blend = false;
let timerExpanded = false;
let timerCustom = false;
let settingsTransition = 0;
let settingsDesiredOpen = false;
let settingsMotionFrame = 0;
let settingsProgress = 0;
let settingsVelocity = 0;
let settingsTarget = 0;
let timerPanelTransition = 0;
let customTransition = 0;
const films = [$('filmA'), $('filmB')];
const buffers = new Map();
const pendingBuffers = new Map();

$('sounds').innerHTML = tracks.map(track => `<button data-track="${track.id}" aria-pressed="false"><i data-lucide="${track.icon}"></i><span></span></button>`).join('');
const soundBase = [...$('sounds').querySelectorAll('[data-track]')];
const soundCount = soundBase.length;
let soundStride = 0;
let soundSegment = 0;
let soundLoopLow = 0;
let soundLoopHigh = 0;
const soundViewport = $('soundsViewport');
const soundRail = $('sounds');
const wheelQuery = { get matches() { return matchMedia('(max-width: 699px)').matches || soundViewport.parentElement.clientWidth < soundCount * 82; } };
let soundRailFrame = 0;
let soundSettleTimer = 0;
let soundPointer = null;
let suppressSoundClick = false;
let soundScrollVelocity = 0;
let lastSoundScrollSample = null;
let soundIsSnapping = false;
let soundSnapFrame = 0;
let soundSnapTarget = 0;
let soundSnapVelocity = 0;
let soundSnapPosition = 0;
let playMode = null;
function setPlayState(mode) {
  if (mode === playMode) return;
  playMode = mode;
  $('play').classList.toggle('is-playing', mode === 'playing');
  $('play').classList.remove('is-loading');
}

function cloneSoundButtons(source, side) {
  return source.map((button, index) => {
    const clone = button.cloneNode(true);
    clone.dataset.clone = side;
    clone.dataset.index = String(index);
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    return clone;
  });
}
soundBase.forEach((button, index) => { button.dataset.index = String(index); });
const beforeClones = document.createDocumentFragment();
for (const clone of cloneSoundButtons(soundBase, 'before')) beforeClones.append(clone);
soundRail.insertBefore(beforeClones, soundBase[0]);
for (const clone of cloneSoundButtons(soundBase, 'after')) soundRail.append(clone);
function measureSoundWheel() {
  const useWheel = wheelQuery.matches;
  soundViewport.dataset.layout = useWheel ? 'wheel' : 'row';
  soundStride = soundBase.length > 1 ? soundBase[1].offsetLeft - soundBase[0].offsetLeft : soundBase[0].offsetWidth;
  const afterFirst = soundRail.querySelector('[data-clone="after"][data-index="0"]');
  soundSegment = afterFirst && soundBase[0] ? afterFirst.offsetLeft - soundBase[0].offsetLeft : soundStride * soundCount;
  const centerOffset = (soundViewport.clientWidth - soundBase[0].offsetWidth) / 2;
  soundLoopLow = soundBase[0].offsetLeft - centerOffset;
  soundLoopHigh = afterFirst ? afterFirst.offsetLeft - centerOffset : soundLoopLow + soundSegment;
  if (!wheelQuery.matches) {
    soundRail.scrollLeft = 0;
    updateSoundWheel();
    return;
  }
  const selectedIndex = tracks.findIndex(track => track.id === selected.id);
  const copies = [...soundRail.querySelectorAll(`[data-track][data-index="${selectedIndex}"]`)];
  const middleCopy = copies[1];
  soundRail.scrollLeft = middleCopy ? middleCopy.offsetLeft - (soundViewport.clientWidth - middleCopy.offsetWidth) / 2 : soundSegment;
  updateSoundWheel();
}
requestAnimationFrame(measureSoundWheel);

function icons() { lucide.createIcons(); }
function translate(key, values = {}) { return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), languages[language].ui[key]); }
function trackText(track) { return languages[language].tracks[track.id]; }
function setLanguage(nextLanguage) {
  if (!languageIds.includes(nextLanguage)) return;
  language = nextLanguage;
  localStorage.setItem('nature-language', language);
  document.documentElement.lang = languages[language].lang;
  document.title = translate('documentTitle');
  $('settings').title = translate('settings');
  $('settings').setAttribute('aria-label', translate('settings'));
  $('settingsTitle').textContent = translate('settings');
  $('settingsBack').title = translate('back');
  $('settingsBack').setAttribute('aria-label', translate('back'));
  $('sounds').setAttribute('aria-label', translate('soundSelection'));
  $('timerLabel').textContent = translate('timer');
  document.querySelector('.timers').setAttribute('aria-label', translate('timerGroup'));
  $('custom').textContent = translate('custom');
  $('hourUnit').textContent = timeUnits()[0];
  $('minuteUnit').textContent = timeUnits()[1];
  $('hours').setAttribute('aria-label', timeUnits()[0]);
  $('minutes').setAttribute('aria-label', timeUnits()[1]);
  $('languageLabel').textContent = translate('language');
  $('languageHint').textContent = translate('languageHint');
  $('languageSelect').setAttribute('aria-label', translate('language'));
  $('minimalLabel').textContent = translate('minimal');
  $('minimalHint').textContent = translate('minimalHint');
  $('mixLabel').textContent = translate('mix');
  $('mixHint').textContent = translate('mixHint');
  $('languageSelect').value = language;
  document.querySelectorAll('[data-min]').forEach(button => { button.textContent = translate('minutesShort', { minutes: button.dataset.min }); });
  $('timerToggle').classList.toggle('timer-active', chosen > 0);
  paint();
  renderTimer();
}
function paint() {
  document.querySelectorAll('[data-track]').forEach(button => {
    const track = tracks.find(item => item.id === button.dataset.track);
    const copy = trackText(track);
    const isSelected = track.id === selected.id;
    button.classList.toggle('selected', isSelected && !button.dataset.clone);
    button.setAttribute('aria-pressed', String(isSelected && !button.dataset.clone));
    button.title = copy.name;
    button.querySelector('span').textContent = copy.name;
    button.disabled = loading;
  });
  $('sounds').classList.toggle('is-playing', playing);
  $('playingLabel').textContent = `${trackText(selected).name} · ${translate('originalSound')}`;
  $('trackTitle').textContent = trackText(selected).title;
  $('play').disabled = loading;
  setPlayState(loading ? 'loading' : playing ? 'playing' : 'paused');
  $('play').setAttribute('aria-pressed', String(playing));
  $('play').setAttribute('aria-label', translate(playing ? 'pause' : 'play'));
  $('play').title = translate(playing ? 'pause' : 'play');
  $('status').textContent = loading ? translate('statusLoading') : playing ? translate('statusPlaying') : translate('statusIdle');
  updateSoundWheel();
  icons();
}

function normalizeSoundLoop() {
  if (!wheelQuery.matches || !soundSegment) return;
  let shift = 0;
  while (soundRail.scrollLeft + shift < soundLoopLow) shift += soundSegment;
  while (soundRail.scrollLeft + shift >= soundLoopHigh) shift -= soundSegment;
  if (!shift) return;
  soundRail.scrollLeft += shift;
  if (soundPointer) soundPointer.startScroll += shift;
  if (soundIsSnapping) { soundSnapTarget += shift; soundSnapPosition += shift; }
  if (lastSoundScrollSample) lastSoundScrollSample.left += shift;
}
function cancelSoundSnap() {
  if (soundSnapFrame) cancelAnimationFrame(soundSnapFrame);
  soundSnapFrame = 0;
  soundIsSnapping = false;
  clearTimeout(soundSettleTimer);
}
function centeredSoundButton() {
  const center = soundRail.scrollLeft + soundViewport.clientWidth / 2;
  let nearest = null, distance = Infinity;
  for (const button of soundRail.children) {
    const delta = Math.abs(button.offsetLeft + button.offsetWidth / 2 - center);
    if (delta < distance) { nearest = button; distance = delta; }
  }
  return nearest;
}
function updateSoundWheel() {
  normalizeSoundLoop();
  if (!wheelQuery.matches) {
    for (const button of soundRail.children) {
      const base = !button.dataset.clone;
      button.style.removeProperty('--wheel-x');
      button.style.removeProperty('--wheel-depth');
      button.style.removeProperty('--wheel-angle');
      button.style.removeProperty('--wheel-scale');
      button.style.removeProperty('--wheel-light');
      button.style.removeProperty('--wheel-opacity');
      button.style.visibility = base ? 'visible' : 'hidden';
      button.classList.toggle('selected', base && button.dataset.track === selected.id);
      button.classList.remove('wheel-center');
    }
    return;
  }
  const center = soundRail.scrollLeft + soundViewport.clientWidth / 2;
  for (const button of soundRail.children) {
    const delta = button.offsetLeft + button.offsetWidth / 2 - center;
    const radius = Math.max(soundStride * 2.95, soundViewport.clientWidth * .48);
    const angle = Math.max(-1.3, Math.min(1.3, delta / radius));
    const depth = radius * (1 - Math.cos(angle));
    const normalized = Math.min(1, Math.abs(angle) / 1.3);
    button.style.setProperty('--wheel-x', `${Math.sin(angle) * radius - delta}px`);
    button.style.setProperty('--wheel-depth', `${depth}px`);
    button.style.setProperty('--wheel-angle', `${angle * 57.2958}deg`);
    button.style.setProperty('--wheel-scale', String(1 - normalized * .12));
    button.style.setProperty('--wheel-light', String(1 - normalized * .24));
    button.style.setProperty('--wheel-opacity', String(1 - normalized * .5));
    button.style.visibility = Math.abs(angle) > 1.27 ? 'hidden' : 'visible';
    const centered = Math.abs(delta) < Math.min(button.offsetWidth * .46, soundStride * .46);
    button.classList.toggle('wheel-center', centered);
    button.classList.toggle('selected', button.dataset.track === selected.id && centered);
  }
}
function finishSoundWheel() {
  soundIsSnapping = false;
  soundRail.classList.remove('is-moving');
  normalizeSoundLoop();
  const landed = centeredSoundButton();
  const track = tracks.find(item => item.id === landed?.dataset.track);
  if (track && track.id !== selected.id) selectTrack(track.id, { fromWheel: true });
  updateSoundWheel();
}
function springSoundWheel(targetLeft, releaseVelocity = 0) {
  cancelSoundSnap();
  soundRail.classList.add('is-moving');
  soundIsSnapping = true;
  soundSnapTarget = targetLeft;
  soundSnapVelocity = Math.max(-2400, Math.min(2400, releaseVelocity * 1000));
  soundSnapPosition = soundRail.scrollLeft;
  let previous = performance.now();
  const tick = now => {
    const dt = Math.min(.032, Math.max(.001, (now - previous) / 1000));
    previous = now;
    const displacement = soundSnapTarget - soundSnapPosition;
    const acceleration = displacement * 225 - soundSnapVelocity * 27;
    soundSnapVelocity += acceleration * dt;
    soundSnapPosition += soundSnapVelocity * dt;
    soundRail.scrollLeft = soundSnapPosition;
    updateSoundWheel();
    if (Math.abs(displacement) < .45 && Math.abs(soundSnapVelocity) < 5) {
      soundRail.scrollLeft = soundSnapTarget;
      soundSnapFrame = 0;
      finishSoundWheel();
      return;
    }
    soundSnapFrame = requestAnimationFrame(tick);
  };
  soundSnapFrame = requestAnimationFrame(tick);
}
function settleSoundWheel(velocity = soundScrollVelocity) {
  if (!wheelQuery.matches) return;
  if (soundPointer) return;
  normalizeSoundLoop();
  const speed = Math.max(-2.4, Math.min(2.4, velocity));
  const center = soundRail.scrollLeft + soundViewport.clientWidth / 2;
  const projected = center + Math.max(-3 * soundStride, Math.min(3 * soundStride, speed * 180));
  const canonical = [...soundRail.children].sort((a, b) => Math.abs(a.offsetLeft + a.offsetWidth / 2 - projected) - Math.abs(b.offsetLeft + b.offsetWidth / 2 - projected))[0];
  if (!canonical) return;
  const centerLeft = canonical.offsetLeft - (soundViewport.clientWidth - canonical.offsetWidth) / 2;
  springSoundWheel(centerLeft, speed);
}
soundRail.addEventListener('scroll', () => {
  if (!wheelQuery.matches) return;
  soundRail.classList.add('is-moving');
  const now = performance.now();
  if (lastSoundScrollSample) {
    const dt = Math.max(1, now - lastSoundScrollSample.time);
    const delta = soundRail.scrollLeft - lastSoundScrollSample.left;
    soundScrollVelocity = Math.abs(delta) > soundSegment * .5 ? 0 : delta / dt;
  }
  lastSoundScrollSample = { left: soundRail.scrollLeft, time: now };
  normalizeSoundLoop();
  if (!soundRailFrame) soundRailFrame = requestAnimationFrame(() => { soundRailFrame = 0; updateSoundWheel(); });
  clearTimeout(soundSettleTimer);
  if (!soundPointer && !soundIsSnapping) soundSettleTimer = setTimeout(() => settleSoundWheel(soundScrollVelocity), 140);
});
soundRail.addEventListener('scrollend', () => { if (!soundIsSnapping && !soundPointer) settleSoundWheel(soundScrollVelocity); });
soundRail.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const index = tracks.findIndex(track => track.id === selected.id);
  const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? soundCount - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + soundCount) % soundCount;
  if (!wheelQuery.matches) { selectTrack(tracks[nextIndex].id); return; }
  const target = [...soundRail.querySelectorAll('[data-track]:not([data-clone])')][nextIndex];
  if (target) springSoundWheel(target.offsetLeft - (soundViewport.clientWidth - target.offsetWidth) / 2);
});
soundRail.addEventListener('click', event => {
  const button = event.target.closest('[data-track]');
  if (!button) return;
  if (suppressSoundClick) { event.preventDefault(); event.stopPropagation(); }
  else selectTrack(button.dataset.track);
  suppressSoundClick = false;
});
soundRail.addEventListener('pointerdown', event => {
  if (!wheelQuery.matches) return;
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  cancelSoundSnap();
  soundRail.classList.add('is-moving');
  soundScrollVelocity = 0;
  soundPointer = { id: event.pointerId, startX: event.clientX, startScroll: soundRail.scrollLeft, samples: [{ x: event.clientX, time: performance.now() }], moved: false };
  soundRail.setPointerCapture(event.pointerId);
});
soundRail.addEventListener('pointermove', event => {
  if (!wheelQuery.matches) return;
  if (!soundPointer || event.pointerId !== soundPointer.id) return;
  const dx = event.clientX - soundPointer.startX;
  if (Math.abs(dx) > 5) soundPointer.moved = true;
  if (soundPointer.moved) {
    soundRail.scrollLeft = soundPointer.startScroll - dx;
    const now = performance.now();
    soundPointer.samples.push({ x: event.clientX, time: now });
    while (soundPointer.samples.length > 1 && soundPointer.samples[0].time < now - 100) soundPointer.samples.shift();
    event.preventDefault();
  }
});
function endSoundPointer(event) {
  if (!wheelQuery.matches) return;
  if (!soundPointer || event.pointerId !== soundPointer.id) return;
  const now = performance.now();
  const samples = soundPointer.samples.filter(sample => sample.time >= now - 100);
  const first = samples[0];
  const velocity = soundPointer.moved && first ? -(event.clientX - first.x) / Math.max(1, now - first.time) : 0;
  if (soundPointer.moved) suppressSoundClick = true;
  soundPointer = null;
  settleSoundWheel(velocity);
}
soundRail.addEventListener('pointerup', endSoundPointer);
soundRail.addEventListener('pointercancel', endSoundPointer);

let videoEpoch = 0, videoLoading = false;
const SWITCH_FADE_SECONDS = .55;
function waitForVideoData(video, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timeout;
    const cleanup = () => {
      clearTimeout(timeout);
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('error', onError);
    };
    const finish = error => {
      if (settled) return;
      settled = true;
      cleanup();
      error ? reject(error) : resolve();
    };
    const onReady = () => { if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) finish(); };
    const onError = () => finish(video.error || Error('视频加载失败'));
    video.addEventListener('loadeddata', onReady);
    video.addEventListener('canplay', onReady);
    video.addEventListener('error', onError);
    timeout = setTimeout(() => {
      onReady();
      if (!settled) finish(Error('等待视频首帧超时'));
    }, timeoutMs);
  });
}
async function setBackground() {
  const token = ++videoEpoch;
  const visibility = films.map((video, index) => ({ video, index, opacity: Number.parseFloat(getComputedStyle(video).opacity) || 0 }));
  films.forEach((video, index) => { video.style.transition = 'none'; video.style.opacity = String(visibility[index].opacity); });
  const visible = visibility.sort((a, b) => b.opacity - a.opacity)[0];
  const old = visible.video, nextIndex = 1 - visible.index, next = films[nextIndex];
  const fadeMs = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : SWITCH_FADE_SECONDS * 1000;
  const targetSrc = new URL(selected.video, document.baseURI).href;
  videoLoading = true; blend = false; next.pause(); next.style.transition = ''; next.style.opacity = 0;
  films.forEach(video => { video.style.transition = ''; });
  if ((old.currentSrc || old.src) === targetSrc) {
    active = visible.index;
    if (old.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      try {
        const firstFrame = waitForVideoData(old);
        old.preload = 'auto';
        old.load();
        await firstFrame;
        if (token !== videoEpoch) return;
      } catch (error) {
        if (token === videoEpoch) console.warn('Initial video did not become ready; showing its poster.', error);
        videoLoading = false;
        return;
      }
    }
    if (playing && !document.body.classList.contains('sleep')) old.play().catch(console.warn);
    window.updatePlayGlass?.();
    videoLoading = false;
    return;
  }
  next.style.objectPosition = selected.id === 'forest-night' ? '35% center' : 'center';
  next.style.filter = 'none';
  next.poster = `media/covers/${selected.id}.jpg`;
  next.preload = 'none';
  next.src = selected.video;
  const firstFrame = waitForVideoData(next);
  next.preload = 'auto';
  next.load();
  try {
    await firstFrame;
    if (token !== videoEpoch) return;
    if (playing && !document.body.classList.contains('sleep')) { await next.play(); await new Promise(resolve => next.requestVideoFrameCallback ? next.requestVideoFrameCallback(resolve) : setTimeout(resolve, 100)); }
    if (token !== videoEpoch) return;
    if (!playing || document.body.classList.contains('sleep')) { next.pause(); try { next.currentTime = 0; } catch {} }
    next.style.transition = fadeMs ? `opacity ${fadeMs}ms cubic-bezier(.22,.61,.36,1)` : 'none';
    old.style.transition = fadeMs ? `opacity ${fadeMs}ms cubic-bezier(.22,.61,.36,1)` : 'none';
    next.style.opacity = 1; old.style.opacity = 0; active = nextIndex;
    window.updatePlayGlass?.();
    if (fadeMs) await new Promise(resolve => setTimeout(resolve, fadeMs + 30));
    if (token !== videoEpoch) return;
    old.pause(); if (old.src === next.src) { try { old.currentTime = 0; } catch {} } else { old.src = next.src; old.preload = 'auto'; old.load(); }
    films.forEach(video => video.style.transition = ''); if (!playing || document.body.classList.contains('sleep')) next.pause();
  } catch (error) {
    if (token === videoEpoch) {
      next.pause(); next.style.opacity = 0;
      old.style.opacity = 1;
      films.forEach(video => { video.style.transition = ''; });
      window.updatePlayGlass?.();
      console.warn('Video preparation failed; keeping the current frame visible.', error);
    }
  } finally { if (token === videoEpoch) videoLoading = false; }
}
function sourceGainAt(item, time) { const progress = item.fadeEnd <= item.fadeStart ? 1 : Math.max(0, Math.min(1, (time - item.fadeStart) / (item.fadeEnd - item.fadeStart))); return item.fadeFrom + (item.fadeTo - item.fadeFrom) * progress; }
function fadeSource(item, target, duration, now) { const current = sourceGainAt(item, now); item.gain.gain.cancelScheduledValues(now); item.gain.gain.setValueAtTime(current, now); item.gain.gain.linearRampToValueAtTime(target, now + duration); item.fadeFrom = current; item.fadeTo = target; item.fadeStart = now; item.fadeEnd = now + duration; }
function stopAudio(fadeSeconds = 0) { const now = ctx?.currentTime || 0; for (const item of [...sources]) { try { if (fadeSeconds > 0 && ctx && item.gain) { fadeSource(item, 0, fadeSeconds, now); item.source.onended = () => { item.source.disconnect(); item.gain.disconnect(); sources = sources.filter(source => source !== item); }; item.source.stop(now + fadeSeconds); } else { item.source.stop(); item.source.disconnect(); item.gain.disconnect(); sources = sources.filter(source => source !== item); } } catch { sources = sources.filter(source => source !== item); } } gain = null; }
function syncTimerSelection(min = chosen) { document.querySelectorAll('[data-min]').forEach(button => { const isSelected = !timerCustom && +button.dataset.min === min; button.classList.toggle('selected', isSelected); button.setAttribute('aria-pressed', String(isSelected)); }); const custom = min > 0 && (timerCustom || ![15, 30, 60].includes(min)); $('custom').classList.toggle('selected', custom); $('custom').setAttribute('aria-pressed', String(custom)); }
function prepareAudio(track) {
  if (buffers.has(track.id)) return Promise.resolve(buffers.get(track.id));
  if (pendingBuffers.has(track.id)) return pendingBuffers.get(track.id);
  ctx ??= new AudioContext();
  const pending = fetch(track.audio).then(response => {
    if (!response.ok) throw Error('音频加载失败');
    return response.arrayBuffer();
  }).then(data => ctx.decodeAudioData(data)).then(decoded => {
    buffers.set(track.id, decoded);
    while (buffers.size > 2) buffers.delete(buffers.keys().next().value);
    return decoded;
  }).finally(() => pendingBuffers.delete(track.id));
  pendingBuffers.set(track.id, pending);
  return pending;
}
function preloadAudio(track) {
  if (!native) prepareAudio(track).catch(error => console.warn('Audio preload failed:', error));
}
async function audioStart(token, crossfade = false) { ctx ??= new AudioContext(); await ctx.resume(); const decoded = await prepareAudio(selected); if (token !== epoch) return false; buffer = decoded; if (!masterGain) { masterGain = ctx.createGain(); masterGain.gain.value = 1; masterGain.connect(ctx.destination); } else if (!sources.length) { masterGain.gain.cancelScheduledValues(ctx.currentTime); masterGain.gain.setValueAtTime(1, ctx.currentTime); } const now = ctx.currentTime, fade = crossfade ? SWITCH_FADE_SECONDS : 0, fadeIn = crossfade ? SWITCH_FADE_SECONDS : 2; if (crossfade) for (const item of [...sources]) { fadeSource(item, 0, fade, now); item.source.onended = () => { item.source.disconnect(); item.gain.disconnect(); sources = sources.filter(source => source !== item); }; try { item.source.stop(now + fade); } catch {} } gain = ctx.createGain(); gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(1, now + fadeIn); gain.connect(masterGain); const source = ctx.createBufferSource(); source.buffer = decoded; source.loop = true; source.connect(gain); source.start(); sources.push({ source, gain, fadeFrom: 0, fadeTo: 1, fadeStart: now, fadeEnd: now + fadeIn }); return true; }
async function start(preserve = false) { if (playing || loading) return; const token = ++epoch; loading = true; paint(); try { if (native) { Android.setTrack(selected.id); Android.play(); } else if (!await audioStart(token)) return; if (token !== epoch) return; playing = true; if (!preserve && chosen) deadline = Date.now() + chosen * 60000; if (!document.body.classList.contains('sleep')) films[active].play().catch(console.warn); } catch (error) { stopAudio(); playing = false; if (native) Android.pause(); console.error(error); } finally { loading = false; paint(); } }
function pause() { ++epoch; ++videoEpoch; playing = false; loading = false; videoLoading = false; blend = false; deadline = 0; chosen = 0; syncTimerSelection(0); if (native) Android.pause(); stopAudio(); films.forEach(video => video.pause()); paint(); renderTimer(); }
$('play').onclick = () => playing ? pause() : start();
async function selectTrack(id, { fromWheel = false } = {}) {
  if (loading || id === selected.id) return;
  const resume = playing, previous = selected;
  selected = tracks.find(track => track.id === id);
  preloadAudio(selected);
  paint();
  if (!fromWheel) centerTrackInLoop(id);
  if (native) {
    Android.setTrack(selected.id);
    await setBackground();
    paint();
  } else if (resume) {
    const token = ++epoch, background = setBackground();
    try {
      if (await audioStart(token, true)) { playing = true; await background; }
      else if (token === epoch) selected = previous;
    } catch (error) {
      if (token === epoch) { selected = previous; await setBackground(); }
      console.warn('Audio switch failed', error);
    } finally { if (token === epoch) paint(); }
  } else {
    await setBackground();
    paint();
  }
}
function centerTrackInLoop(id) {
  if (!wheelQuery.matches) return;
  const candidates = [...soundRail.querySelectorAll(`[data-track="${id}"]`)];
  const center = soundRail.scrollLeft + soundViewport.clientWidth / 2;
  const nearest = candidates.sort((a, b) => Math.abs(a.offsetLeft + a.offsetWidth / 2 - center) - Math.abs(b.offsetLeft + b.offsetWidth / 2 - center))[0];
  if (!nearest) return;
  const target = nearest.offsetLeft - (soundViewport.clientWidth - nearest.offsetWidth) / 2;
  springSoundWheel(target);
}
function setTimer(min, custom = false) { chosen = min; timerCustom = min > 0 && custom; deadline = playing && min ? Date.now() + min * 60000 : 0; syncTimerSelection(min); $('timerToggle').classList.toggle('timer-active', min > 0); if (native) Android.setTimer(min); renderTimer(); }
$('countdown').onclick = () => { if (chosen > 0 || deadline) setTimer(0); };
function timeUnits() { return ({'zh-CN':['时','分'],ja:['時','分'],ko:['시간','분'],ru:['ч','мин'],de:['Std.','Min.'],fr:['h','min'],es:['h','min'],it:['h','min'],'pt-BR':['h','min'],en:['h','min']})[language] || ['h','min']; }
let customOpen = false, wheelInitializing = false;
const timeWheels = [{ element: $('hours'), count: 10, value: 0 }, { element: $('minutes'), count: 61, value: 30 }];
function wheelPosition(wheel, value) { wheel.value = value; wheel.element.setAttribute('aria-valuenow', String(value)); wheel.element.scrollTop = (wheel.count + value) * 36; paintTimeWheel(wheel); }
function paintTimeWheel(wheel) {
  const center = wheel.element.scrollTop / 36;
  for (let i = Math.max(0, Math.floor(center) - 3); i <= Math.min(wheel.element.children.length - 1, Math.ceil(center) + 3); i++) {
    const distance = i - center, item = wheel.element.children[i];
    item.style.transform = `rotateX(${-distance * 24}deg) scale(${1 - Math.min(3, Math.abs(distance)) * .08})`;
    item.style.opacity = String(Math.max(.2, 1 - Math.abs(distance) * .35));
  }
}
for (const wheel of timeWheels) {
  wheel.element.innerHTML = Array.from({length: wheel.count * 3}, (_, index) => `<div class="minute-option" data-value="${index % wheel.count}">${String(index % wheel.count).padStart(2, '0')}</div>`).join('');
  wheel.element.addEventListener('scroll', () => {
    if (wheelInitializing || !customOpen) return;
    let position = wheel.element.scrollTop, segment = wheel.count * 36;
    if (position < segment * .5) { wheel.element.scrollTop = position += segment; }
    else if (position >= segment * 2.5) { wheel.element.scrollTop = position -= segment; }
    paintTimeWheel(wheel);
    const value = ((Math.round(position / 36) % wheel.count) + wheel.count) % wheel.count;
    if (wheel.value !== value) { wheel.value = value; wheel.element.setAttribute('aria-valuenow', String(value)); setTimer(timeWheels[0].value * 60 + timeWheels[1].value, true); }
  });
  wheel.element.addEventListener('click', event => { const item = event.target.closest('[data-value]'); if (item) { wheelPosition(wheel, Number(item.dataset.value)); setTimer(timeWheels[0].value * 60 + timeWheels[1].value, true); } });
  wheel.element.addEventListener('keydown', event => {
    const delta = event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0;
    if (!delta) return;
    event.preventDefault(); wheelPosition(wheel, (wheel.value + delta + wheel.count) % wheel.count); setTimer(timeWheels[0].value * 60 + timeWheels[1].value, true);
  });
}
function setCustomRow(open, immediate = false) {
  const row = $('customRow');
  const token = ++customTransition;
  const currentHeight = row.getBoundingClientRect().height;
  const currentOpacity = Number(getComputedStyle(row).opacity);
  row.getAnimations().forEach(animation => { try { animation.commitStyles(); } catch {} animation.cancel(); });
  $('custom').setAttribute('aria-expanded', String(open));
  if (open) row.hidden = false;
  const targetHeight = open ? row.scrollHeight : 0;
  if (immediate || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    row.hidden = !open; row.style.height = ''; row.style.opacity = ''; row.style.transform = ''; return;
  }
  const animation = row.animate([
    { height: `${currentHeight}px`, opacity: currentHeight ? currentOpacity : 0, transform: currentHeight ? getComputedStyle(row).transform : 'translateY(-6px)' },
    { height: `${targetHeight}px`, opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(-6px)' }
  ], { duration: 280, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
  animation.onfinish = () => { if (token !== customTransition) return; row.hidden = !open; row.style.height = ''; row.style.opacity = ''; row.style.transform = ''; animation.cancel(); };
}
function setTimerPanel(expanded) {
  const panel = $('timerPanel');
  const token = ++timerPanelTransition;
  timerExpanded = expanded;
  $('timerToggle').setAttribute('aria-expanded', String(expanded));
  const currentHeight = panel.getBoundingClientRect().height;
  const currentOpacity = getComputedStyle(panel).opacity;
  const currentTransform = getComputedStyle(panel).transform;
  panel.getAnimations().forEach(animation => { try { animation.commitStyles(); } catch {} animation.cancel(); });
  if (expanded) {
    panel.hidden = false;
    panel.classList.add('expanded');
    const targetHeight = panel.scrollHeight;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { panel.style.height = 'auto'; panel.style.opacity = '1'; panel.style.transform = 'none'; return; }
    const startHeight = expanded && !currentHeight ? 0 : currentHeight;
    const startOpacity = startHeight ? currentOpacity : 0;
    const startTransform = startHeight ? currentTransform : 'translateY(-8px) scale(.985)';
    panel.style.height = `${startHeight}px`;
    const animation = panel.animate([
      { height: `${startHeight}px`, opacity: startOpacity, transform: startTransform },
      { height: `${targetHeight}px`, opacity: 1, transform: 'translateY(0) scale(1)' }
    ], { duration: 360, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
    animation.onfinish = () => { if (token === timerPanelTransition) { panel.style.height = 'auto'; panel.style.opacity = '1'; panel.style.transform = 'none'; animation.cancel(); } };
  } else {
    panel.classList.remove('expanded');
    const startHeight = currentHeight;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      panel.hidden = true; panel.style.height = ''; panel.style.opacity = ''; panel.style.transform = '';
      setCustomRow(false, true); customOpen = false; $('timerPresets').hidden = false;
      return;
    }
    const animation = panel.animate([
      { height: `${startHeight}px`, opacity: currentOpacity, transform: currentTransform },
      { height: '0px', opacity: 0, transform: 'translateY(-8px) scale(.985)' }
    ], { duration: 280, easing: 'cubic-bezier(.4,0,.8,.2)', fill: 'forwards' });
    animation.onfinish = () => { if (token === timerPanelTransition && !timerExpanded) { panel.hidden = true; panel.style.height = ''; panel.style.opacity = ''; panel.style.transform = ''; setCustomRow(false, true); customOpen = false; $('timerPresets').hidden = false; animation.cancel(); } };
  }
}
$('timerToggle').onclick = () => setTimerPanel(!timerExpanded);
document.querySelectorAll('[data-min]').forEach(button => button.onclick = () => { setTimer(chosen === +button.dataset.min ? 0 : +button.dataset.min); setCustomRow(false); });
$('custom').onclick = () => {
  customOpen = true;
  $('timerPanel').getAnimations().forEach(animation => animation.cancel());
  $('timerPanel').style.height = 'auto'; $('timerPanel').style.opacity = '1'; $('timerPanel').style.transform = 'none';
  const presets = $('timerPresets');
  const animation = presets.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'}], {duration:matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180,easing:'ease-in',fill:'forwards'});
  animation.onfinish = () => { animation.cancel(); if (!customOpen) return; presets.hidden = true; setCustomRow(true); wheelInitializing = true; wheelPosition(timeWheels[0],0); wheelPosition(timeWheels[1],30); setTimer(30,true); requestAnimationFrame(() => { wheelInitializing = false; }); };
};
let countdownExit = null;
function renderTimer() {
  const left = deadline ? Math.max(0, deadline - Date.now()) : 0;
  const minutes = deadline ? Math.ceil(left / 60000) : chosen;
  const units = timeUnits();
  const time = `${Math.floor(minutes / 60)} ${units[0]} ${String(minutes % 60).padStart(2,'0')} ${units[1]}`;
  const timerButton = $('countdown');
  if (minutes > 0) {
    if (countdownExit) { countdownExit.cancel(); countdownExit = null; }
    timerButton.hidden = false;
    timerButton.disabled = false;
    timerButton.textContent = time;
    timerButton.setAttribute('aria-label', translate('cancelTimer', { time }));
  } else if (!timerButton.hidden && !countdownExit) {
    timerButton.disabled = true;
    timerButton.setAttribute('aria-label', '');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timerButton.hidden = true;
      timerButton.textContent = '';
    } else {
      const animation = timerButton.animate([
        { opacity: 1, transform: 'scale(.96)', backgroundColor: 'rgba(225,237,220,.18)', borderColor: 'rgba(240,246,239,.42)' },
        { opacity: 1, transform: 'scale(1.02)', offset: .35 },
        { opacity: 0, transform: 'scale(.97)', backgroundColor: 'rgba(225,237,220,0)', borderColor: 'rgba(240,246,239,0)' }
      ], { duration: 280, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
      countdownExit = animation;
      animation.onfinish = () => {
        if (countdownExit !== animation) return;
        countdownExit = null;
        timerButton.hidden = true;
        timerButton.textContent = '';
        animation.cancel();
      };
    }
  }
  timerButton.title = minutes > 0 ? translate('cancelTimer', { time }) : '';
  if (deadline) {
    if (!native && masterGain && ctx) masterGain.gain.setTargetAtTime(Math.min(1, left / 30000), ctx.currentTime, .2);
    if (left === 0) { pause(); $('status').textContent = translate('timerEnded'); }
  } else if (!native && playing && masterGain && ctx) masterGain.gain.setTargetAtTime(1, ctx.currentTime, .2);
}
setInterval(renderTimer, 250);
function animate() { if (playing && !videoLoading && !document.body.classList.contains('sleep')) { const video = films[active], next = films[1 - active]; if (video.duration && video.currentTime >= video.duration - 3) { if (!blend) { blend = true; next.currentTime = 0; next.play().catch(console.warn); } const progress = Math.min(1, (video.currentTime - (video.duration - 3)) / 3); video.style.opacity = 1 - progress; next.style.opacity = progress; if (progress >= .995 || video.ended) { video.pause(); video.style.opacity = 0; next.style.opacity = 1; active = 1 - active; blend = false; } } } requestAnimationFrame(animate); }
animate();
function setMinimal(enabled, refreshBackground = true) { document.body.classList.toggle('minimal', enabled); document.body.classList.toggle('sleep', enabled); localStorage.setItem('nature-minimal', String(enabled)); $('minimalMode').checked = enabled; if (enabled) { videoEpoch++; videoLoading = false; blend = false; films.forEach(video => video.pause()); } else if (refreshBackground) setBackground(); window.updatePlayGlass?.(); }
function setMixAudio(enabled, notifyNative = true) { localStorage.setItem('nature-mix-audio', String(enabled)); $('mixAudio').checked = enabled; if (native && notifyNative) Android.setMixAudio(enabled); }
function animateSettings(open) {
  const page = $('settingsPage');
  const home = $('homePage');
  ++settingsTransition;
  settingsDesiredOpen = open;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (open) {
    page.hidden = false;
    page.setAttribute('aria-hidden', 'false');
    home.inert = true;
    home.setAttribute('aria-hidden', 'true');
    document.body.classList.add('settings-open');
    if (settingsProgress < .001) page.scrollTop = 0;
  }
  settingsTarget = open ? 1 : 0;
  if (reduced) {
    cancelAnimationFrame(settingsMotionFrame);
    settingsProgress = settingsTarget;
    settingsVelocity = 0;
    renderSettingsMotion();
    finishSettingsMotion(open);
    if (open) $('settingsBack').focus({ preventScroll: true });
    return;
  }
  if (open) $('settingsBack').focus({ preventScroll: true });
  if (!settingsMotionFrame) {
    let previousTime = 0;
    const tick = time => {
      const dt = previousTime ? Math.min((time - previousTime) / 1000, .032) : 1 / 60;
      previousTime = time;
      const omega = 14;
      const acceleration = omega * omega * (settingsTarget - settingsProgress) - 2 * omega * settingsVelocity;
      settingsVelocity += acceleration * dt;
      settingsProgress += settingsVelocity * dt;
      if (settingsProgress < 0) { settingsProgress = 0; settingsVelocity = Math.max(0, settingsVelocity); }
      if (settingsProgress > 1) { settingsProgress = 1; settingsVelocity = Math.min(0, settingsVelocity); }
      renderSettingsMotion();
      if (Math.abs(settingsTarget - settingsProgress) < .001 && Math.abs(settingsVelocity) < .008) {
        settingsProgress = settingsTarget;
        settingsVelocity = 0;
        renderSettingsMotion();
        settingsMotionFrame = 0;
        finishSettingsMotion(Boolean(settingsTarget));
        return;
      }
      settingsMotionFrame = requestAnimationFrame(tick);
    };
    settingsMotionFrame = requestAnimationFrame(tick);
  }
}
function renderSettingsMotion() {
  const page = $('settingsPage'), home = $('homePage');
  const progress = Math.max(0, Math.min(1, settingsProgress));
  page.style.transform = `translate3d(${(1 - progress) * 100}%,0,0)`;
  page.style.opacity = String(progress);
  page.style.setProperty('--glass-progress', String(progress));
  home.style.transform = `translate3d(${-12 * progress}px,0,0) scale(${1 - .015 * progress})`;
  home.style.opacity = String(1 - .22 * progress);
}
function finishSettingsMotion(open) {
  if (open) return;
  const page = $('settingsPage'), home = $('homePage');
  page.hidden = true;
  page.setAttribute('aria-hidden', 'true');
  home.inert = false;
  home.setAttribute('aria-hidden', 'false');
  document.body.classList.remove('settings-open');
  $('settings').focus({ preventScroll: true });
}
function openSettings() { animateSettings(true); }
function closeSettings() { animateSettings(false); }
window.closeSettingsFromAndroid = () => { if (!settingsDesiredOpen) return false; closeSettings(); return true; };
$('settings').onclick = openSettings; $('settingsBack').onclick = closeSettings;
$('settingsPage').addEventListener('click', event => { if (event.target === $('settingsPage')) { if (settingsDesiredOpen) closeSettings(); else openSettings(); } });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && settingsDesiredOpen) closeSettings(); });
$('settingsPage').addEventListener('pointerdown', event => {
  if (!settingsDesiredOpen || event.pointerType === 'mouse' || event.clientX > 28) return;
  settingsPageGesture = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastTime: performance.now(), velocity: 0, moved: false };
  $('settingsPage').setPointerCapture(event.pointerId);
});
let settingsPageGesture = null;
$('settingsPage').addEventListener('pointermove', event => {
  const gesture = settingsPageGesture;
  if (!gesture || gesture.id !== event.pointerId) return;
  const dx = event.clientX - gesture.startX, dy = event.clientY - gesture.startY;
  if (!gesture.moved && dx > 7 && Math.abs(dx) > Math.abs(dy) * 1.2) {
    gesture.moved = true;
    cancelAnimationFrame(settingsMotionFrame);
    settingsMotionFrame = 0;
    settingsProgress = Math.max(0, Math.min(1, settingsProgress));
    settingsVelocity = 0;
  }
  if (!gesture.moved) return;
  const now = performance.now(), dt = Math.max(1, now - gesture.lastTime);
  gesture.velocity = (event.clientX - gesture.lastX) / dt;
  gesture.lastX = event.clientX; gesture.lastTime = now;
  settingsProgress = Math.max(0, Math.min(1, settingsProgress + (event.clientX - (gesture.previousX ?? gesture.startX)) / Math.max(1, innerWidth)));
  gesture.previousX = event.clientX;
  settingsTarget = settingsProgress;
  renderSettingsMotion();
  event.preventDefault();
});
function finishSettingsPageGesture(event) {
  const gesture = settingsPageGesture;
  if (!gesture || gesture.id !== event.pointerId) return;
  settingsPageGesture = null;
  if (gesture.moved) {
    const shouldClose = settingsProgress < .72 || gesture.velocity > .45;
    const releaseVelocity = Math.abs(gesture.velocity) * 1000 / Math.max(1, innerWidth);
    settingsVelocity = shouldClose ? -releaseVelocity : releaseVelocity;
    animateSettings(!shouldClose);
  }
}
$('settingsPage').addEventListener('pointerup', finishSettingsPageGesture);
$('settingsPage').addEventListener('pointercancel', finishSettingsPageGesture);
$('languageSelect').onchange = () => setLanguage($('languageSelect').value);
$('minimalMode').onchange = () => setMinimal($('minimalMode').checked); $('mixAudio').onchange = () => setMixAudio($('mixAudio').checked);
let playPressAnimation = null;
function animatePlayPress(pressed) {
  const button = $('play');
  const current = getComputedStyle(button).transform;
  if (playPressAnimation) playPressAnimation.cancel();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { playPressAnimation = null; return; }
  const frames = pressed
    ? [{ transform: current }, { transform: 'scale(.955)' }]
    : [{ transform: current }, { transform: 'scale(1.012)', offset: .58 }, { transform: 'scale(1)' }];
  const animation = button.animate(frames, { duration: pressed ? 95 : 260, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
  playPressAnimation = animation;
  if (!pressed) animation.onfinish = () => { if (playPressAnimation === animation) { playPressAnimation = null; animation.cancel(); } };
}
document.addEventListener('pointerdown', event => {
  if (timerExpanded && !event.target.closest('.timer-area')) setTimerPanel(false);
  const button = event.target.closest('button');
  if (!button || button.closest('#sounds')) return;
  if (button.id === 'play') animatePlayPress(true);
  button.classList.add('pressing');
});
for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) document.addEventListener(eventName, event => {
  document.querySelectorAll('button.pressing').forEach(button => {
    if (button.id === 'play') animatePlayPress(false);
    button.classList.remove('pressing');
  });
}, true);
window.addEventListener('resize', () => {
  const activeElement = document.activeElement;
  if (soundViewport.clientWidth && !soundPointer) {
    measureSoundWheel();
  }
  if (activeElement && activeElement.id === 'play') $('play').focus({ preventScroll: true });
});
wheelQuery.addEventListener?.('change', () => requestAnimationFrame(() => measureSoundWheel()));
window.nativeState = state => { const restored = tracks.find(track => track.id === state.track); if (typeof state.mixAudio === 'boolean') setMixAudio(state.mixAudio, false); if (loading) return; playing = Boolean(state.playing); if (restored && restored.id !== selected.id) { selected = restored; setBackground(); paint(); centerTrackInLoop(restored.id); } deadline = state.deadline; chosen = state.minutes; syncTimerSelection(chosen); $('timerToggle').classList.toggle('timer-active', chosen > 0); paint(); renderTimer(); if (!playing) films.forEach(video => video.pause()); else if (!document.body.classList.contains('sleep')) films[active].play().catch(console.warn); };
setMinimal(localStorage.getItem('nature-minimal') === 'true', false); setMixAudio(localStorage.getItem('nature-mix-audio') === 'true', false); setLanguage(language); syncTimerSelection(0); setTimerPanel(false); requestAnimationFrame(() => { measureSoundWheel(); centerTrackInLoop(selected.id); }); if (!document.body.classList.contains('sleep')) setBackground(); if (native) { Android.setVolume(1); Android.sync(); } else preloadAudio(selected);
