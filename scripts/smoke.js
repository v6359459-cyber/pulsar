// Smoke test: loads the renderer against a stub DOM and checks the logic that is easy to break.
// Runs in plain node (no Electron, no Windows), so CI can gate a release on it: `npm test`.
const fs = require('fs'), vm = require('vm'), path = require('path');
process.chdir(path.join(__dirname, '..'));
const el = () => new Proxy(function(){}, {
  get: (t, k) => k === 'classList' ? { toggle(){}, add(){}, remove(){}, contains:()=>false }
      : k === 'style' ? {} : k === 'dataset' ? {}
      : k === 'children' || k === 'tabs' ? []
      : ['innerHTML','textContent','value','id','className'].includes(k) ? ''
      : el(),
  set: () => true, apply: () => el()
});
const doc = { addEventListener(){}, querySelector:()=>el(), querySelectorAll:()=>[], getElementById:()=>el(),
  createElement:()=>el(), documentElement:{ classList:{toggle(){}}, lang:'' }, body:el(), head:el() };
const ctx = {
  console, document: doc, window:{ addEventListener(){} }, navigator:{ mediaDevices:{}, clipboard:{} },
  localStorage:{ getItem:()=>null, setItem(){} }, setTimeout, clearTimeout, setInterval, fetch:()=>Promise.resolve({}),
  AudioContext: function(){}, speechSynthesis:{ cancel(){}, getVoices:()=>[] },
  pulsar: new Proxy({}, { get: (t,k) => k === 'ws' || k === 'pc' || k === 'chats'
      ? new Proxy({}, { get: () => () => Promise.resolve([]) })
      : /^on[A-Z]/.test(String(k)) ? () => (() => {}) : () => Promise.resolve({}) }),
  requestAnimationFrame: cb => cb(), innerWidth: 1280, innerHeight: 800, DOMException: class extends Error {},
  MediaRecorder: function(){}, OfflineAudioContext: function(){}, DataView, ArrayBuffer, Blob: function(){},
  URL, URLSearchParams, location:{href:'app://pulsar/index.html',origin:'app://pulsar'}, CSS:{supports:()=>true}, getComputedStyle:()=>({}), Set, Map, Promise, JSON, Math, Date, RegExp, Intl, TextEncoder, Array, Object, String, Number, Boolean
};
ctx.globalThis = ctx; ctx.self = ctx; ctx.window = ctx;
ctx.addEventListener = () => {}; ctx.removeEventListener = () => {}; ctx.matchMedia = () => ({ matches:false, addEventListener(){} });
vm.createContext(ctx);
for (const f of ['ui/sound.js','ui/i18n.js','ui/i18n2.js','ui/design.js','ui/app.js']) {
  try { vm.runInContext(fs.readFileSync(f,'utf8'), ctx, { filename: f }); console.log('loaded', f); }
  catch (e) { console.log('ERROR in', f, '->', e.message); process.exitCode = 1; }
}

// ---- behaviour checks on the functions changed in 2.0 ----
let bad = 0;
const ok = (name, cond, got) => { console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (cond ? '' : '  got: ' + JSON.stringify(got))); if (!cond) bad++; };
const run = src => vm.runInContext(src, ctx);

run("S.st = { lang: 'ru' }; S.runPlan = { ctx: 4096 }; S.sel = 'local'; S.running = 'm1'; S.slots = 1; S.temps = {};");

// 1. history must be cut to fit a 4096-token window, not just to 24 messages
const big = 'x'.repeat(12000);
run(`globalThis._h = fitHistory([
  { role:'user', content:'сделай сайт про кофе' },
  { role:'assistant', content:${JSON.stringify('```file:a.html\n' + big + '\n```')} },
  { role:'assistant', content:${JSON.stringify(big)} },
  { role:'assistant', content:${JSON.stringify(big)} },
  { role:'user', content:'поменяй шрифт' }])`);
const h = ctx._h;
const chars = h.reduce((n, m) => n + m.content.length, 0);
ok('fitHistory cuts to the window', chars < 4096 * 3.2 * 0.5 + 500, chars);
ok('fitHistory keeps the last message', h[h.length - 1].content === 'поменяй шрифт', h[h.length - 1].content);
ok('fitHistory leaves a digest of what was cut', /Задача|Уже сделанные файлы/.test(h[0].content), h[0].content.slice(0, 80));
run("globalThis._h2 = fitHistory([{ role:'user', content:'привет' }, { role:'assistant', content:'здравствуй' }])");
ok('fitHistory leaves a short chat alone', ctx._h2.length === 2, ctx._h2.length);

// 2. agent routing
run("B.tabs = []; S.lastAgentId = null; S.lastProject = null;");
const pick = t => { run(`globalThis._a = pickAgent(${JSON.stringify(t)}).id`); return ctx._a; };
ok('question about code -> chat',        pick('что такое рекурсия в питоне') === 'chat',    pick('что такое рекурсия в питоне'));
ok('"make a site" -> coder',             pick('сделай сайт для кофейни') === 'coder',       pick('сделай сайт для кофейни'));
ok('"find the news" -> browser',         pick('найди новости про нейросети') === 'browser', pick('найди новости про нейросети'));
ok('"sort my files" -> files',           pick('разложи файлы по папкам') === 'files',       pick('разложи файлы по папкам'));
ok('"why is it slow" -> chat',           pick('почему мой пк тормозит') === 'chat',         pick('почему мой пк тормозит'));
ok('"fix the error" with no project -> chat', pick('у меня ошибка') === 'chat',             pick('у меня ошибка'));
run("S.lastProject = { dir:'cafe', files:['cafe/index.html'] };");
ok('"fix the error" with a project -> coder', pick('у меня ошибка') === 'coder',            pick('у меня ошибка'));

// 3. the parallel-agent count the card shows must equal the one the chain uses
run("S.running='m1'; S.slots=2; S.temps={}; globalThis._s1 = realSlots('m1');");
ok('2 free slots -> 2 agents', ctx._s1 === 2, ctx._s1);
run("S.temps={hot:true}; globalThis._s2 = realSlots('m1');");
ok('hot GPU -> 1 agent', ctx._s2 === 1, ctx._s2);
run("S.temps={}; globalThis._s3 = realSlots('other');");
ok('a model that is not running -> no real number', ctx._s3 === null, ctx._s3);

// 4. chat export
run("globalThis._md = chatToMd({ title:'Кофейня', msgs:[{role:'user',content:'привет'},{role:'assistant',content:'здравствуй',agent:'PULSAR CODE'}] })");
ok('export writes the title and both sides', /# Кофейня/.test(ctx._md) && /PULSAR CODE/.test(ctx._md) && /привет/.test(ctx._md), ctx._md);

// 5. absolute paths are read-only territory
run("globalThis._p = [isAbs('C:\\\\Users\\\\x\\\\a.txt'), isAbs('cafe/index.html'), isAbs('\\\\\\\\nas\\\\share')]");
ok('isAbs spots full paths only', ctx._p[0] === true && ctx._p[1] === false && ctx._p[2] === true, ctx._p);

console.log(bad ? `\n${bad} CHECK(S) FAILED` : '\nall behaviour checks passed');
process.exitCode = bad ? 1 : 0;
