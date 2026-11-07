const { chromium } = require('C:/Users/29213/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:8768');
    await page.waitForFunction(() => films[0].readyState >= 2);

    for (const [name, width, height] of [
      ['phone', 390, 844], ['small-phone', 360, 640], ['tablet', 1024, 768],
      ['desktop', 1440, 900], ['landscape', 844, 390]
    ]) {
      await page.setViewportSize({ width, height });
      await page.screenshot({ path: `D:/codex/rain-sleep/v3-${name}.png` });
      const layout = await page.evaluate(() => ({
        overflow: [...document.querySelectorAll('main button,h1')]
          .filter(element => {
            if (element.closest('#sounds')) return false;
            const rect = element.getBoundingClientRect();
            return rect.right > innerWidth + 1 || rect.left < 0 || rect.bottom > innerHeight + 1;
          }).map(element => element.id || element.textContent),
        pageOverflow: document.documentElement.scrollWidth > innerWidth + 1
      }));
      if (layout.overflow.length || layout.pageOverflow) throw Error(`${name} ${layout.overflow}`);
    }

    if (await page.locator('#volume').count()) throw Error('Volume still visible');
    await page.click('#play');
    await page.waitForFunction(() => playing && !loading);
    await page.click('#timerToggle');
    await page.click('[data-min="15"]');
    const deadlineBefore = await page.evaluate(() => deadline);
    const results = [];

    for (const id of ['rain-jungle', 'waves', 'stream', 'forest-night', 'campfire', 'sleep-music', 'binaural']) {
      await page.click(`[data-track="${id}"]`);
      await page.waitForFunction(track => playing && !loading && selected.id === track && films[active].readyState >= 2, id);
      await page.waitForTimeout(300);
      const result = await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        context.drawImage(films[active], 0, 0, 32, 32);
        return {
          id: selected.id,
          src: films[active].currentSrc,
          audio: buffer.duration,
          width: films[active].videoWidth,
          nonblank: context.getImageData(0, 0, 32, 32).data.some((value, index) => index % 4 !== 3 && value > 30),
          deadline
        };
      });
      if (!result.nonblank || result.deadline !== deadlineBefore) throw Error(`Bad switch ${id}`);
      results.push(result);
    }

    await page.evaluate(() => { deadline = Date.now() + 600; });
    await page.waitForTimeout(1200);
    if (!await page.locator('#status').innerText().then(text => text.includes('结束'))) throw Error('Timer failed');
    if (errors.length) throw Error(`Page errors: ${errors.join('; ')}`);
    console.log(JSON.stringify({ results, errors }));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
