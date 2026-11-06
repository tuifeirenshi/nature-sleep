const {chromium}=require('C:/Users/29213/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844}});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:8768',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>typeof selectTrack==='function'&&soundStride>0);
    await page.evaluate(()=>{
      const original=setBackground;
      window.setBackground=async(...args)=>{
        await new Promise(resolve=>setTimeout(resolve,900));
        return original(...args);
      };
      document.querySelector('[data-track="sleep-music"]:not([data-clone])').click();
    });
    await page.waitForTimeout(1800);
    const result=await page.evaluate(()=>{
      const center=soundRail.scrollLeft+soundViewport.clientWidth/2;
      const landed=[...soundRail.children].sort((a,b)=>Math.abs(a.offsetLeft+a.offsetWidth/2-center)-Math.abs(b.offsetLeft+b.offsetWidth/2-center))[0];
      return {selected:selected.id,landed:landed?.dataset.track,pressed:document.querySelector('[data-track="sleep-music"]:not([data-clone])')?.getAttribute('aria-pressed'),scrolling:soundIsSnapping};
    });
    if(result.selected!=='sleep-music'||result.landed!=='sleep-music'||result.pressed!=='true') throw Error(`wheel selection diverged: ${JSON.stringify(result)}`);
    await page.evaluate(()=>{
      document.querySelector('[data-track="binaural"]:not([data-clone])').click();
      document.querySelector('[data-track="waves"]:not([data-clone])').click();
    });
    await page.waitForTimeout(1800);
    const rapid=await page.evaluate(()=>{
      const center=soundRail.scrollLeft+soundViewport.clientWidth/2;
      const landed=[...soundRail.children].sort((a,b)=>Math.abs(a.offsetLeft+a.offsetWidth/2-center)-Math.abs(b.offsetLeft+b.offsetWidth/2-center))[0];
      return {selected:selected.id,landed:landed?.dataset.track};
    });
    if(rapid.selected!=='waves'||rapid.landed!=='waves') throw Error(`rapid wheel switch diverged: ${JSON.stringify(rapid)}`);
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.evaluate(()=>{
      document.querySelector('[data-track="campfire"]:not([data-clone])').click();
    });
    const animated=await page.evaluate(()=>soundIsSnapping);
    if(!animated) throw Error('wheel animation was disabled with reduced motion');
    await page.waitForFunction(()=>!soundIsSnapping);
    const reduced=await page.evaluate(()=>{
      const center=soundRail.scrollLeft+soundViewport.clientWidth/2;
      const landed=[...soundRail.children].sort((a,b)=>Math.abs(a.offsetLeft+a.offsetWidth/2-center)-Math.abs(b.offsetLeft+b.offsetWidth/2-center))[0];
      return {selected:selected.id,landed:landed?.dataset.track,layout:soundViewport.dataset.layout};
    });
    if(reduced.selected!=='campfire'||reduced.landed!=='campfire'||reduced.layout!=='wheel') throw Error(`reduced-motion wheel switch diverged: ${JSON.stringify(reduced)}`);
    await page.waitForFunction(()=>!loading);
    const nativeSync=await page.evaluate(()=>{
      const before=selected.id;
      window.nativeState({playing:false,deadline:0,minutes:0,track:'forest-night',mixAudio:false});
      const center=soundRail.scrollLeft+soundViewport.clientWidth/2;
      const landed=[...soundRail.children].sort((a,b)=>Math.abs(a.offsetLeft+a.offsetWidth/2-center)-Math.abs(b.offsetLeft+b.offsetWidth/2-center))[0];
      return {before,selected:selected.id,landed:landed?.dataset.track,loading};
    });
    await page.waitForFunction(()=>!soundIsSnapping);
    const synced=await page.evaluate(()=>({selected:selected.id,landed:centeredSoundButton()?.dataset.track}));
    if(synced.selected!=='forest-night'||synced.landed!=='forest-night') throw Error(`Android track sync diverged from wheel: ${JSON.stringify(synced)}`);
    const wheelBox=await page.locator('#sounds').boundingBox();
    await page.mouse.move(wheelBox.x+wheelBox.width/2, wheelBox.y+wheelBox.height/2);
    await page.mouse.down();
    await page.mouse.move(wheelBox.x+wheelBox.width/2-105, wheelBox.y+wheelBox.height/2, {steps:12});
    await page.mouse.up();
    await page.waitForTimeout(1400);
    const dragged=await page.evaluate(()=>({selected:selected.id,landed:centeredSoundButton()?.dataset.track}));
    if(dragged.selected==='forest-night'||dragged.selected!==dragged.landed) throw Error(`motion-off wheel drag failed: ${JSON.stringify(dragged)}`);
    await page.evaluate(()=>{cancelSoundSnap();soundRail.scrollLeft=soundLoopLow+20;updateSoundWheel()});
    const seamStart=await page.evaluate(()=>soundRail.scrollLeft);
    await page.mouse.move(wheelBox.x+wheelBox.width/2, wheelBox.y+wheelBox.height/2);
    await page.mouse.down();
    await page.mouse.move(wheelBox.x+wheelBox.width/2+80, wheelBox.y+wheelBox.height/2, {steps:12});
    const seamDrag=await page.evaluate(start=>({distance:((soundRail.scrollLeft-start+soundSegment/2)%soundSegment+soundSegment)%soundSegment-soundSegment/2,segment:soundSegment}),seamStart);
    if(Math.abs(seamDrag.distance+80)>5) throw Error(`wheel jumped at loop boundary: ${JSON.stringify(seamDrag)}`);
    await page.mouse.up();
    await page.waitForFunction(()=>!soundIsSnapping);
    const seamLanding=await page.evaluate(()=>({selected:selected.id,landed:centeredSoundButton()?.dataset.track}));
    if(seamLanding.selected!==seamLanding.landed) throw Error(`loop boundary selection diverged: ${JSON.stringify(seamLanding)}`);
    if(errors.length) throw Error(`browser errors: ${errors.join('; ')}`);
    console.log(JSON.stringify({wheelSelectionConsistent:true,...result,rapidWheelSwitch:rapid,reducedMotionWheelSwitch:reduced,androidTrackSync:synced,motionOffDrag:dragged,seamDrag,seamLanding}));
  }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
