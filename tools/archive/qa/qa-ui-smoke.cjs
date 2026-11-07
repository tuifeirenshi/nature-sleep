const {chromium}=require('C:/Users/29213/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844}});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:8768/?v=ui-smoke',{waitUntil:'domcontentloaded'});
    await page.click('#settings');
    await page.waitForFunction(()=>!settingsPage.hidden&&settingsPage.getAttribute('aria-hidden')==='false'&&settingsProgress>.999);
    const languages=await page.locator('#languageSelect option').evaluateAll(options=>options.map(option=>option.value));
    for(const language of languages){
      await page.selectOption('#languageSelect',language);
      const state=await page.evaluate(()=>({lang:document.documentElement.lang,title:document.title,track:document.querySelector('[data-track="rain-jungle"]:not([data-clone]) span').textContent}));
      if(!state.lang||!state.title||!state.track||/undefined|null/.test(JSON.stringify(state))) throw Error(`language rendering failed for ${language}: ${JSON.stringify(state)}`);
    }
    const settingsBounds=await page.locator('#settingsPage').evaluate(element=>{const r=element.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,viewport:innerWidth,hidden:element.hidden}});
    if(settingsBounds.left>1||settingsBounds.right<settingsBounds.viewport-1||settingsBounds.hidden) throw Error(`settings page did not fill viewport: ${JSON.stringify(settingsBounds)}`);
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>settingsPage.hidden);
    await page.click('#timerToggle');
    await page.click('#custom');
    await page.waitForFunction(()=>customOpen&&!wheelInitializing);
    await page.locator('#play').click();
    await page.waitForFunction(()=>!timerExpanded);
    for(const [width,height] of [[360,640],[390,844],[768,1024],[1024,768],[844,390],[1440,900]]){
      await page.setViewportSize({width,height});
      const overflow=await page.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,viewportWidth:innerWidth}));
      if(overflow.width>width+1) throw Error(`${width}x${height} horizontal overflow: ${JSON.stringify(overflow)}`);
    }
    if(errors.length) throw Error(`browser errors: ${errors.join('; ')}`);
    console.log(JSON.stringify({languages:languages.length,settingsOpenClose:true,customTimerOutsideDismiss:true,viewports:6,noBrowserErrors:true}));
  }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
