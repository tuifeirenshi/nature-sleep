const {chromium}=require('C:/Users/29213/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844}});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{
      const nativeSetInterval=window.setInterval;
      window.__intervalCalls=0;
      window.setInterval=(...args)=>{window.__intervalCalls++;return nativeSetInterval(...args)};
      const mediaLoad=HTMLMediaElement.prototype.load;
      window.__mediaLoadCalls=0;
      HTMLMediaElement.prototype.load=function(){window.__mediaLoadCalls++;return mediaLoad.call(this)};
    });
    await page.goto('http://127.0.0.1:8768',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>typeof window.nativeState==='function'&&!videoLoading);
    const startupLoads=await page.evaluate(()=>window.__mediaLoadCalls);
    if(!(await page.evaluate(()=>videoEpoch===1))) throw Error('normal startup scheduled more than one background switch');
    if(startupLoads!==1) throw Error(`startup redundantly loaded the same video ${startupLoads} times`);

    const minimalPage=await browser.newPage();
    await minimalPage.addInitScript(()=>{
      localStorage.setItem('nature-minimal','true');
      const mediaLoad=HTMLMediaElement.prototype.load;
      window.__mediaLoadCalls=0;
      HTMLMediaElement.prototype.load=function(){window.__mediaLoadCalls++;return mediaLoad.call(this)};
    });
    await minimalPage.goto('http://127.0.0.1:8768',{waitUntil:'domcontentloaded'});
    await minimalPage.waitForFunction(()=>typeof window.nativeState==='function'&&!videoLoading);
    if(!(await minimalPage.evaluate(()=>document.body.classList.contains('sleep')&&window.__mediaLoadCalls===0))) throw Error('minimal startup loaded a hidden video');
    await minimalPage.close();

    for(let i=0;i<5;i++) await page.evaluate(()=>window.nativeState({playing:false,deadline:0,minutes:0,track:'rain-jungle',mixAudio:false}));
    const intervals=await page.evaluate(()=>window.__intervalCalls);
    if(intervals!==1) throw Error(`nativeState registered ${intervals} timer intervals`);

    await page.click('[data-track="waves"]');
    await page.waitForFunction(()=>selected.id==='waves'&&!videoLoading);
    if(!(await page.evaluate(()=>films[active].paused))) throw Error('paused track switch started the video');

    await page.evaluate(()=>{selected=tracks.find(t=>t.id==='campfire');setBackground();setMinimal(true)});
    if(!(await page.evaluate(()=>videoLoading===false&&films.every(v=>v.paused)))) throw Error('minimal mode did not cancel the pending video load');
    await page.evaluate(()=>setMinimal(false));
    await page.waitForFunction(()=>!videoLoading);

    await page.click('[data-track="waves"]');
    await page.click('[data-track="stream"]');
    await page.click('[data-track="campfire"]');
    await page.waitForFunction(()=>selected.id==='campfire'&&!videoLoading);
    if(!(await page.evaluate(()=>films[active].currentSrc.endsWith('/media/campfire-close.mp4')))) throw Error('rapid paused track switches left the wrong video active');

    await page.evaluate(()=>{
      const current=films[active],alternate=films[1-active];
      current.style.transition='opacity 600ms';current.style.opacity='.4';
      alternate.style.transition='opacity 600ms';alternate.style.opacity='.6';blend=true;
      selected=tracks.find(t=>t.id==='forest-night');
      window.__interruptedBackground=setBackground();
    });
    const interruptedOpacity=await page.evaluate(()=>({current:films[active].style.opacity,alternate:films[1-active].style.opacity}));
    if(interruptedOpacity.current!=='1'||interruptedOpacity.alternate!=='0') throw Error('interrupting the video loop fade left the scene dimmed');
    await page.evaluate(()=>window.__interruptedBackground);
    await page.waitForFunction(()=>!videoLoading&&films[active].currentSrc.endsWith('/media/summer-night4k.mp4'));

    await page.click('[data-min="15"]');
    if(!(await page.evaluate(()=>chosen===15&&deadline===0))) throw Error('timer selection while paused started its countdown');
    await page.click('#play');
    await page.waitForFunction(()=>playing&&!loading&&deadline>Date.now());
    await page.click('#play');
    await page.waitForFunction(()=>!playing&&deadline===0&&chosen===0);
    await page.click('#play');
    await page.waitForFunction(()=>playing&&!loading);
    await page.click('[data-track="stream"]');
    const interruptible=await page.locator('[data-track="campfire"]').isEnabled();
    if(!interruptible) throw Error('track buttons were disabled during audio crossfade');
    await page.waitForFunction(()=>sources.length>=2);
    await page.click('[data-track="campfire"]');
    await page.waitForFunction(()=>selected.id==='campfire'&&playing&&!loading);
    await page.waitForFunction(()=>sources.length>=2);
    if(!(await page.evaluate(()=>sources.length>=2))) throw Error('audio switch did not overlap old and new sources');
    const fadeSeconds=await page.evaluate(()=>sources.at(-1).fadeEnd-sources.at(-1).fadeStart);
    if(Math.abs(fadeSeconds-.7)>.05) throw Error(`audio handoff fade was ${fadeSeconds}s, expected 0.7s`);
    await page.waitForFunction(()=>!videoLoading);
    if(await page.evaluate(()=>films[active].paused)) throw Error('interrupted track switch left the video paused');
    const cacheSize=await page.evaluate(()=>buffers.size);
    if(cacheSize>2) throw Error(`audio decode cache grew to ${cacheSize} tracks`);

    await page.click('[data-min="15"]');
    await page.waitForFunction(()=>chosen===15&&deadline>0);
    const deadlineBefore=await page.evaluate(()=>deadline);
    await page.click('[data-min="30"]');
    await page.waitForFunction(()=>chosen===30&&deadline>0);
    const deadlineAfter=await page.evaluate(()=>deadline);
    if(deadlineAfter<=deadlineBefore) throw Error('changing the active timer did not update its deadline');

    await page.evaluate(()=>{
      window.__gainTargets=[];
      const original=masterGain.gain.setTargetAtTime.bind(masterGain.gain);
      masterGain.gain.setTargetAtTime=(value,...rest)=>{window.__gainTargets.push(value);return original(value,...rest)};
      deadline=Date.now()+10000;
      renderTimer();
    });
    await page.click('[data-min="30"]');
    if(!(await page.evaluate(()=>window.__gainTargets.at(-1)===1))) throw Error('cancelling the timer did not restore playback gain');

    await page.click('#play');
    await page.waitForFunction(()=>!playing&&deadline===0&&chosen===0);
    if(await page.locator('[data-min="15"]').evaluate(el=>el.classList.contains('selected'))) throw Error('timer option stayed selected after pause');
    for(const [width,height] of [[360,640],[1024,768],[1440,900],[844,390]]){
      await page.setViewportSize({width,height});
      const overflow=await page.evaluate(()=>[...document.querySelectorAll('main button,h1')].filter(el=>{if(el.closest('#sounds'))return false;const r=el.getBoundingClientRect();return r.left<0||r.right>innerWidth+1||r.bottom>innerHeight+1}).map(el=>el.id||el.textContent));
      if(overflow.length) throw Error(`${width}x${height} overflow: ${overflow.join(',')}`);
    }
    if(errors.length) throw Error(errors.join('; '));
    console.log(JSON.stringify({startupLoads,cacheSize,fadeSeconds,minimalStartupSkipsVideo:true,intervals,pausedSwitch:true,minimalModeCancelsVideo:true,loopFadeSwitchRecovery:true,playingSwitch:true,audioCrossfade:true,crossfadeInterruptible:interruptible,timerChange:true,pausedTimerStartsOnPlayback:true,cancelledTimerRestoresGain:true,pauseClearsTimer:true}));
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
