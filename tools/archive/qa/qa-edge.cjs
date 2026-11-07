const playwright=require('C:/Users/29213/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const launch=playwright.chromium.launch.bind(playwright.chromium);
playwright.chromium.launch=options=>launch({...options,channel:'msedge'});
require('./qa.cjs');
