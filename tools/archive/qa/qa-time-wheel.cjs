const {chromium}=require('C:/Users/29213/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844}});
    await page.goto('http://127.0.0.1:8768/?v=timer-boundary',{waitUntil:'domcontentloaded'});
    await page.click('#timerToggle');
    await page.click('#custom');
    await page.waitForFunction(()=>customOpen&&!wheelInitializing&&chosen===30);
    await page.locator('#hours [data-value="9"]').nth(1).click();
    await page.locator('#minutes [data-value="60"]').nth(1).click();
    const maximum=await page.evaluate(()=>({hours:timeWheels[0].value,minutes:timeWheels[1].value,chosen,minuteMax:minutes.getAttribute('aria-valuemax'),visibleSixty:[...minutes.querySelectorAll('[data-value="60"]')].length}));
    if(maximum.hours!==9||maximum.minutes!==60||maximum.chosen!==600||maximum.minuteMax!=='60'||!maximum.visibleSixty) throw Error(`minute 60/hour 9 boundary failed: ${JSON.stringify(maximum)}`);
    await page.locator('#minutes').focus();
    await page.keyboard.press('ArrowDown');
    const wrap=await page.evaluate(()=>({hours:timeWheels[0].value,minutes:timeWheels[1].value,chosen}));
    if(wrap.hours!==9||wrap.minutes!==0||wrap.chosen!==540) throw Error(`minute wrap carried into hours: ${JSON.stringify(wrap)}`);
    console.log(JSON.stringify({minuteMaximum:maximum,sixtyWrapsToZeroWithoutCarry:wrap}));
  }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
