const {chromium}=require('C:/Users/29213/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage();
    const requests=[];
    page.on('request',request=>{if(request.url().includes('pink-noise-balanced.wav'))requests.push(request.url())});
    await page.goto('http://127.0.0.1:8768');
    await page.click('[data-track="binaural"]');
    await page.click('#play');
    await page.waitForFunction(()=>playing&&!loading&&selected.id==='binaural');
    const result=await page.evaluate(()=>{
      const data=buffer.getChannelData(0);
      let sum=0;
      for(let i=0;i<data.length;i++)sum+=data[i]*data[i];
      return{
        url:selected.audio,
        name:document.querySelector('[data-track="binaural"] span').textContent,
        duration:buffer.duration,
        rmsDb:20*Math.log10(Math.sqrt(sum/data.length)),
        sampleRate:buffer.sampleRate,
        channels:buffer.numberOfChannels
      };
    });
    if(!result.url.includes('pink-noise-balanced.wav?v=commons-pink-noise'))throw Error('The selected track is not using the current pink-noise asset');
    if(result.name!=='粉红噪音')throw Error(`Unexpected track label: ${result.name}`);
    if(Math.abs(result.duration-120)>.02)throw Error(`Unexpected duration: ${result.duration}`);
    if(result.rmsDb < -30 || result.rmsDb > -15)throw Error(`Unexpected RMS level: ${result.rmsDb} dB`);
    if(result.channels!==2||result.sampleRate<44100)throw Error(`Unexpected format: ${result.channels}ch at ${result.sampleRate}Hz`);
    if(!requests.some(url=>url.includes('?v=commons-pink-noise')))throw Error('The browser did not request the versioned pink-noise file');
    console.log(JSON.stringify({...result,request:requests.at(-1)}));
  }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
